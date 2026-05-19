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

vi.mock("../../src/services/teacher.service.js", () => ({
  getClassOverview: vi.fn().mockResolvedValue({ totalStudents: 10, weakAreas: [] }),
  getStudentSummary: vi.fn().mockResolvedValue({}),
  getClassWeakAreas: vi.fn().mockResolvedValue([]),
}));

import { buildApp } from "../../src/app.js";
import type { FastifyInstance } from "fastify";

const JWT_SECRET = "test-secret-key-min-16-chars!!";

async function signToken(role: string, subject = "user-1"): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT({ email: `${role}@test.com`, role, tokenType: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

describe("Role Isolation", () => {
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

  it("should forbid a student from accessing teacher-only endpoints", async () => {
    const token = await signToken("student");

    const res = await app.inject({
      method: "GET",
      url: "/api/v1/teacher/class/overview",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.error?.code).toBe("FORBIDDEN");
  });

  it("should forbid a student from accessing school-admin endpoints", async () => {
    const token = await signToken("student");

    const res = await app.inject({
      method: "GET",
      url: "/api/v1/school",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.error?.code).toBe("FORBIDDEN");
  });

  it("should allow a teacher but forbid a student from teacher-only operations", async () => {
    const studentToken = await signToken("student");
    const teacherToken = await signToken("teacher", "teacher-1");

    const studentRes = await app.inject({
      method: "GET",
      url: "/api/v1/teacher/class/overview",
      headers: { authorization: `Bearer ${studentToken}` },
    });
    expect(studentRes.statusCode).toBe(403);

    const teacherRes = await app.inject({
      method: "GET",
      url: "/api/v1/teacher/class/overview",
      headers: { authorization: `Bearer ${teacherToken}` },
    });
    expect(teacherRes.statusCode).toBe(200);
  });
});
