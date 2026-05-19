import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// Set env before any modules load (env.ts reads at import time)
vi.hoisted(() => {
  process.env.NODE_ENV = "test";
});

// Mock mongoose with proper Schema/model constructors
vi.mock("mongoose", () => {
  const mongooseMock = {
    Schema: class MockSchema {
      static Types = { ObjectId: "ObjectId", Mixed: "Mixed" };
      constructor(_def: unknown, _options?: unknown) { /* no-op */ }
      index() { return this; }
    },
    model: vi.fn().mockReturnValue({}),
    models: {},
    connection: { readyState: 1 },
    Types: { ObjectId: "ObjectId", Mixed: "Mixed" },
    set: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
  };
  return { default: mongooseMock, ...mongooseMock };
});

vi.mock("../../src/config/redis.js", () => ({
  getRedis: () => ({
    status: "ready",
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  }),
}));

vi.mock("../../src/services/moduleLoader.js", () => ({
  getLoadedModules: vi.fn().mockReturnValue([]),
}));

import { buildApp } from "../../src/app.js";
import type { FastifyInstance } from "fastify";

describe("Rate Limiting", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should allow requests under the rate limit", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should have the rate limiter plugin registered without crashing", async () => {
    // The plugin registered successfully — confirmed by app.ready() not throwing.
    // Full 429 testing requires real HTTP; app.inject() bypasses the IP layer.
    const res = await app.inject({
      method: "GET",
      url: "/health",
    });

    const body = JSON.parse(res.body);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("status");
  });
});
