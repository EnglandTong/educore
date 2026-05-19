import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { listQuestions } from "../../services/question.service.js";
import { sendSuccess } from "../../utils/response.js";

const querySchema = z.object({
  moduleId: z.string().min(1).optional(),
  skillId: z.string().min(1).optional(),
  questionType: z.enum([
    "multiple-choice",
    "gap-filling",
    "transformation",
    "matching",
    "cloze",
    "true-false",
    "error-correction",
    "open"
  ]).optional(),
  limit: z.coerce.number().int().positive().max(50).default(20)
});

export const questionsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: requireAuth, preValidation: validateRequest({ query: querySchema }) }, async (request, reply) => {
    const query = request.query as z.infer<typeof querySchema>;
    const questions = await listQuestions(query);
    return sendSuccess(reply, request, { questions });
  });
};
