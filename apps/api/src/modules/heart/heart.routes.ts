import type { FastifyPluginAsync } from "fastify";

import { requireAuth } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/errors.js";
import {
  createJournalSchema,
  createProudMomentSchema,
  addReactionSchema,
  createMoodLogSchema
} from "./heart.schema.js";
import {
  createJournal,
  listJournals,
  createProudMoment,
  listProudMoments,
  addReaction,
  createMoodLog,
  getMoodTrend
} from "./heart.service.js";

export const heartRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", requireAuth);

  // --- Journal ---

  app.post("/api/v1/heart/journal", async (request, reply) => {
    const user = request.user!;
    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Heart space is for students.");
    }
    const body = createJournalSchema.parse(request.body);
    const journal = await createJournal(user.id, body);
    return sendSuccess(reply, request, {
      journal: {
        id: String(journal._id),
        date: journal.date,
        mood: journal.mood,
        content: journal.content,
        isPrivate: journal.isPrivate,
        createdAt: journal.createdAt
      }
    }, 201);
  });

  app.get("/api/v1/heart/journal", async (request, reply) => {
    const user = request.user!;
    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Heart space is for students.");
    }
    const journals = await listJournals(user.id);
    return sendSuccess(reply, request, {
      journals: journals.map((j) => ({
        id: String(j._id),
        date: j.date,
        mood: j.mood,
        content: j.content,
        isPrivate: j.isPrivate,
        createdAt: j.createdAt
      }))
    });
  });

  // --- Proud Moments ---

  app.post("/api/v1/heart/proud-moments", async (request, reply) => {
    const user = request.user!;
    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Heart space is for students.");
    }
    const body = createProudMomentSchema.parse(request.body);
    const moment = await createProudMoment(user.id, body);
    return sendSuccess(reply, request, {
      moment: {
        id: String(moment._id),
        userId: String(moment.userId),
        title: moment.title,
        description: moment.description,
        reactions: moment.reactions,
        createdAt: moment.createdAt
      }
    }, 201);
  });

  app.get("/api/v1/heart/proud-moments", async (request, reply) => {
    const moments = await listProudMoments();
    return sendSuccess(reply, request, {
      moments: moments.map((m) => ({
        id: String(m._id),
        userId: String(m.userId),
        title: m.title,
        description: m.description,
        reactions: m.reactions.map((r) => ({
          userId: String(r.userId),
          type: r.type,
          createdAt: r.createdAt
        })),
        createdAt: m.createdAt
      }))
    });
  });

  app.post("/api/v1/heart/proud-moments/:id/react", async (request, reply) => {
    const user = request.user!;
    const { id } = request.params as { id: string };
    const body = addReactionSchema.parse(request.body);
    const moment = await addReaction(id, user.id, body);
    if (!moment) {
      throw new AppError(404, "NOT_FOUND", "Proud moment not found.");
    }
    return sendSuccess(reply, request, { moment });
  });

  // --- Mood Log ---

  app.post("/api/v1/heart/mood", async (request, reply) => {
    const user = request.user!;
    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Heart space is for students.");
    }
    const body = createMoodLogSchema.parse(request.body);
    const log = await createMoodLog(user.id, body);
    return sendSuccess(reply, request, {
      moodLog: {
        id: String(log._id),
        date: log.date,
        mood: log.mood,
        note: log.note,
        createdAt: log.createdAt
      }
    }, 201);
  });

  app.get("/api/v1/heart/mood/trend", async (request, reply) => {
    const user = request.user!;
    const query = request.query as { days?: string };
    const days = query.days ? parseInt(query.days, 10) : 30;
    const logs = await getMoodTrend(user.id, days);
    return sendSuccess(reply, request, {
      trend: logs.map((l) => ({
        id: String(l._id),
        date: l.date,
        mood: l.mood,
        note: l.note,
        createdAt: l.createdAt
      }))
    });
  });
};
