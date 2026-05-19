import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import {
  answerWrongAnswerSessionQuestion,
  endLearningSession,
  getDiagnosticReport,
  getNextLearningQuestion,
  getNextWrongAnswerSessionQuestion,
  startChallengeSession,
  startReviewSession,
  startLearningSession,
  submitLearningAnswer
} from "../../services/learning.service.js";
import { sendSuccess } from "../../utils/response.js";

const startSchema = z.object({
  moduleId: z.string().min(1).optional()
});

const answerSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  answer: z.union([z.string().min(1), z.array(z.string().min(1))]),
  timeSpent: z.number().nonnegative().optional(),
  hintsUsed: z.number().int().nonnegative().optional()
});

export const learningRoutes: FastifyPluginAsync = async (app) => {
  app.post("/diagnostic/start", { preHandler: requireAuth, preValidation: validateRequest({ body: startSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof startSchema>;
    const result = await startLearningSession(request.user!.id, "diagnostic", body.moduleId);
    return sendSuccess(reply, request, result, 201);
  });

  app.get("/diagnostic/next", { preHandler: requireAuth }, async (request, reply) => {
    const result = await getNextLearningQuestion(request.user!.id, "diagnostic");
    return sendSuccess(reply, request, result);
  });

  app.post("/diagnostic/answer", { preHandler: requireAuth, preValidation: validateRequest({ body: answerSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof answerSchema>;
    const result = await submitLearningAnswer(request.user!.id, body);
    return sendSuccess(reply, request, result);
  });

  app.get("/diagnostic/report", { preHandler: requireAuth }, async (request, reply) => {
    const result = await getDiagnosticReport(request.user!.id);
    return sendSuccess(reply, request, result);
  });

  app.post("/training/start", { preHandler: requireAuth, preValidation: validateRequest({ body: startSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof startSchema>;
    const result = await startLearningSession(request.user!.id, "training", body.moduleId);
    return sendSuccess(reply, request, result, 201);
  });

  app.get("/training/next", { preHandler: requireAuth }, async (request, reply) => {
    const result = await getNextLearningQuestion(request.user!.id, "training");
    return sendSuccess(reply, request, result);
  });

  app.post("/training/answer", { preHandler: requireAuth, preValidation: validateRequest({ body: answerSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof answerSchema>;
    const result = await submitLearningAnswer(request.user!.id, body);
    return sendSuccess(reply, request, result);
  });

  app.post("/training/end", { preHandler: requireAuth }, async (request, reply) => {
    const result = await endLearningSession(request.user!.id, "training");
    return sendSuccess(reply, request, result);
  });

  app.post("/review/start", { preHandler: requireAuth }, async (request, reply) => {
    const result = await startReviewSession(request.user!.id);
    return sendSuccess(reply, request, result, 201);
  });
  app.get("/review/next", { preHandler: requireAuth }, async (request, reply) => {
    const result = await getNextWrongAnswerSessionQuestion(request.user!.id, "review");
    return sendSuccess(reply, request, result);
  });
  app.post("/review/answer", { preHandler: requireAuth, preValidation: validateRequest({ body: answerSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof answerSchema>;
    const result = await answerWrongAnswerSessionQuestion(request.user!.id, body, "review");
    return sendSuccess(reply, request, result);
  });
  app.post("/challenge/start", { preHandler: requireAuth }, async (request, reply) => {
    const result = await startChallengeSession(request.user!.id);
    return sendSuccess(reply, request, result, 201);
  });
  app.post("/challenge/answer", { preHandler: requireAuth, preValidation: validateRequest({ body: answerSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof answerSchema>;
    const result = await answerWrongAnswerSessionQuestion(request.user!.id, body, "challenge");
    return sendSuccess(reply, request, result);
  });
  app.get("/challenge/result", { preHandler: requireAuth }, async (request, reply) => {
    const result = await endLearningSession(request.user!.id, "challenge");
    return sendSuccess(reply, request, result);
  });
};
