import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock factories are hoisted to top of file, so we need vi.hoisted()
const { mockFindByIdAndUpdate, mockLean } = vi.hoisted(() => ({
  mockFindByIdAndUpdate: vi.fn(),
  mockLean: vi.fn(),
}));

vi.mock("../../src/models/User.js", () => ({
  User: {
    findByIdAndUpdate: mockFindByIdAndUpdate,
  },
}));

// Mock config dependencies
vi.mock("../../src/config/env.js", () => ({
  env: {
    JWT_SECRET: "test-secret-key-min-16-chars!!",
    JWT_ACCESS_EXPIRY: "15m",
    JWT_REFRESH_EXPIRY: "7d",
  },
}));

vi.mock("../../src/config/redis.js", () => ({
  getRedis: () => ({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
  }),
}));

import { updateCurrentUserProfile } from "../../src/services/auth.service.js";

describe("Security: Profile update privilege escalation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindByIdAndUpdate.mockReturnValue({ lean: mockLean });
  });

  it("should strip 'role' field from patch (privilege escalation)", async () => {
    mockLean.mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      role: "student",
      createdAt: new Date(),
    });

    const result = await updateCurrentUserProfile("user123", {
      name: "Test User Updated",
      role: "admin",
    });

    // Verify findByIdAndUpdate was called with safePatch (without role)
    const callArgs = mockFindByIdAndUpdate.mock.calls[0]!;
    expect(callArgs[0]).toBe("user123");

    const $set = (callArgs[1] as { $set: Record<string, unknown> }).$set;
    expect($set).not.toHaveProperty("role");
    expect($set).toHaveProperty("name", "Test User Updated");

    // Verify returned profile still has original role
    expect(result.role).toBe("student");
  });

  it("should strip 'email' field from patch", async () => {
    mockLean.mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "original@example.com",
      role: "student",
      createdAt: new Date(),
    });

    await updateCurrentUserProfile("user123", {
      email: "hacked@example.com",
    });

    const $set = (mockFindByIdAndUpdate.mock.calls[0]![1] as { $set: Record<string, unknown> }).$set;
    expect($set).not.toHaveProperty("email");
  });

  it("should strip 'passwordHash' field from patch", async () => {
    mockLean.mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      role: "student",
      createdAt: new Date(),
    });

    await updateCurrentUserProfile("user123", {
      passwordHash: "malicious-hash",
    });

    const $set = (mockFindByIdAndUpdate.mock.calls[0]![1] as { $set: Record<string, unknown> }).$set;
    expect($set).not.toHaveProperty("passwordHash");
  });

  it("should allow valid fields like 'name' to pass through", async () => {
    mockLean.mockResolvedValue({
      _id: "user123",
      name: "Updated Name",
      email: "test@example.com",
      role: "student",
      createdAt: new Date(),
    });

    const result = await updateCurrentUserProfile("user123", {
      name: "Updated Name",
      nickname: "NewNick",
    });

    const $set = (mockFindByIdAndUpdate.mock.calls[0]![1] as { $set: Record<string, unknown> }).$set;
    expect($set).toHaveProperty("name", "Updated Name");
    expect($set).toHaveProperty("nickname", "NewNick");
    expect(result.name).toBe("Updated Name");
  });

  it("should throw AppError when user not found", async () => {
    mockLean.mockResolvedValue(null);

    await expect(
      updateCurrentUserProfile("nonexistent", { name: "New" })
    ).rejects.toThrow("We could not find your profile yet");
  });
});
