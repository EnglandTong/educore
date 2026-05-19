import type { FastifyPluginAsync } from "fastify";

import { requireAuth } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/errors.js";
import { createQuestionSchema, createAnswerSchema, rateAnswerSchema } from "./qa.schema.js";
import {
  listQuestions,
  createQuestion,
  getQuestionById,
  createAnswer,
  rateAnswer
} from "./qa.service.js";

export const qaRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", requireAuth);

  // GET /api/v1/qa/questions — list questions (optional ?status filter)
  app.get("/api/v1/qa/questions", async (request, reply) => {
    const query = request.query as { status?: string };
    const questions = await listQuestions(query.status);
    return sendSuccess(reply, request, { questions });
  });

  // POST /api/v1/qa/questions — create a new question (students)
  app.post("/api/v1/qa/questions", async (request, reply) => {
    const user = request.user!;
    if (user.role !== "student") {
      throw new AppError(403, "FORBIDDEN", "Only students can ask questions.");
    }
    const body = createQuestionSchema.parse(request.body);
    const question = await createQuestion(user.id, body);
    return sendSuccess(reply, request, {
      question: {
        id: String(question._id),
        studentId: String(question.studentId),
        moduleId: question.moduleId,
        skillId: question.skillId,
        content: question.content,
        status: question.status,
        createdAt: question.createdAt
      }
    }, 201);
  });

  // GET /api/v1/qa/questions/:id — get question with answers
  app.get("/api/v1/qa/questions/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const question = await getQuestionById(id);
    if (!question) {
      throw new AppError(404, "NOT_FOUND", "Question not found.");
    }
    return sendSuccess(reply, request, { question });
  });

  // POST /api/v1/qa/questions/:id/answers — answer a question (volunteers)
  app.post("/api/v1/qa/questions/:id/answers", async (request, reply) => {
    const user = request.user!;
    if (user.role !== "volunteer") {
      throw new AppError(403, "FORBIDDEN", "Only volunteers can answer questions.");
    }
    const { id } = request.params as { id: string };
    const body = createAnswerSchema.parse(request.body);
    const answer = await createAnswer(id, user.id, body);
    if (!answer) {
      throw new AppError(404, "NOT_FOUND", "Question not found.");
    }
    return sendSuccess(reply, request, {
      answer: {
        id: String(answer._id),
        questionId: String(answer.questionId),
        volunteerId: String(answer.volunteerId),
        content: answer.content,
        isAccepted: answer.isAccepted,
        createdAt: answer.createdAt
      }
    }, 201);
  });

  // POST /api/v1/qa/answers/:id/rate — rate an answer
  app.post("/api/v1/qa/answers/:id/rate", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = rateAnswerSchema.parse(request.body);
    const answer = await rateAnswer(id, body);
    if (!answer) {
      throw new AppError(404, "NOT_FOUND", "Answer not found.");
    }
    return sendSuccess(reply, request, { answer });
  });
};
