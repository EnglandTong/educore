import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";

const app = buildApp();

describe("GET /health", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns the standard success envelope", async () => {
    const response = await app.inject({ method: "GET", url: "/health" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(["ok", "degraded"]).toContain(body.data.status);
    expect(body.data.uptimeSec).toEqual(expect.any(Number));
    expect(body.data.memoryRssMb).toEqual(expect.any(Number));
    expect(body.data.loadedModules).toEqual(expect.any(Number));
    expect(body.data.connections).toBeDefined();
    expect(body.data.connections.mongodb).toEqual(expect.any(String));
    expect(body.data.connections.redis).toEqual(expect.any(String));
    expect(body.meta.requestId).toEqual(expect.any(String));
  });
});
