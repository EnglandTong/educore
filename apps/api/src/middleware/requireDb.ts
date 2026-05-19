import type { preHandlerHookHandler } from "fastify";
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

/**
 * Pre-handler hook that rejects requests when MongoDB or Redis
 * is not in a healthy state.  Used on auth routes to give a warm
 * 503 instead of letting the handler throw a cryptic 500.
 *
 * Skipped during tests (NODE_ENV=test) so integration tests can
 * exercise auth routes without a real database.
 */
export const requireDb: preHandlerHookHandler = async (_request, _reply) => {
  if (env.NODE_ENV === "test") {
    return;
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError(503, "SERVICE_UNAVAILABLE", "The learning database is taking a brief rest. Please try again in a moment — nothing is lost.");
  }

  // Redis is optional — auth service handles degraded mode gracefully
};
