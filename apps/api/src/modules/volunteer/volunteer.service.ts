import mongoose from "mongoose";

import { VolunteerProfile } from "../../models/VolunteerProfile.js";
import { QAAnswer } from "../../models/QAAnswer.js";
import type { RegisterVolunteerInput } from "./volunteer.schema.js";

export async function registerVolunteer(userId: string, input: RegisterVolunteerInput) {
  const existing = await VolunteerProfile.findOne({ userId }).exec();
  if (existing) {
    existing.expertise = input.expertise;
    if (input.bio !== undefined) existing.bio = input.bio;
    await existing.save();
    return existing.toObject();
  }

  const profile = await VolunteerProfile.create({
    userId: new mongoose.Types.ObjectId(userId),
    expertise: input.expertise,
    bio: input.bio,
    status: "pending",
    stats: { questionsAnswered: 0, helpfulCount: 0, totalContributions: 0 }
  });
  return profile.toObject();
}

export async function getVolunteerProfile(userId: string) {
  const profile = await VolunteerProfile.findOne({ userId }).lean().exec();
  return profile;
}

export async function getVolunteerStats(userId: string) {
  const answers = await QAAnswer.find({ volunteerId: userId }).lean().exec();
  const totalAnswered = answers.length;
  const totalRatings = answers.filter((a) => a.rating).length;
  const avgRating = totalRatings > 0
    ? answers.reduce((sum, a) => sum + (a.rating ?? 0), 0) / totalRatings
    : 0;

  return {
    totalAnswered,
    totalRatings,
    avgRating: Math.round(avgRating * 10) / 10
  };
}
