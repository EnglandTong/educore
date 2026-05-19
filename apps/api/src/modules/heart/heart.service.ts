import mongoose from "mongoose";

import { Journal } from "../../models/Journal.js";
import { ProudMoment } from "../../models/ProudMoment.js";
import { MoodLog } from "../../models/MoodLog.js";
import type { CreateJournalInput, CreateMoodLogInput, CreateProudMomentInput, AddReactionInput } from "./heart.schema.js";

// --- Journal ---

export async function createJournal(userId: string, input: CreateJournalInput) {
  const journal = await Journal.create({
    userId: new mongoose.Types.ObjectId(userId),
    date: input.date ? new Date(input.date) : new Date(),
    mood: input.mood,
    content: input.content,
    isPrivate: input.isPrivate
  });
  return journal.toObject();
}

export async function listJournals(userId: string, limit = 30) {
  const journals = await Journal.find({ userId })
    .sort({ date: -1 })
    .limit(limit)
    .lean()
    .exec();
  return journals;
}

// --- Proud Moments ---

export async function createProudMoment(userId: string, input: CreateProudMomentInput) {
  const moment = await ProudMoment.create({
    userId: new mongoose.Types.ObjectId(userId),
    title: input.title,
    description: input.description,
    reactions: []
  });
  return moment.toObject();
}

export async function listProudMoments(limit = 50) {
  const moments = await ProudMoment.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();
  return moments;
}

export async function addReaction(momentId: string, userId: string, input: AddReactionInput) {
  const moment = await ProudMoment.findById(momentId).exec();
  if (!moment) return null;

  // Check if user already reacted with this type
  const existingIndex = moment.reactions.findIndex(
    (r) => r.userId.toString() === userId && r.type === input.type
  );
  if (existingIndex >= 0) {
    // Toggle: remove reaction
    moment.reactions.splice(existingIndex, 1);
  } else {
    moment.reactions.push({
      userId: new mongoose.Types.ObjectId(userId),
      type: input.type,
      createdAt: new Date()
    });
  }
  await moment.save();
  return moment.toObject();
}

// --- Mood Logs ---

export async function createMoodLog(userId: string, input: CreateMoodLogInput) {
  const date = input.date ? new Date(input.date) : new Date();
  // Set to start of day
  date.setHours(0, 0, 0, 0);

  // Upsert: one mood log per day
  const log = await MoodLog.findOneAndUpdate(
    { userId, date },
    { $set: { mood: input.mood, note: input.note } },
    { upsert: true, new: true }
  ).lean().exec();

  return log;
}

export async function getMoodTrend(userId: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const logs = await MoodLog.find({
    userId,
    date: { $gte: startDate }
  })
    .sort({ date: -1 })
    .lean()
    .exec();

  return logs;
}
