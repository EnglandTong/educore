import { describe, it, expect, vi, beforeEach } from "vitest";

// We'll test the module loader's core logic: manifest parsing, question schema validation, deduplication
// Actual FS operations are mocked

const { mockExistsSync, mockReaddir, mockReadFile } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockReaddir: vi.fn(),
  mockReadFile: vi.fn(),
}));

vi.mock("node:fs", () => ({
  existsSync: mockExistsSync,
}));

vi.mock("node:fs/promises", () => ({
  readdir: mockReaddir,
  readFile: mockReadFile,
}));

vi.mock("../../src/models/Module.js", () => ({
  Module: {
    updateOne: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("../../src/models/Question.js", () => ({
  Question: {
    bulkWrite: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("../../src/config/env.js", () => ({
  env: { NODE_ENV: "test", MONGODB_URI: "mongodb://localhost:27017/test" },
}));

import { loadModules, getLoadedModules, getLoadedQuestions } from "../../src/services/moduleLoader.js";

describe("Module Loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should skip when modules directory does not exist", async () => {
    mockExistsSync.mockReturnValue(false);

    await loadModules();

    expect(getLoadedModules()).toHaveLength(0);
  });

  it("should load valid manifest and questions", async () => {
    mockExistsSync.mockImplementation((path: string) => {
      if (typeof path === "string" && path.includes("modules")) return true;
      if (typeof path === "string" && path.includes("manifest.json")) return true;
      if (typeof path === "string" && path.includes("seeds")) return true;
      return false;
    });

    mockReaddir.mockImplementation(async (dir: string, _options?: unknown) => {
      if (dir.includes("seeds")) {
        return ["A1.json"];
      }
      if (dir.includes("modules")) {
        return [{ name: "english-grammar", isDirectory: () => true }];
      }
      return [];
    });

    mockReadFile.mockImplementation(async (path: string) => {
      if (path.includes("manifest.json")) {
        return JSON.stringify({
          id: "english-grammar",
          name: "English Grammar",
          version: "1.0.0",
          subject: "english",
          category: "grammar",
          description: "Test",
          icon: "book-open",
          color: "#6366f1",
          targetAge: { min: 6, max: 18 },
          skills: [{ id: "eg-vocab", name: "Vocabulary", description: "", subSkills: [], order: 1 }],
          levels: [{ id: "A1", name: "Beginner", gradeRange: "1-3", order: 1 }],
          questionTypes: ["multiple-choice"],
          diagnostic: { rounds: 1, questionsPerRound: 3, strategy: "adaptive" },
          training: { sessionLength: 10, adaptiveWeights: { weak: 0.5, current: 0.3, review: 0.2 }, masteryThreshold: 0.8 },
        });
      }
      if (path.includes(".json")) {
        return JSON.stringify([
          {
            id: "eg-q1",
            moduleId: "english-grammar",
            skill: "eg-vocab",
            level: "A1",
            questionType: "multiple-choice",
            difficulty: 0.5,
            prompt: "What is ___?",
            choices: [{ key: "A", text: "Option A" }, { key: "B", text: "Option B" }],
            answerKey: "A",
            explanation: "Because...",
          },
        ]);
      }
      return "[]";
    });

    await loadModules();

    const modules = getLoadedModules();
    const questions = getLoadedQuestions();

    expect(modules.length).toBeGreaterThanOrEqual(1);
    expect(modules[0]!.id).toBe("english-grammar");
    expect(questions.length).toBeGreaterThanOrEqual(1);
  });

  it("should handle manifest validation failure gracefully", async () => {
    mockExistsSync.mockImplementation((path: string) => {
      if (typeof path === "string" && path.includes("modules")) return true;
      if (typeof path === "string" && path.includes("manifest.json")) return true;
      if (typeof path === "string" && path.includes("seeds")) return true;
      return false;
    });

    mockReaddir.mockImplementation(async (dir: string) => {
      if (dir.includes("seeds")) return [];
      if (dir.includes("modules")) {
        return [{ name: "invalid-module", isDirectory: () => true }];
      }
      return [];
    });

    // Invalid manifest (missing required fields)
    mockReadFile.mockResolvedValue(JSON.stringify({ id: "bad-module" }));

    await expect(loadModules()).rejects.toThrow();
  });

  it("should deduplicate modules and questions on reload", async () => {
    mockExistsSync.mockImplementation((path: string) => {
      if (typeof path === "string" && path.includes("modules")) return true;
      if (typeof path === "string" && path.includes("manifest.json")) return true;
      if (typeof path === "string" && path.includes("seeds")) return true;
      return false;
    });

    mockReaddir.mockImplementation(async (dir: string) => {
      if (dir.includes("seeds")) { return ["A1.json"]; }
      if (dir.includes("modules")) {
        return [{ name: "english-grammar", isDirectory: () => true }];
      }
      return [];
    });

    mockReadFile.mockImplementation(async (path: string) => {
      if (path.includes("manifest.json")) {
        return JSON.stringify({
          id: "english-grammar",
          name: "English Grammar",
          version: "1.0.0",
          subject: "english",
          category: "grammar",
          description: "Test",
          icon: "book-open",
          color: "#6366f1",
          targetAge: { min: 6, max: 18 },
          skills: [{ id: "eg-vocab", name: "Vocabulary", description: "", subSkills: [], order: 1 }],
          levels: [{ id: "A1", name: "Beginner", gradeRange: "1-3", order: 1 }],
          questionTypes: ["multiple-choice"],
          diagnostic: { rounds: 1, questionsPerRound: 3, strategy: "adaptive" },
          training: { sessionLength: 10, adaptiveWeights: { weak: 0.5, current: 0.3, review: 0.2 }, masteryThreshold: 0.8 },
        });
      }
      if (path.includes(".json")) {
        return JSON.stringify([
          {
            id: "eg-q1",
            moduleId: "english-grammar",
            skill: "eg-vocab",
            level: "A1",
            questionType: "multiple-choice",
            difficulty: 0.5,
            prompt: "What is ___?",
            choices: [{ key: "A", text: "Option A" }, { key: "B", text: "Option B" }],
            answerKey: "A",
            explanation: "Because...",
          },
        ]);
      }
      return "[]";
    });

    // Load once
    await loadModules();
    const firstCount = getLoadedModules().length;

    // Load again — should not duplicate
    await loadModules();
    const secondCount = getLoadedModules().length;

    expect(secondCount).toBe(firstCount);
  });
});
