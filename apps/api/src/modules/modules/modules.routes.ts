import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { validateRequest } from "../../middleware/validate.js";
import { getLoadedModules } from "../../services/moduleLoader.js";
import { sendSuccess } from "../../utils/response.js";

const moduleParams = z.object({ id: z.string().min(1) });

export const modulesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    return sendSuccess(reply, request, { modules: getLoadedModules() });
  });

  app.get("/:id", { preValidation: validateRequest({ params: moduleParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof moduleParams>;
    const module = getLoadedModules().find((item) => item.id === params.id);
    return sendSuccess(reply, request, { module: module ?? null });
  });

  app.get("/:id/skills", { preValidation: validateRequest({ params: moduleParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof moduleParams>;
    const module = getLoadedModules().find((item) => item.id === params.id);
    return sendSuccess(reply, request, { skills: module?.skills ?? [] });
  });
};
