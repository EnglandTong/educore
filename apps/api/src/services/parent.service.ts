import type { ProgressOverview, SubjectGuide } from "@educore/types";

import { Announcement } from "../models/Announcement.js";
import { GuardianLink } from "../models/GuardianLink.js";
import { LearningSession } from "../models/LearningSession.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import { getProgressOverview } from "./progress.service.js";
import { getModuleManifest } from "./question.service.js";
import { listConsentedGuardianLinks, requireGuardianLink } from "./access.service.js";

export interface LinkedChildDTO {
  id: string;
  name: string;
  avatar?: string;
  nickname?: string;
  gradeLevel?: string;
  relationship: string;
  consentGiven: boolean;
  consentDate?: string;
}

export interface ChildActivityDTO {
  childId: string;
  recentSessions: Array<{
    id: string;
    type: string;
    status: string;
    moduleId: string;
    totalQuestions: number;
    correctCount: number;
    startedAt: string;
    completedAt?: string;
    encouragement: string;
  }>;
  recentMessages: Array<{
    id: string;
    conversationId: string;
    content: string;
    sentAt: string;
    senderName: string;
    senderRole: "teacher" | "parent";
  }>;
}

export async function listLinkedChildren(parentId: string): Promise<LinkedChildDTO[]> {
  const links = await listConsentedGuardianLinks(parentId);
  const childIds = links.map((link: { studentId: unknown }) => String(link.studentId));
  const children = await User.find({ _id: { $in: childIds }, role: "student" }).lean();

  return links.flatMap((link: { studentId: unknown; relationship: string; consentGiven: boolean; consentDate?: Date | string }) => {
    const child = children.find((item: { _id: unknown }) => String(item._id) === String(link.studentId));
    if (!child) {
      return [];
    }

    return [{
      id: String(child._id),
      name: child.name,
      avatar: child.avatar ?? undefined,
      nickname: child.nickname ?? undefined,
      gradeLevel: child.gradeLevel ?? undefined,
      relationship: link.relationship,
      consentGiven: link.consentGiven,
      consentDate: link.consentDate ? new Date(link.consentDate).toISOString() : undefined
    }];
  });
}

export async function linkChildByInviteCode(parentId: string, inviteCode: string, relationship: string) {
  const student = await User.findOne({ inviteCode, role: "student" }).lean();
  if (!student) {
    throw new AppError(404, "NOT_FOUND", "We could not find that invitation code yet. Let's check the code and try again.");
  }

  const existing = await GuardianLink.findOne({ parentId, studentId: student._id }).lean();
  if (existing?.consentGiven) {
    return existing;
  }

  const link = await GuardianLink.findOneAndUpdate(
    { parentId, studentId: student._id },
    {
      $set: {
        relationship,
        consentGiven: existing?.consentGiven ?? false,
        consentDate: existing?.consentDate ?? undefined
      },
      $setOnInsert: {
        parentId,
        studentId: student._id
      }
    },
    { upsert: true, new: true }
  ).lean();

  return link;
}

export async function updateGuardianConsent(parentId: string, studentId: string, consentGiven: boolean) {
  await requireGuardianLink(parentId, studentId, false);
  const updated = await GuardianLink.findOneAndUpdate(
    { parentId, studentId },
    {
      $set: {
        consentGiven,
        consentDate: consentGiven ? new Date() : undefined
      }
    },
    { new: true }
  ).lean();

  if (!updated) {
    throw new AppError(404, "NOT_FOUND", "We could not find that connection yet. Let's try again.");
  }

  return updated;
}

export async function getChildProgress(parentId: string, studentId: string): Promise<ProgressOverview> {
  await requireGuardianLink(parentId, studentId, true);
  return getProgressOverview(studentId);
}

export async function getChildActivity(parentId: string, studentId: string): Promise<ChildActivityDTO> {
  await requireGuardianLink(parentId, studentId, true);

  const recentSessions = await LearningSession.find({ studentId }).sort({ startedAt: -1 }).limit(5).lean();
  const conversations = await Conversation.find({ parentId, studentId }).lean();
  const conversationIds = conversations.map((conversation: { _id: unknown }) => conversation._id);
  const messages = await Message.find({ conversationId: { $in: conversationIds } }).sort({ sentAt: -1 }).limit(5).lean();

  return {
    childId: studentId,
    recentSessions: recentSessions.map((session: {
      _id: unknown;
      type: string;
      status: string;
      moduleId: string;
      config?: { totalQuestions?: number };
      stats?: { correctCount?: number };
      startedAt: Date | string;
      completedAt?: Date | string;
    }) => ({
      id: String(session._id),
      type: session.type,
      status: session.status,
      moduleId: session.moduleId,
      totalQuestions: session.config?.totalQuestions ?? 0,
      correctCount: session.stats?.correctCount ?? 0,
      startedAt: new Date(session.startedAt).toISOString(),
      completedAt: session.completedAt ? new Date(session.completedAt).toISOString() : undefined,
      encouragement: session.status === "completed"
        ? "Your child completed a practice session and kept moving forward."
        : "Your child is still building momentum, and that steady effort is valuable."
    })),
    recentMessages: messages.map((message: {
      _id: unknown;
      conversationId: unknown;
      content: string;
      sentAt: Date | string;
      senderName: string;
      senderRole: "teacher" | "parent";
    }) => ({
      id: String(message._id),
      conversationId: String(message.conversationId),
      content: message.content,
      sentAt: new Date(message.sentAt).toISOString(),
      senderName: message.senderName,
      senderRole: message.senderRole
    }))
  };
}

export async function getSubjectGuide(parentId: string, moduleId: string, skillId: string): Promise<SubjectGuide> {
  const linkedChildren = await listConsentedGuardianLinks(parentId);
  if (linkedChildren.length === 0) {
    throw new AppError(403, "FORBIDDEN", "This guide is available after a child is linked with consent.");
  }

  const module = getModuleManifest(moduleId);
  if (!module) {
    throw new AppError(404, "NOT_FOUND", "We could not find that subject guide yet.");
  }

  const skill = module.skills.find((item) => item.id === skillId);
  if (!skill) {
    throw new AppError(404, "NOT_FOUND", "We could not find that skill guide yet.");
  }

  return {
    moduleId,
    skillId,
    skillName: skill.name,
    title: skill.name,
    whatIsIt: skill.description,
    howToHelp: [
      "Offer one short example at a time.",
      "Let your child explain the rule back in their own words.",
      "Celebrate effort and keep the next step small."
    ],
    commonMistakes: [
      "Rushing through the question before reading the whole prompt.",
      "Mixing the skill with a nearby grammar pattern.",
      "Skipping the final self-check."
    ],
    signsOfProgress: [
      "Your child is answering with more consistency.",
      "They recover faster after a tricky item.",
      "They can explain the rule without guessing as much."
    ],
    ifStruggling: [
      "Pause and revisit one example with a calmer pace.",
      "Use a simpler sentence before trying the target pattern again.",
      "Return to a stronger skill first, then come back."
    ]
  };
}

export async function listParentAnnouncements(parentId: string) {
  const children = await listConsentedGuardianLinks(parentId);
  const gradeLevels = new Set(
    (
      await User.find({ _id: { $in: children.map((child: { studentId: unknown }) => child.studentId) } }).lean()
    ).map((child: { gradeLevel?: string }) => child.gradeLevel).filter((gradeLevel: string | undefined): gradeLevel is string => Boolean(gradeLevel))
  );

  const announcements = await Announcement.find({
    $or: [
      { targetAudience: "all" },
      { targetAudience: "grade", classIds: { $in: Array.from(gradeLevels) } },
      { targetAudience: "class", classIds: { $in: Array.from(gradeLevels) } }
    ]
  }).sort({ publishedAt: -1 }).lean();

  return announcements;
}

export async function ensureParentOwnsChild(parentId: string, studentId: string) {
  await requireGuardianLink(parentId, studentId, true);
}
