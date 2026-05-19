import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { getCurrentUserProfile, updateCurrentUserProfile } from "../../services/auth.service.js";
import { sendSuccess } from "../../utils/response.js";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().url().optional(),
  nickname: z.string().optional(),
  age: z.number().int().positive().optional(),
  gradeLevel: z.string().optional(),
  preferences: z
    .object({
      language: z.enum(["en", "zh"]).optional(),
      theme: z.enum(["light", "dark", "auto"]).optional(),
      dailyGoal: z.number().int().positive().optional()
    })
    .optional()
});

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get("/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await getCurrentUserProfile(request.user!.id);
    return sendSuccess(reply, request, { user });
  });

  app.put("/me", { preHandler: requireAuth, preValidation: validateRequest({ body: updateSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof updateSchema>;
    const user = await updateCurrentUserProfile(request.user!.id, body as Record<string, unknown>);
    return sendSuccess(reply, request, { user });
  });
};
