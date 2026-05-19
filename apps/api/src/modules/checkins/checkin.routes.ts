import type { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";
import { z } from "zod";

import { CheckIn } from "../../models/CheckIn.js";
import { requireAuth } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/errors.js";

// --- Validation ---

const createCheckInSchema = z.object({
  mood: z.enum(["sunny", "cloudy", "rainy", "stormy"]),
  emoji: z.string().max(10).optional(),
  note: z.string().max(500).optional()
});

// --- Warm response messages ---

const WARM_CONFIRMATIONS: Record<string, string[]> = {
  sunny: [
    "What a wonderful day! Thanks for sharing your sunshine.",
    "Your smile brightens our day too! Keep shining.",
    "So glad to hear you're feeling great today!"
  ],
  cloudy: [
    "An okay day is still a day worth noticing. Thanks for checking in.",
    "Some days are cloudy, and that's perfectly fine. We're glad you're here.",
    "Thank you for taking a moment to share how you're doing."
  ],
  rainy: [
    "Thank you for sharing — that takes courage. We're here with you.",
    "Some days feel heavy. You're not alone. Thanks for letting us know.",
    "We hear you. Take things at your own pace today."
  ],
  stormy: [
    "We're really glad you reached out. You don't have to go through this alone.",
    "Thank you for trusting us with how you really feel. We care about you.",
    "That sounds incredibly hard. Please know that you matter, and we're here."
  ]
};

function pickWarmMessage(mood: string): string {
  const messages: string[] = WARM_CONFIRMATIONS[mood] ?? WARM_CONFIRMATIONS.cloudy!;
  return messages[Math.floor(Math.random() * messages.length)]!;
}

// --- Routes ---

export const checkinRoutes: FastifyPluginAsync = async (app) => {
  // All check-in routes require authentication
  app.addHook("onRequest", requireAuth);

  // POST /api/v1/students/me/checkins — save today's check-in
  app.post("/api/v1/students/me/checkins", async (request, reply) => {
    const user = request.user as { id: string; role: string };

    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Check-ins are a personal space just for students.");
    }

    const body = createCheckInSchema.parse(request.body);
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    // Check if already checked in today
    const existing = await CheckIn.findOne({ studentId: user.id, date: today }).exec();
    if (existing) {
      // Update existing (change of mood during the day)
      existing.mood = body.mood;
      if (body.emoji !== undefined) existing.emoji = body.emoji;
      if (body.note !== undefined) existing.note = body.note;
      await existing.save();

      return sendSuccess(reply, request, {
        checkIn: {
          id: String(existing._id),
          studentId: user.id,
          mood: existing.mood,
          emoji: existing.emoji,
          note: existing.note,
          date: existing.date,
          createdAt: existing.createdAt!.toISOString()
        },
        message: `Updated your mood for today. ${pickWarmMessage(existing.mood)}`
      });
    }

    const checkIn = await CheckIn.create({
      studentId: new mongoose.Types.ObjectId(user.id),
      date: today,
      mood: body.mood,
      emoji: body.emoji,
      note: body.note
    });

    return sendSuccess(reply, request, {
      checkIn: {
        id: String(checkIn._id),
        studentId: user.id,
        mood: checkIn.mood,
        emoji: checkIn.emoji,
        note: checkIn.note,
        date: checkIn.date,
        createdAt: checkIn.createdAt!.toISOString()
      },
      message: pickWarmMessage(checkIn.mood)
    }, 201);
  });

  // GET /api/v1/students/me/checkins — view check-in history
  app.get("/api/v1/students/me/checkins", async (request, reply) => {
    const user = request.user as { id: string; role: string };

    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Check-ins are a personal space just for students.");
    }

    const checkIns = await CheckIn.find({ studentId: user.id })
      .sort({ date: -1 })
      .limit(90)
      .lean()
      .exec();

    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (checkIns.some((ci: any) => ci.date === dateStr)) {
        streak++;
      } else if (i > 0) {
        break; // Streak broken
      }
    }

    return sendSuccess(reply, request, {
      checkIns: checkIns.map((ci: any) => ({
        id: String(ci._id),
        studentId: String(ci.studentId),
        mood: ci.mood,
        emoji: ci.emoji,
        note: ci.note,
        date: ci.date,
        createdAt: new Date(ci.createdAt).toISOString()
      })),
      streak,
      total: checkIns.length
    });
  });

  // GET /api/v1/students/me/checkins/today — get today's check-in (for UI state)
  app.get("/api/v1/students/me/checkins/today", async (request, reply) => {
    const user = request.user as { id: string; role: string };

    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Check-ins are a personal space just for students.");
    }

    const today = new Date().toISOString().slice(0, 10);
    const checkIn = await CheckIn.findOne({ studentId: user.id, date: today }).lean().exec();

    if (!checkIn) {
      return sendSuccess(reply, request, { checkedIn: false, checkIn: null });
    }

    return sendSuccess(reply, request, {
      checkedIn: true,
      checkIn: {
        id: String(checkIn._id),
        studentId: String(checkIn.studentId),
        mood: checkIn.mood,
        emoji: checkIn.emoji,
        note: checkIn.note,
        date: checkIn.date,
        createdAt: new Date(checkIn.createdAt!).toISOString()
      }
    });
  });
};
