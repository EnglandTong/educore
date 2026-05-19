import { randomUUID } from "node:crypto";
import Fastify from "fastify";
import mongoose from "mongoose";

import { registerErrorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { checkinRoutes } from "./modules/checkins/checkin.routes.js";
import { communityRoutes } from "./modules/community/community.routes.js";
import { learningRoutes } from "./modules/learning/learning.routes.js";
import { modulesRoutes } from "./modules/modules/modules.routes.js";
import { notificationsRoutes } from "./modules/notifications/notifications.routes.js";
import { parentRoutes } from "./modules/parent/parent.routes.js";
import { progressRoutes } from "./modules/progress/progress.routes.js";
import { questionsRoutes } from "./modules/questions/questions.routes.js";
import { teacherRoutes } from "./modules/teacher/teacher.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { wrongAnswersRoutes } from "./modules/wrongAnswers/wrongAnswers.routes.js";
import { heartRoutes } from "./modules/heart/heart.routes.js";
import { volunteerRoutes } from "./modules/volunteer/volunteer.routes.js";
import { qaRoutes } from "./modules/qa/qa.routes.js";
import { schoolRoutes } from "./modules/school/school.routes.js";
import { aiRoutes } from "./modules/ai/ai.routes.js";
import { donationRoutes } from "./modules/donation/donation.routes.js";
import { learningPathRoutes } from "./modules/learningPath/learningPath.routes.js";
import { syncRoutes } from "./modules/sync/sync.routes.js";
import { authPlugin } from "./plugins/auth.js";
import { corsPlugin } from "./plugins/cors.js";
import { compressionPlugin } from "./plugins/compress.js";
import { rateLimiterPlugin } from "./middleware/rateLimiter.js";
import { swaggerPlugin } from "./plugins/swagger.js";
import { getRedis } from "./config/redis.js";
import { getLoadedModules } from "./services/moduleLoader.js";
import { sendSuccess } from "./utils/response.js";

const READY_STATES: readonly string[] = ["disconnected", "connected", "connecting", "disconnecting"];
const REDIS_STATUSES: readonly string[] = ["wait", "connecting", "connect", "ready", "close", "end", "reconnecting"];

function mongoReadyState(): string {
  const state = mongoose.connection.readyState;
  return READY_STATES[state] ?? "unknown";
}

export function buildApp() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === "test";

  const app = Fastify({
    logger: !isTest
      ? {
          level: isProduction ? 'info' : 'debug',
          ...(isProduction
            ? {}
            : { transport: { target: 'pino-pretty', options: { colorize: true } } }
          ),
        }
      : false,
    genReqId: () => randomUUID()
  });

  registerErrorHandler(app);

  app.register(corsPlugin);
  app.register(compressionPlugin);
  app.register(rateLimiterPlugin);
  app.register(swaggerPlugin);
  app.register(authPlugin);

  app.get("/health", async (request, reply) => {
    const mongoState = mongoReadyState();
    const redisClient = getRedis();
    const redisState = REDIS_STATUSES.includes(redisClient.status)
      ? redisClient.status
      : "unknown";
    return sendSuccess(reply, request, {
      status: mongoState === "connected" && (redisState === "ready" || redisState === "connect") ? "ok" : "degraded",
      uptimeSec: Math.round(process.uptime()),
      memoryRssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      loadedModules: getLoadedModules().length,
      connections: {
        mongodb: mongoState,
        redis: redisState
      }
    });
  });

  app.register(authRoutes, { prefix: "/api/v1/auth" });
  app.register(usersRoutes, { prefix: "/api/v1/users" });
  app.register(checkinRoutes);
  app.register(modulesRoutes, { prefix: "/api/v1/modules" });
  app.register(learningRoutes, { prefix: "/api/v1/learning" });
  app.register(progressRoutes, { prefix: "/api/v1/progress" });
  app.register(questionsRoutes, { prefix: "/api/v1/questions" });
  app.register(wrongAnswersRoutes, { prefix: "/api/v1/wrong-answers" });
  app.register(communityRoutes, { prefix: "/api/v1/community" });
  app.register(parentRoutes, { prefix: "/api/v1/parent" });
  app.register(teacherRoutes, { prefix: "/api/v1/teacher" });
  app.register(notificationsRoutes, { prefix: "/api/v1/notifications" });

  // Phase 2 modules
  app.register(heartRoutes);
  app.register(volunteerRoutes);
  app.register(qaRoutes);
  app.register(schoolRoutes);
  app.register(aiRoutes);
  app.register(donationRoutes);
  app.register(learningPathRoutes);
  app.register(syncRoutes, { prefix: "/api/v1/sync" });

  return app;
}
