import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import { jwtVerify } from "jose";

import { env } from "../config/env.js";
import { AppError, warmErrors } from "../utils/errors.js";

export interface AuthUser {
  id: string;
  role: "student" | "parent" | "teacher" | "admin" | "volunteer" | "school-admin";
  email: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

const secret = new TextEncoder().encode(env.JWT_SECRET);

export const requireAuth: preHandlerHookHandler = async (request: FastifyRequest, _reply: FastifyReply) => {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", warmErrors.unauthorized);
  }

  try {
    const { payload } = await jwtVerify(authorization.slice("Bearer ".length), secret);
    request.user = {
      id: String(payload.sub),
      role: String(payload.role) as AuthUser["role"],
      email: String(payload.email)
    };
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "Your session needs a quick refresh. Please sign in again.");
  }
};

export function assertRole(...roles: AuthUser["role"][]): preHandlerHookHandler {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.user) {
      throw new AppError(401, "UNAUTHORIZED", warmErrors.unauthorized);
    }
    if (!roles.includes(request.user.role)) {
      throw new AppError(403, "FORBIDDEN", "This area is for students — let us know if you think this is a mistake.");
    }
  };
}
