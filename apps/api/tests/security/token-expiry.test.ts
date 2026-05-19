import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { SignJWT } from "jose";

// Set JWT_SECRET before any modules load (env.ts reads it at import time)
vi.hoisted(() => {
  process.env.JWT_SECRET = "test-secret-key-min-16-chars!!";
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

const JWT_SECRET = "test-secret-key-min-16-chars!!";

describe("Token Expiry and Validity", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.NODE_ENV = "test";
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should reject an expired token with 401", async () => {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const expiredToken = await new SignJWT({
      email: "test@example.com",
      role: "student",
      tokenType: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("user-1")
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime("-1h")
      .sign(secret);

    const res = await app.inject({
      method: "GET",
      url: "/api/v1/teacher/class/overview",
      headers: { authorization: `Bearer ${expiredToken}` },
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.error?.code).toBe("UNAUTHORIZED");
  });

  it("should reject an invalid (malformed) token with 401", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/teacher/class/overview",
      headers: { authorization: "Bearer this-is-definitely-not-a-valid-jwt-token" },
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.error?.code).toBe("UNAUTHORIZED");
  });
});
