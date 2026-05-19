import type { FastifyReply, FastifyRequest } from "fastify";
import type { ApiErrorBody, ApiResponse } from "@educore/types";

function getRequestId(request: FastifyRequest): string {
  return String(request.id);
}

export function makeMeta(request: FastifyRequest) {
  return {
    timestamp: new Date().toISOString(),
    requestId: getRequestId(request)
  };
}

export function sendSuccess<T>(reply: FastifyReply, request: FastifyRequest, data: T, statusCode = 200): FastifyReply {
  const body: ApiResponse<T> = {
    success: true,
    data,
    meta: makeMeta(request)
  };
  return reply.status(statusCode).send(body);
}

export function sendFailure(
  reply: FastifyReply,
  request: FastifyRequest,
  statusCode: number,
  error: ApiErrorBody
): FastifyReply {
  return reply.status(statusCode).send({
    success: false,
    error,
    meta: makeMeta(request)
  });
}
