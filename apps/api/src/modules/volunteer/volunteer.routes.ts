import type { FastifyPluginAsync } from "fastify";

import { requireAuth } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/errors.js";
import { registerVolunteerSchema } from "./volunteer.schema.js";
import { registerVolunteer, getVolunteerProfile, getVolunteerStats } from "./volunteer.service.js";

export const volunteerRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", requireAuth);

  // POST /api/v1/volunteer/register — register as a volunteer
  app.post("/api/v1/volunteer/register", async (request, reply) => {
    const user = request.user!;
    const body = registerVolunteerSchema.parse(request.body);
    const profile = await registerVolunteer(user.id, body);
    return sendSuccess(reply, request, {
      profile: {
        id: String(profile._id),
        userId: String(profile.userId),
        expertise: profile.expertise,
        bio: profile.bio,
        status: profile.status,
        stats: profile.stats,
        createdAt: profile.createdAt
      }
    }, 201);
  });

  // GET /api/v1/volunteer/profile — get own volunteer profile
  app.get("/api/v1/volunteer/profile", async (request, reply) => {
    const user = request.user!;
    const profile = await getVolunteerProfile(user.id);
    if (!profile) {
      throw new AppError(404, "NOT_FOUND", "Volunteer profile not found. Register first.");
    }
    return sendSuccess(reply, request, { profile });
  });

  // GET /api/v1/volunteer/profile/:id — get any volunteer profile
  app.get("/api/v1/volunteer/profile/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const profile = await getVolunteerProfile(id);
    if (!profile) {
      throw new AppError(404, "NOT_FOUND", "Volunteer profile not found.");
    }
    return sendSuccess(reply, request, { profile });
  });

  // GET /api/v1/volunteer/stats — get volunteer stats
  app.get("/api/v1/volunteer/stats", async (request, reply) => {
    const user = request.user!;
    const stats = await getVolunteerStats(user.id);
    return sendSuccess(reply, request, { stats });
  });
};
