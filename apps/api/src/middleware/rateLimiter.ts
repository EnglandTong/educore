import type { FastifyPluginAsync } from "fastify";
import rateLimit from "@fastify/rate-limit";

import { warmErrors } from "../utils/errors.js";

export const rateLimiterPlugin: FastifyPluginAsync = async (app) => {
  await app.register(rateLimit, {
    max: 120,
    timeWindow: "1 minute",
    errorResponseBuilder: (request) => ({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: warmErrors.rateLimited
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: String(request.id)
      }
    })
  });
};
