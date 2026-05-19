import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireDb } from "../../middleware/requireDb.js";
import { validateRequest } from "../../middleware/validate.js";
import { sendSuccess } from "../../utils/response.js";
import { loginUser, refreshTokenPair, registerUser } from "../../services/auth.service.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schema.js";

export const authRoutes: FastifyPluginAsync = async (app) => {
  // All auth routes need DB + Redis — warm 503 if unavailable
  app.addHook("preHandler", requireDb);

  app.post("/register", { preValidation: validateRequest({ body: registerSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof registerSchema>;
    const result = await registerUser(body);
    return sendSuccess(reply, request, result, 201);
  });

  app.post("/login", { preValidation: validateRequest({ body: loginSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof loginSchema>;
    const result = await loginUser(body);
    return sendSuccess(reply, request, result);
  });

  app.post("/refresh", { preValidation: validateRequest({ body: refreshSchema }) }, async (request, reply) => {
    const body = request.body as z.infer<typeof refreshSchema>;
    const result = await refreshTokenPair(body.refreshToken);
    return sendSuccess(reply, request, result);
  });
};
