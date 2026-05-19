import type { FastifyPluginAsync } from "fastify";
import rateLimit from "@fastify/rate-limit";

import { requireAuth, assertRole } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/response.js";
import { aiChatSchema, aiExplainSchema, aiSuggestSchema, aiEncourageSchema } from "./ai.schema.js";
import { aiChat, aiExplain, aiSuggest, aiEncourage, getProviderHealthStatus } from "./ai.service.js";
import { filterInput } from "./content-filter.js";

export const aiRoutes: FastifyPluginAsync = async (app) => {
  // Apply auth + role check to all routes in this plugin
  app.addHook("onRequest", requireAuth);
  app.addHook("preHandler", assertRole("student"));

  // Apply 20 req/hour rate limit per student for all AI endpoints
  await app.register(rateLimit, {
    max: 20,
    timeWindow: "1 hour",
    keyGenerator: (request) => request.user?.id ?? "anonymous",
    errorResponseBuilder: () => ({
      success: false,
      error: {
        code: "AI_RATE_LIMITED",
        message: "You've asked all your questions for now — take a break and come back with fresh energy in a little while!",
      },
    }),
  });

  // POST /api/v1/ai/chat — general AI chat
  app.post("/api/v1/ai/chat", async (request, reply) => {
    const body = aiChatSchema.parse(request.body);
    const inputFilter = filterInput(body.question);
    if (!inputFilter.passed) {
      return sendSuccess(reply, request, {
        answer: "Let's keep our conversation kind and focused on learning. Could you rephrase your question?",
        source: "filter",
      });
    }
    const result = await aiChat({ question: inputFilter.sanitized });
    return sendSuccess(reply, request, result);
  });

  // POST /api/v1/ai/explain — explain an answer
  app.post("/api/v1/ai/explain", async (request, reply) => {
    const body = aiExplainSchema.parse(request.body);
    const result = await aiExplain(body);
    return sendSuccess(reply, request, result);
  });

  // POST /api/v1/ai/suggest — suggest learning activities
  app.post("/api/v1/ai/suggest", async (request, reply) => {
    const body = aiSuggestSchema.parse(request.body);
    const result = await aiSuggest(body);
    return sendSuccess(reply, request, result);
  });

  // POST /api/v1/ai/encourage — get encouragement
  app.post("/api/v1/ai/encourage", async (request, reply) => {
    const body = aiEncourageSchema.parse(request.body);
    const result = await aiEncourage(body);
    return sendSuccess(reply, request, result);
  });

  // GET /api/v1/ai/providers — 健康检查端点（管理员用）
  app.get("/api/v1/ai/providers", {
    preHandler: assertRole("admin")
  }, async (request, reply) => {
    const status = await getProviderHealthStatus();
    return sendSuccess(reply, request, { providers: status });
  });
};
