import type { FastifyReply, FastifyRequest, preValidationHookHandler } from "fastify";
import type { ZodTypeAny, z } from "zod";

export interface RequestSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export function validateRequest(schemas: RequestSchemas): preValidationHookHandler {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (schemas.body) {
      request.body = schemas.body.parse(request.body) as z.infer<typeof schemas.body>;
    }
    if (schemas.params) {
      request.params = schemas.params.parse(request.params) as z.infer<typeof schemas.params>;
    }
    if (schemas.query) {
      request.query = schemas.query.parse(request.query) as z.infer<typeof schemas.query>;
    }
  };
}
