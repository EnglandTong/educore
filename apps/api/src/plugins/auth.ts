import type { FastifyPluginAsync } from "fastify";

import { requireAuth } from "../middleware/auth.js";

export const authPlugin: FastifyPluginAsync = async (app) => {
  app.decorate("requireAuth", requireAuth);
};

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: typeof requireAuth;
  }
}
