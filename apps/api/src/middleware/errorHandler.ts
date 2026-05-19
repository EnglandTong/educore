import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { AppError, warmErrors } from "../utils/errors.js";
import { sendFailure } from "../utils/response.js";

function validationDetails(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message
  }));
}

function isDatabaseConnectionError(error: Error): boolean {
  return (
    error instanceof mongoose.Error.MongooseServerSelectionError ||
    error.name === "MongoServerSelectionError" ||
    error.name === "MongoNetworkError" ||
    error.message?.includes("MongoDB") ||
    error.message?.includes("mongoose") ||
    (error.name === "MongooseError" && error.message?.includes("buffer"))
  );
}

function isRedisConnectionError(error: Error): boolean {
  return (
    error.name === "RedisError" ||
    error.name === "ReplyError" ||
    error.message?.includes("Redis") ||
    error.message?.includes("ioredis") ||
    error.message?.includes("ECONNREFUSED") ||
    error.message?.includes("connect ETIMEDOUT")
  );
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AppError) {
      sendFailure(reply, request, error.statusCode, {
        code: error.code,
        message: error.message,
        details: error.details
      });
      return;
    }

    if (error instanceof ZodError) {
      sendFailure(reply, request, 400, {
        code: "VALIDATION_ERROR",
        message: warmErrors.validation,
        details: validationDetails(error)
      });
      return;
    }

    // Warm 503 for database connection failures — no need for a bare 500
    if (isDatabaseConnectionError(error)) {
      request.log.warn({ err: error }, "Database connection issue");
      sendFailure(reply, request, 503, {
        code: "SERVICE_UNAVAILABLE",
        message: "Our learning database is taking a cozy rest. Give it a few seconds and try again — we will be here."
      });
      return;
    }

    // Warm 503 for Redis connection failures
    if (isRedisConnectionError(error)) {
      request.log.warn({ err: error }, "Redis connection issue");
      sendFailure(reply, request, 503, {
        code: "SERVICE_UNAVAILABLE",
        message: "The session server is recharging for a moment. Please try again shortly — your spot is safe."
      });
      return;
    }

    request.log.error({ err: error }, "Unhandled request error");
    sendFailure(reply, request, 500, {
      code: "INTERNAL_ERROR",
      message: warmErrors.internal
    });
  });
}
