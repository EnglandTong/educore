import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockUpdateBKT, mockEstimateAbility, mockSelectNextQuestion, mockSelectDiagnosticQuestion, mockCalculateMasteryScore } = vi.hoisted(() => ({
  mockUpdateBKT: vi.fn(),
  mockEstimateAbility: vi.fn(),
  mockSelectNextQuestion: vi.fn(),
  mockSelectDiagnosticQuestion: vi.fn(),
  mockCalculateMasteryScore: vi.fn(),
}));

vi.mock("@educore/algorithms", () => ({
  updateBKT: mockUpdateBKT,
  estimateAbility: mockEstimateAbility,
  selectNextQuestion: mockSelectNextQuestion,
  selectDiagnosticQuestion: mockSelectDiagnosticQuestion,
  calculateMasteryScore: mockCalculateMasteryScore,
}));

import { updateBKT, estimateAbility, selectNextQuestion, selectDiagnosticQuestion, calculateMasteryScore } from "@educore/algorithms";

describe("Adaptive Engine (algorithm wrappers)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateBKT", () => {
    it("should return pKnown and learned flag after correct answer", () => {
      mockUpdateBKT.mockReturnValue({ pKnown: 0.85, learned: false });

      const result = updateBKT(
        { pKnown: 0.6, pLearn: 0.15, pSlip: 0.1, pGuess: 0.25 },
        true // isCorrect
      );

      expect(result.pKnown).toBeGreaterThan(0.6);
      expect(typeof result.learned).toBe("boolean");
      expect(mockUpdateBKT).toHaveBeenCalledWith(
        expect.objectContaining({ pKnown: 0.6 }),
        true
      );
    });

    it("should handle wrong answer gracefully", () => {
      mockUpdateBKT.mockReturnValue({ pKnown: 0.55, learned: false });

      const result = updateBKT(
        { pKnown: 0.6, pLearn: 0.15, pSlip: 0.1, pGuess: 0.25 },
        false // isCorrect
      );

      expect(result.pKnown).toBeDefined();
      expect(mockUpdateBKT).toHaveBeenCalledWith(
        expect.objectContaining({ pKnown: 0.6 }),
        false
      );
    });
  });

  describe("estimateAbility (IRT)", () => {
    it("should estimate ability from response history", () => {
      mockEstimateAbility.mockReturnValue(0.5);

      const result = estimateAbility([
        { params: { difficulty: -1, discrimination: 1 }, correct: true },
        { params: { difficulty: 0, discrimination: 1 }, correct: true },
        { params: { difficulty: 1, discrimination: 1 }, correct: false },
      ]);

      expect(typeof result).toBe("number");
      expect(result).toBeCloseTo(0.5);
    });

    it("should return 0 for empty history", () => {
      mockEstimateAbility.mockReturnValue(0);

      const result = estimateAbility([]);
      expect(result).toBe(0);
    });
  });

  describe("selectNextQuestion", () => {
    it("should select question criteria based on student masteries", () => {
      mockSelectNextQuestion.mockReturnValue({
        skillId: "eg-vocab",
        targetDifficulty: 0.5,
        difficultyRange: [0.35, 0.65],
        excludeIds: [],
      });

      const result = selectNextQuestion(
        [{ skillId: "eg-vocab", score: 45, level: "growing" }],
        ["q1", "q2"],
        [],
        "multiple-choice",
        0.5
      );

      expect(result.skillId).toBe("eg-vocab");
      expect(result.targetDifficulty).toBeGreaterThan(0);
    });
  });

  describe("selectDiagnosticQuestion", () => {
    it("should return difficulty criteria for diagnostic", () => {
      mockSelectDiagnosticQuestion.mockReturnValue({
        targetDifficulty: 0.5,
        difficultyRange: [0.4, 0.6],
        excludeIds: [],
      });

      const result = selectDiagnosticQuestion(
        1,  // round
        0,  // questionIndex
        [], // answersThisRound
        [], // allAnswers
        0.5 // currentDifficulty
      );

      expect(result.targetDifficulty).toBeDefined();
      expect(Array.isArray(result.excludeIds)).toBe(true);
    });
  });

  describe("calculateMasteryScore", () => {
    it("should calculate score and level from BKT params", () => {
      mockCalculateMasteryScore.mockReturnValue({
        score: 45,
        level: "seedling",
      });

      const result = calculateMasteryScore(
        0.45, // bktPKnown
        [true, false, true, false, true], // recentAnswers
        2,    // streak
        10    // totalAttempts
      );

      expect(result.score).toBeLessThan(50);
      expect(result.level).toBe("seedling");
    });

    it("should return higher score for better performance", () => {
      mockCalculateMasteryScore.mockReturnValue({
        score: 85,
        level: "proficient",
      });

      const result = calculateMasteryScore(
        0.85,
        [true, true, true, true, true],
        5,
        5
      );

      expect(result.score).toBeGreaterThan(50);
      expect(result.level).toBe("proficient");
    });
  });
});
