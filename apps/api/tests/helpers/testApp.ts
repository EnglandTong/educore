import { buildApp } from "../../src/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { SignJWT } from "jose";
import type { FastifyInstance } from "fastify";

import { hashPassword } from "../../src/services/auth.service.js";
import { User } from "../../src/models/User.js";

let mongod: MongoMemoryServer;
let app: FastifyInstance;

/**
 * Create a Fastify test instance connected to an in-memory MongoDB.
 * Call this in beforeAll() of your test suite.
 */
export async function createTestApp(): Promise<FastifyInstance> {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Override env to point to in-memory MongoDB
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-key-min-16-chars!!";

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  app = buildApp();
  await app.ready();
  return app;
}

/**
 * Create a test user with a given role and return userId + access token.
 * Useful for security / integration tests that need authenticated requests.
 */
export async function createTestUser(overrides: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
} = {}): Promise<{ userId: string; token: string }> {
  const email = overrides.email ?? `test-${Date.now()}@example.com`;
  const user = await User.create({
    name: overrides.name ?? "Test User",
    email,
    passwordHash: hashPassword(overrides.password ?? "password123"),
    role: overrides.role ?? "student",
  });

  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "test-secret-key-min-16-chars!!");
  const token = await new SignJWT({
    email: user.email,
    role: user.role,
    tokenType: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user._id))
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return { userId: String(user._id), token };
}

/**
 * Clean up all test data between tests.
 */
export async function cleanupDatabase(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key]!.deleteMany({});
  }
}

/**
 * Close test app and stop in-memory MongoDB.
 * Call this in afterAll() of your test suite.
 * Safe to call even if app was already closed / never created.
 */
export async function closeTestApp(): Promise<void> {
  if (app) {
    try { await app.close(); } catch { /* already closed */ }
  }
  try { await mongoose.disconnect(); } catch { /* already disconnected */ }
  if (mongod) {
    try { await mongod.stop(); } catch { /* already stopped */ }
  }
}
