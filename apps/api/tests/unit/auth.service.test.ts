import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoisted mocks must come before vi.mock calls
const { mockUserFindOne, mockUserCreate, mockUserFindById } = vi.hoisted(() => ({
  mockUserFindOne: vi.fn(),
  mockUserCreate: vi.fn(),
  mockUserFindById: vi.fn(),
}));

vi.mock("../../src/models/User.js", () => ({
  User: {
    findOne: mockUserFindOne,
    create: mockUserCreate,
    findById: mockUserFindById,
  },
}));

vi.mock("../../src/config/env.js", () => ({
  env: {
    JWT_SECRET: "test-secret-key-min-16-chars!!",
    JWT_ACCESS_EXPIRY: "15m",
    JWT_REFRESH_EXPIRY: "7d",
  },
}));

vi.mock("../../src/config/redis.js", () => ({
  getRedis: () => ({
    get: vi.fn().mockResolvedValue("mock-session-id"),
    set: vi.fn().mockResolvedValue("OK"),
  }),
}));

import { registerUser, loginUser, verifyPassword, hashPassword } from "../../src/services/auth.service.js";

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new student user successfully", async () => {
      const mockUser = {
        _id: "user123",
        name: "Test Student",
        email: "test@example.com",
        role: "student",
        passwordHash: hashPassword("password123"),
        inviteCode: "ABCD1234",
        preferences: { language: "en", theme: "auto" },
        createdAt: new Date(),
        toObject: () => mockUser,
      };

      mockUserFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
      mockUserCreate.mockResolvedValue(mockUser);

      const result = await registerUser({
        name: "Test Student",
        email: "test@example.com",
        password: "password123",
        role: "student",
      });

      expect(result.user.name).toBe("Test Student");
      expect(result.user.role).toBe("student");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw CONFLICT when email already exists", async () => {
      mockUserFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: "existing", email: "test@example.com" }) });

      await expect(
        registerUser({
          name: "Test",
          email: "test@example.com",
          password: "password123",
          role: "student",
        })
      ).rejects.toMatchObject({ statusCode: 409, code: "CONFLICT" });
    });

    it("should generate invite code for student role", async () => {
      const mockUser = {
        _id: "user123",
        name: "Test Student",
        email: "test@example.com",
        role: "student",
        passwordHash: hashPassword("password123"),
        inviteCode: "ABCD1234",
        preferences: { language: "en", theme: "auto" },
        createdAt: new Date(),
        toObject: () => mockUser,
      };

      mockUserFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
      mockUserCreate.mockResolvedValue(mockUser);

      await registerUser({
        name: "Test Student",
        email: "test@example.com",
        password: "password123",
        role: "student",
      });

      // Verify create was called with inviteCode
      const createCall = mockUserCreate.mock.calls[0]![0];
      expect(createCall.inviteCode).toBeDefined();
    });
  });

  describe("loginUser", () => {
    it("should login successfully with correct credentials", async () => {
      const password = "password123";
      const hashed = hashPassword(password);

      const mockUserDoc = {
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        role: "student",
        passwordHash: hashed,
        preferences: { language: "en", theme: "auto" },
        createdAt: new Date(),
        toObject: () => mockUserDoc,
      };

      mockUserFindOne.mockResolvedValue(mockUserDoc);

      const result = await loginUser({
        email: "test@example.com",
        password,
      });

      expect(result.user.name).toBe("Test User");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw UNAUTHORIZED for wrong password", async () => {
      const mockUserDoc = {
        _id: "user123",
        passwordHash: hashPassword("correct-password"),
        toObject: () => mockUserDoc,
      };

      mockUserFindOne.mockResolvedValue(mockUserDoc);

      await expect(
        loginUser({
          email: "test@example.com",
          password: "wrong-password",
        })
      ).rejects.toMatchObject({ statusCode: 401, code: "UNAUTHORIZED" });
    });

    it("should throw UNAUTHORIZED for non-existent user", async () => {
      mockUserFindOne.mockResolvedValue(null);

      await expect(
        loginUser({
          email: "nonexistent@example.com",
          password: "password123",
        })
      ).rejects.toMatchObject({ statusCode: 401, code: "UNAUTHORIZED" });
    });
  });

  describe("password utilities", () => {
    it("should hash and verify password correctly", () => {
      const password = "my-secure-password";
      const hashed = hashPassword(password);

      expect(hashed).toContain(":");
      expect(verifyPassword(password, hashed)).toBe(true);
    });

    it("should reject wrong password", () => {
      const hashed = hashPassword("correct-password");
      expect(verifyPassword("wrong-password", hashed)).toBe(false);
    });
  });
});
