import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { assertRole } from "../../services/access.service.js";
import { getClassOverview, getClassWeakAreas, getStudentSummary } from "../../services/teacher.service.js";
import { sendSuccess } from "../../utils/response.js";

const studentParams = z.object({ id: z.string().min(1) });

export const teacherRoutes: FastifyPluginAsync = async (app) => {
  app.get("/class/overview", { preHandler: requireAuth }, async (request, reply) => {
    assertRole(request.user!, ["teacher", "admin"]);
    const overview = await getClassOverview(request.user!.id);
    return sendSuccess(reply, request, { overview });
  });

  app.get("/students/:id/summary", { preHandler: requireAuth, preValidation: validateRequest({ params: studentParams }) }, async (request, reply) => {
    assertRole(request.user!, ["teacher", "admin"]);
    const params = request.params as z.infer<typeof studentParams>;
    const summary = await getStudentSummary(request.user!.id, params.id);
    return sendSuccess(reply, request, { summary });
  });

  app.get("/class/weak-areas", { preHandler: requireAuth }, async (request, reply) => {
    assertRole(request.user!, ["teacher", "admin"]);
    const weakAreas = await getClassWeakAreas(request.user!.id);
    return sendSuccess(reply, request, { weakAreas });
  });
};
