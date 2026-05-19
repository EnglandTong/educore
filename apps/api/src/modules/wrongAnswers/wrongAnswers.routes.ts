import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { completeWrongAnswerReview, listWrongAnswers, markWrongAnswerMastered } from "../../services/learning.service.js";
import { sendSuccess } from "../../utils/response.js";

const idParams = z.object({ id: z.string().min(1) });
const querySchema = z.object({
  dueOnly: z.enum(["true", "false"]).optional()
});

export const wrongAnswersRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: requireAuth, preValidation: validateRequest({ query: querySchema }) }, async (request, reply) => {
    const query = request.query as z.infer<typeof querySchema>;
    const wrongAnswers = await listWrongAnswers(request.user!.id, query.dueOnly === "true");
    return sendSuccess(reply, request, { wrongAnswers });
  });

  app.get("/review-due", { preHandler: requireAuth }, async (request, reply) => {
    const wrongAnswers = await listWrongAnswers(request.user!.id, true);
    return sendSuccess(reply, request, { wrongAnswers });
  });

  app.post("/:id/reviewed", { preHandler: requireAuth, preValidation: validateRequest({ params: idParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof idParams>;
    const wrongAnswer = await completeWrongAnswerReview(request.user!.id, params.id);
    return sendSuccess(reply, request, { wrongAnswer });
  });

  app.post("/:id/mastered", { preHandler: requireAuth, preValidation: validateRequest({ params: idParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof idParams>;
    const wrongAnswer = await markWrongAnswerMastered(request.user!.id, params.id);
    return sendSuccess(reply, request, { wrongAnswer });
  });
};
