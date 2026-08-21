import type { FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";

export const corsPlugin: FastifyPluginAsync = async (app) => {
  const corsOrigin = process.env.CORS_ORIGIN;
  const nodeEnv = process.env.NODE_ENV;

  let origin: string | string[] | boolean;
  if (corsOrigin) {
    origin = corsOrigin.split(",").map((s) => s.trim());
  } else if (nodeEnv === 'production') {
    // 生产环境必须设置 CORS_ORIGIN，否则拒绝启动（由 server.ts 检查）
    origin = [];
  } else {
    origin = true; // 仅开发环境允许所有源
  }

  await app.register(cors, { origin, credentials: true });

  // Keep CORS headers on normal and error responses as well. The plugin's
  // preflight path alone is insufficient for browser-visible API failures.
  app.addHook("onSend", async (request, reply, payload) => {
    const requestOrigin = request.headers.origin;
    const allowed = Array.isArray(origin)
      ? typeof requestOrigin === "string" && origin.includes(requestOrigin)
      : origin === true || (typeof origin === "string" && origin === requestOrigin);
    if (allowed && requestOrigin) {
      reply.header("Access-Control-Allow-Origin", requestOrigin);
      reply.header("Access-Control-Allow-Credentials", "true");
      reply.header("Vary", "Origin");
    }
    return payload;
  });
};
