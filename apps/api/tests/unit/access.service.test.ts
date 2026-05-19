import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGuardianLinkFindOne, mockGuardianLinkFind } = vi.hoisted(() => ({
  mockGuardianLinkFindOne: vi.fn(),
  mockGuardianLinkFind: vi.fn(),
}));

vi.mock("../../src/models/GuardianLink.js", () => ({
  GuardianLink: {
    findOne: mockGuardianLinkFindOne,
    find: mockGuardianLinkFind,
  },
}));

import { assertRole, requireGuardianLink, listConsentedGuardianLinks, requireTeacherOrAdmin } from "../../src/services/access.service.js";

describe("Access Control Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("assertRole", () => {
    it("should pass when user role is in allowed list", () => {
      const user = { id: "u1", email: "test@test.com", role: "student" as const };
      expect(() => assertRole(user, ["student", "parent"])).not.toThrow();
    });

    it("should throw FORBIDDEN when user role is not allowed", () => {
      const user = { id: "u1", email: "test@test.com", role: "student" as const };
      try {
        assertRole(user, ["teacher"]);
        expect.unreachable("Should have thrown");
      } catch (error) {
        expect(error).toMatchObject({ statusCode: 403, code: "FORBIDDEN" });
      }
    });
  });

  describe("requireGuardianLink", () => {
    it("should return link when guardian is linked with consent", async () => {
      mockGuardianLinkFindOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          parentId: "parent1",
          studentId: "student1",
          consentGiven: true,
        }),
      });

      const result = await requireGuardianLink("parent1", "student1");
      expect(result.consentGiven).toBe(true);
    });

    it("should throw FORBIDDEN when no link exists", async () => {
      mockGuardianLinkFindOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      });

      try {
        await requireGuardianLink("parent1", "student1");
        expect.unreachable("Should have thrown");
      } catch (error) {
        expect(error).toMatchObject({ statusCode: 403, code: "FORBIDDEN" });
      }
    });
  });

  describe("listConsentedGuardianLinks", () => {
    it("should return all consented links for a parent", async () => {
      const mockLinks = [
        { parentId: "parent1", studentId: "student1", consentGiven: true },
        { parentId: "parent1", studentId: "student2", consentGiven: true },
      ];
      mockGuardianLinkFind.mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockLinks),
      });

      const result = await listConsentedGuardianLinks("parent1");
      expect(result).toHaveLength(2);
    });
  });

  describe("requireTeacherOrAdmin", () => {
    it("should pass for teacher role", () => {
      const user = { id: "u1", email: "teacher@test.com", role: "teacher" as const };
      expect(() => requireTeacherOrAdmin(user)).not.toThrow();
    });

    it("should pass for admin role", () => {
      const user = { id: "u1", email: "admin@test.com", role: "admin" as const };
      expect(() => requireTeacherOrAdmin(user)).not.toThrow();
    });

    it("should throw for student role", () => {
      const user = { id: "u1", email: "student@test.com", role: "student" as const };
      expect(() => requireTeacherOrAdmin(user)).toThrow();
    });
  });
});
