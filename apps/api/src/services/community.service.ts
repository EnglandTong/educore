import type { Announcement, Conversation, Message } from "@educore/types";

import { Announcement as AnnouncementModel } from "../models/Announcement.js";
import { Conversation as ConversationModel } from "../models/Conversation.js";
import { GuardianLink } from "../models/GuardianLink.js";
import { Message as MessageModel } from "../models/Message.js";
import { TeacherAssignment } from "../models/TeacherAssignment.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/errors.js";
import { listConsentedGuardianLinks } from "./access.service.js";

export interface AnnouncementInput {
  title: string;
  content: string;
  type: Announcement["type"];
  targetAudience: Announcement["targetAudience"];
  classIds?: string[];
  schoolId?: string;
}

export interface ConversationInput {
  studentId: string;
  teacherId?: string;
  parentId?: string;
  initialMessage?: string;
}

export interface MessageInput {
  content: string;
}

function toAnnouncement(doc: any, isRead = false): Announcement {
  return {
    id: String(doc._id),
    schoolId: doc.schoolId,
    authorId: String(doc.authorId),
    authorName: doc.authorName,
    title: doc.title,
    content: doc.content,
    type: doc.type,
    targetAudience: doc.targetAudience,
    classIds: doc.classIds,
    publishedAt: new Date(doc.publishedAt).toISOString(),
    isRead
  };
}

function toConversation(doc: any, unreadCount = 0): Conversation {
  return {
    id: String(doc._id),
    teacherId: String(doc.teacherId),
    teacherName: doc.teacherName,
    parentId: String(doc.parentId),
    parentName: doc.parentName,
    studentId: String(doc.studentId),
    studentName: doc.studentName,
    lastMessage: doc.lastMessage,
    lastMessageAt: doc.lastMessageAt ? new Date(doc.lastMessageAt).toISOString() : undefined,
    unreadCount
  };
}

async function upsertTeacherAssignment(teacherId: string, studentId: string) {
  await TeacherAssignment.updateOne(
    { teacherId, studentId },
    { $setOnInsert: { teacherId, studentId } },
    { upsert: true }
  );
}

export async function listAnnouncementsForUser(userId: string, role: string) {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError(404, "NOT_FOUND", "We could not find your account yet.");
  }

  if (role === "parent") {
    const links = await listConsentedGuardianLinks(userId);
    const childGrades = new Set(
      (await User.find({ _id: { $in: links.map((link: { studentId: unknown }) => link.studentId) } }).lean())
        .map((child: { gradeLevel?: string }) => child.gradeLevel)
        .filter((grade: string | undefined): grade is string => Boolean(grade))
    );

    const announcements = await AnnouncementModel.find({
      $or: [
        { targetAudience: "all" },
        { targetAudience: "grade", classIds: { $in: Array.from(childGrades) } },
        { targetAudience: "class", classIds: { $in: Array.from(childGrades) } }
      ]
    }).sort({ publishedAt: -1 }).lean();

    return announcements.map((doc: { readBy?: unknown[] }) => toAnnouncement(doc, Array.isArray(doc.readBy) ? doc.readBy.some((reader: unknown) => String(reader) === userId) : false));
  }

  const announcements = await AnnouncementModel.find().sort({ publishedAt: -1 }).lean();
  return announcements.map((doc: { readBy?: unknown[] }) => toAnnouncement(doc, Array.isArray(doc.readBy) ? doc.readBy.some((reader: unknown) => String(reader) === userId) : false));
}

export async function createAnnouncement(author: { id: string; name: string; role: string }, input: AnnouncementInput) {
  if (!["teacher", "admin"].includes(author.role)) {
    throw new AppError(403, "FORBIDDEN", "Only teachers and administrators can share announcements.");
  }

  const created = await AnnouncementModel.create({
    schoolId: input.schoolId ?? "default-school",
    authorId: author.id,
    authorName: author.name,
    title: input.title,
    content: input.content,
    type: input.type,
    targetAudience: input.targetAudience,
    classIds: input.classIds ?? []
  });

  return toAnnouncement(created.toObject(), false);
}

export async function markAnnouncementRead(userId: string, announcementId: string) {
  const updated = await AnnouncementModel.findByIdAndUpdate(
    announcementId,
    { $addToSet: { readBy: userId } },
    { new: true }
  ).lean();
  if (!updated) {
    throw new AppError(404, "NOT_FOUND", "We could not find that announcement yet.");
  }

  return toAnnouncement(updated, true);
}

async function resolveConversationAccess(userId: string, role: string, conversationId: string) {
  const conversation = await ConversationModel.findById(conversationId).lean();
  if (!conversation) {
    throw new AppError(404, "NOT_FOUND", "We could not find that conversation yet.");
  }

  if (role === "teacher" && String(conversation.teacherId) !== userId) {
    throw new AppError(403, "FORBIDDEN", "This conversation belongs to another classroom space.");
  }
  if (role === "parent" && String(conversation.parentId) !== userId) {
    throw new AppError(403, "FORBIDDEN", "This conversation belongs to another family space.");
  }

  return conversation;
}

export async function listConversationsForUser(userId: string, role: string) {
  if (role !== "teacher" && role !== "parent") {
    throw new AppError(403, "FORBIDDEN", "This conversation area is reserved for parents and teachers.");
  }

  const query: Record<string, unknown> = role === "teacher" ? { teacherId: userId } : { parentId: userId };
  const conversations = await ConversationModel.find(query).sort({ lastMessageAt: -1 }).lean();

  return conversations.map((conversation: { unreadByUserIds?: unknown[] }) => {
    const unreadCount = Array.isArray(conversation.unreadByUserIds)
      ? conversation.unreadByUserIds.filter((recipient: unknown) => String(recipient) === userId).length
      : 0;
    return toConversation(conversation, unreadCount);
  });
}

export async function createConversation(user: { id: string; name: string; role: string }, input: ConversationInput) {
  if (user.role === "parent") {
    const parentId = user.id;
    const parentLinks = await listConsentedGuardianLinks(parentId);
    const link = parentLinks.find((item: { studentId: unknown }) => String(item.studentId) === input.studentId);
    if (!link) {
      throw new AppError(403, "FORBIDDEN", "This child is not linked to your account yet.");
    }
    if (!input.teacherId) {
      throw new AppError(400, "VALIDATION_ERROR", "Please choose a teacher to start the conversation.");
    }

    const student = await User.findById(input.studentId).lean();
    const teacher = await User.findById(input.teacherId).lean();
    if (!student || !teacher) {
      throw new AppError(404, "NOT_FOUND", "We could not find the people for that conversation yet.");
    }

    const existing = await ConversationModel.findOne({ parentId, teacherId: input.teacherId, studentId: input.studentId }).lean();
    if (existing) {
      await upsertTeacherAssignment(input.teacherId, input.studentId);
      return toConversation(existing, 0);
    }

    const created = await ConversationModel.create({
      parentId,
      teacherId: input.teacherId,
      studentId: input.studentId,
      parentName: user.name,
      teacherName: teacher.name,
      studentName: student.name,
      lastMessage: input.initialMessage,
      lastMessageAt: input.initialMessage ? new Date() : undefined,
      unreadByUserIds: input.initialMessage ? [input.teacherId] : []
    });

    if (input.initialMessage) {
      await MessageModel.create({
        conversationId: created._id,
        senderId: user.id,
        senderName: user.name,
        senderRole: "parent",
        content: input.initialMessage,
        sentAt: new Date()
      });
    }

    await upsertTeacherAssignment(input.teacherId, input.studentId);

    return toConversation(created.toObject(), 0);
  }

  if (user.role === "teacher") {
    if (!input.studentId) {
      throw new AppError(400, "VALIDATION_ERROR", "Please choose a student to start the conversation.");
    }

    const student = await User.findById(input.studentId).lean();
    if (!student) {
      throw new AppError(404, "NOT_FOUND", "We could not find that student yet.");
    }

    let parentId = input.parentId;
    if (parentId) {
      const link = await GuardianLink.findOne({ parentId, studentId: student._id, consentGiven: true }).lean();
      if (!link) {
        throw new AppError(403, "FORBIDDEN", "This family connection is not ready yet.");
      }
    } else {
      const link = await GuardianLink.findOne({ studentId: student._id, consentGiven: true }).lean();
      if (!link) {
        throw new AppError(403, "FORBIDDEN", "This family connection is not ready yet.");
      }
      parentId = String(link.parentId);
    }

    const parent = await User.findById(parentId).lean();
    if (!parent) {
      throw new AppError(404, "NOT_FOUND", "We could not find that parent account yet.");
    }

    const existing = await ConversationModel.findOne({ parentId, teacherId: user.id, studentId: input.studentId }).lean();
    if (existing) {
      await upsertTeacherAssignment(user.id, input.studentId);
      return toConversation(existing, 0);
    }

    const created = await ConversationModel.create({
      parentId,
      teacherId: user.id,
      studentId: input.studentId,
      parentName: parent.name,
      teacherName: user.name,
      studentName: student.name,
      lastMessage: input.initialMessage,
      lastMessageAt: input.initialMessage ? new Date() : undefined,
      unreadByUserIds: input.initialMessage ? [parentId] : []
    });

    if (input.initialMessage) {
      await MessageModel.create({
        conversationId: created._id,
        senderId: user.id,
        senderName: user.name,
        senderRole: "teacher",
        content: input.initialMessage,
        sentAt: new Date()
      });
    }

    await upsertTeacherAssignment(user.id, input.studentId);

    return toConversation(created.toObject(), 0);
  }

  throw new AppError(403, "FORBIDDEN", "This conversation area is reserved for parents and teachers.");
}

export async function listMessagesForUser(userId: string, role: string, conversationId: string) {
  await resolveConversationAccess(userId, role, conversationId);
  const messages = await MessageModel.find({ conversationId }).sort({ sentAt: 1 }).lean();
  return messages.map((message: {
    _id: unknown;
    conversationId: unknown;
    senderId: unknown;
    senderName: string;
    senderRole: "teacher" | "parent";
    content: string;
    sentAt: Date | string;
    readAt?: Date | string;
  }) => ({
    id: String(message._id),
    conversationId: String(message.conversationId),
    senderId: String(message.senderId),
    senderName: message.senderName,
    senderRole: message.senderRole,
    content: message.content,
    sentAt: new Date(message.sentAt).toISOString(),
    readAt: message.readAt ? new Date(message.readAt).toISOString() : undefined
  })) as Message[];
}

export async function sendMessageInConversation(user: { id: string; name: string; role: string }, conversationId: string, input: MessageInput) {
  const conversation = await resolveConversationAccess(user.id, user.role, conversationId);
  const senderRole = user.role === "teacher" ? "teacher" : "parent";
  const recipientId = senderRole === "teacher" ? String(conversation.parentId) : String(conversation.teacherId);

  const message = await MessageModel.create({
    conversationId,
    senderId: user.id,
    senderName: user.name,
    senderRole,
    content: input.content,
    sentAt: new Date()
  });

  await ConversationModel.findByIdAndUpdate(conversationId, {
    lastMessage: input.content,
    lastMessageAt: new Date(),
    unreadByUserIds: [recipientId]
  });

  return {
    id: String(message._id),
    conversationId: String(message.conversationId),
    senderId: String(message.senderId),
    senderName: message.senderName,
    senderRole: message.senderRole,
    content: message.content,
    sentAt: new Date(message.sentAt).toISOString(),
    readAt: undefined
  } as Message;
}
