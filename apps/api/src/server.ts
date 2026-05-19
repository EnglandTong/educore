import { buildApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { loadModules } from "./services/moduleLoader.js";

const app = buildApp();

async function start(): Promise<void> {
  // 生产环境安全检查：防止默认密码/配置上线
  if (process.env.NODE_ENV === 'production') {
    const DANGEROUS_DEFAULTS: [string, string][] = [
      ['JWT_SECRET', 'change-this-in-production'],
      ['MONGO_PASSWORD', 'change-this-in-production'],
      ['MONGO_USER', 'admin'],
    ];
    for (const [key, bad] of DANGEROUS_DEFAULTS) {
      if (!process.env[key] || process.env[key] === bad) {
        console.error(`FATAL: ${key} must be changed from default in production. Exiting.`);
        process.exit(1);
      }
    }
    // CORS 检查：生产环境必须设置白名单，禁止通配 true
    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === 'true') {
      console.error('FATAL: CORS_ORIGIN must be set to specific origins in production (cannot be empty or "true"). Exiting.');
      process.exit(1);
    }
  }

  await connectDatabase();
  if (process.env.NODE_ENV !== "test") {
    try {
      await connectRedis();
    } catch {
      app.log.warn("Redis unavailable — running in degraded mode (no session rotation)");
    }
  }
  await loadModules();

  await app.listen({ port: env.PORT, host: env.HOST });
}

async function shutdown(): Promise<void> {
  await app.close();
  await disconnectRedis();
  await disconnectDatabase();
}

process.on("SIGINT", () => {
  void shutdown().then(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().then(() => process.exit(0));
});

start().catch((error: unknown) => {
  app.log.error({ err: error }, "API failed to start");
  process.exit(1);
});
