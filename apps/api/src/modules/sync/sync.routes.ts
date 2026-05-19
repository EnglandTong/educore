import type { FastifyPluginAsync } from "fastify";

import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validate.js";
import { processSyncBatch, getSyncStatus } from "./sync.service.js";
import { syncBatchBodySchema, syncStatusQuerySchema } from "./sync.schema.js";
import type { SyncBatchBody } from "./sync.schema.js";
import { sendSuccess } from "../../utils/response.js";

export const syncRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/batch",
    {
      preHandler: requireAuth,
      preValidation: validateRequest({ body: syncBatchBodySchema }),
    },
    async (request, reply) => {
      const body = request.body as SyncBatchBody;
      const result = await processSyncBatch(
        request.user!.id,
        body,
      );
      return sendSuccess(reply, request, result, result.failed > 0 ? 207 : 200);
    },
  );

  app.get(
    "/status",
    {
      preHandler: requireAuth,
      preValidation: validateRequest({ query: syncStatusQuerySchema }),
    },
    async (request, reply) => {
      const status = await getSyncStatus(request.user!.id);
      return sendSuccess(reply, request, status);
    },
  );
};
