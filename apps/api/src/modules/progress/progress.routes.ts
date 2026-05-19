import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { getProgressOverview, getProgressTimeline, getSkillMasteryList } from "../../services/progress.service.js";
import { sendSuccess } from "../../utils/response.js";

const moduleParams = z.object({ moduleId: z.string().min(1) });

export const progressRoutes: FastifyPluginAsync = async (app) => {
  app.get("/overview", { preHandler: requireAuth }, async (request, reply) => {
    const overview = await getProgressOverview(request.user!.id);
    return sendSuccess(reply, request, overview);
  });

  app.get("/:moduleId/skills", { preHandler: requireAuth, preValidation: validateRequest({ params: moduleParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof moduleParams>;
    const skills = await getSkillMasteryList(request.user!.id, params.moduleId);
    return sendSuccess(reply, request, { skills });
  });

  app.get("/history", { preHandler: requireAuth }, async (request, reply) => {
    const overview = await getProgressOverview(request.user!.id);
    return sendSuccess(reply, request, { points: overview.modules });
  });

  app.get("/:moduleId/timeline", { preHandler: requireAuth, preValidation: validateRequest({ params: moduleParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof moduleParams>;
    const timeline = await getProgressTimeline(request.user!.id, params.moduleId);
    return sendSuccess(reply, request, { timeline });
  });
};
