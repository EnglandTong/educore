import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";

import { AppError, warmErrors } from "../utils/errors.js";

/**
 * Middleware that ensures the user has the school-admin role and is associated
 * with a school. Optionally validates that the user manages a specific schoolId.
 */
export function requireSchoolAdmin(schoolIdParam?: string): preHandlerHookHandler {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", warmErrors.unauthorized);
    }

    if (user.role !== "school-admin" && user.role !== "admin") {
      throw new AppError(403, "FORBIDDEN", "Only school administrators can perform this action.");
    }

    // Verify user has a schoolId
    const userRecord = await (
      await import("../models/User.js")
    ).User.findById(user.id)
      .select("schoolId")
      .lean()
      .exec();

    if (!userRecord?.schoolId) {
      throw new AppError(404, "NOT_FOUND", "No school associated with your account.");
    }

    // If a specific schoolId is required, verify it matches
    if (schoolIdParam) {
      const params = request.params as Record<string, string>;
      const targetSchoolId = params[schoolIdParam];
      if (targetSchoolId && String(userRecord.schoolId) !== targetSchoolId) {
        throw new AppError(403, "FORBIDDEN", "You do not have permission to manage this school.");
      }
    }
  };
}

/**
 * Helper to get the school ID associated with a school-admin user.
 */
export async function getAdminSchoolId(userId: string): Promise<string> {
  const User = (await import("../models/User.js")).User;
  const user = await User.findById(userId).select("schoolId").lean().exec();
  if (!user?.schoolId) {
    throw new AppError(404, "NOT_FOUND", "No school associated with your account.");
  }
  return String(user.schoolId);
}
