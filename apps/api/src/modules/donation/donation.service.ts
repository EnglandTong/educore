import { Donation } from "../../models/Donation.js";
import type { CreateDonationInput, DonationImpact, DonationInfo } from "./donation.schema.js";

const PROJECT_INFO: DonationInfo = {
  mission: "为每个孩子提供优质教育",
  missionDetail:
    "EduCore 致力于为教育资源匮乏地区的孩子们搭建一个温暖、可及的学习成长平台。" +
    "每一笔捐赠都直接用于课程开发、服务器运维、奖学金资助和教师培训，让更多孩子享受到个性化的学习支持。",
  totalRaised: 0,
  totalDonors: 0,
  studentsHelped: 2847,
  schoolsSupported: 12,
  fundsBreakdown: [
    { label: "课程内容开发", percentage: 40, description: "互动练习、AI 辅导、诊断评估" },
    { label: "平台运维与基础设施", percentage: 25, description: "服务器、带宽、数据安全" },
    { label: "学生奖学金", percentage: 20, description: "为困难家庭学生提供免费学习资源" },
    { label: "教师培训与支持", percentage: 15, description: "培训教师使用平台，提升教学质量" }
  ]
};

export async function createDonation(input: CreateDonationInput) {
  const donation = await Donation.create({
    donorName: input.donorName,
    email: input.email,
    amount: input.amount,
    message: input.message,
    isPublic: input.isPublic,
    status: "completed",
    completedAt: new Date()
  });
  return donation.toObject();
}

export async function listDonations(limit = 50) {
  const donations = await Donation.find({ isPublic: true, status: "completed" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();
  return donations;
}

export async function getDonationById(donationId: string) {
  const donation = await Donation.findById(donationId).lean().exec();
  return donation;
}

export async function getDonationInfo(): Promise<DonationInfo> {
  const stats = await Donation.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        totalRaised: { $sum: "$amount" },
        totalDonors: { $addToSet: "$email" },
        totalDonations: { $sum: 1 }
      }
    }
  ]).exec();

  if (stats.length > 0) {
    return {
      ...PROJECT_INFO,
      totalRaised: Math.round(stats[0].totalRaised * 100) / 100,
      totalDonors: stats[0].totalDonors.length
    };
  }

  return PROJECT_INFO;
}

export async function getDonationImpact(): Promise<DonationImpact> {
  const stats = await Donation.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        totalRaised: { $sum: "$amount" },
        totalDonations: { $sum: 1 },
        totalDonors: { $addToSet: "$email" },
        largestDonation: { $max: "$amount" },
        avgDonation: { $avg: "$amount" }
      }
    }
  ]).exec();

  const defaultStats = {
    totalRaised: 0,
    totalDonations: 0,
    totalDonors: 0,
    largestDonation: 0,
    avgDonation: 0
  };

  const merged = stats.length > 0
    ? {
        totalRaised: Math.round(stats[0].totalRaised * 100) / 100,
        totalDonations: stats[0].totalDonations,
        totalDonors: stats[0].totalDonors.length,
        largestDonation: Math.round(stats[0].largestDonation * 100) / 100,
        avgDonation: Math.round(stats[0].avgDonation * 100) / 100
      }
    : defaultStats;

  return {
    ...merged,
    studentsHelped: 2847,
    schoolsSupported: 12,
    recentStories: [
      {
        name: "张老师",
        quote: "自从使用了 EduCore，我们山区学校的孩子们第一次感受到了个性化学习的乐趣。",
        role: "乡村小学教师"
      },
      {
        name: "小李",
        quote: "以前觉得数学很难，现在每天最期待的就是打开 EduCore 做练习。",
        role: "五年级学生"
      },
      {
        name: "王校长",
        quote: "这个平台不仅教知识，更在培养孩子们的学习信心。",
        role: "希望小学校长"
      }
    ]
  };
}
