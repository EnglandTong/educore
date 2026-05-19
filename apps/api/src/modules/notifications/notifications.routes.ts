import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { markNotificationRead, listNotifications } from "../../services/notification.service.js";
import { sendSuccess } from "../../utils/response.js";

const idParams = z.object({ id: z.string().min(1) });

export const notificationsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: requireAuth }, async (request, reply) => {
    const notifications = await listNotifications(request.user!.id);
    return sendSuccess(reply, request, { notifications });
  });

  app.put("/:id/read", { preHandler: requireAuth, preValidation: validateRequest({ params: idParams }) }, async (request, reply) => {
    const params = request.params as z.infer<typeof idParams>;
    const notification = await markNotificationRead(request.user!.id, params.id);
    return sendSuccess(reply, request, { notification });
  });
};
