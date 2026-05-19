import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so that mock function references are available during hoisted vi.mock calls
const {
  mockCalculateMasteryScore,
  mockCalculateNextReview,
  mockEstimateAbility,
  mockSelectDiagnosticQuestion,
  mockSelectNextQuestion,
  mockUpdateBKT,
} = vi.hoisted(() => ({
  mockCalculateMasteryScore: vi.fn(),
  mockCalculateNextReview: vi.fn(),
  mockEstimateAbility: vi.fn(),
  mockSelectDiagnosticQuestion: vi.fn(),
  mockSelectNextQuestion: vi.fn(),
  mockUpdateBKT: vi.fn(),
}));

vi.mock("@educore/algorithms", () => ({
  calculateMasteryScore: mockCalculateMasteryScore,
  calculateNextReview: mockCalculateNextReview,
  estimateAbility: mockEstimateAbility,
  selectDiagnosticQuestion: mockSelectDiagnosticQuestion,
  selectNextQuestion: mockSelectNextQuestion,
  updateBKT: mockUpdateBKT,
}));

// Helper to create a chainable findOne that supports .sort()
function chainableFindOne(result: unknown) {
  return { sort: vi.fn().mockReturnValue(Promise.resolve(result)) };
}

// Helper to create a chainable find that supports .sort().lean()
function chainableFind(result: unknown) {
  const leanFn = vi.fn().mockReturnValue(Promise.resolve(result));
  return { sort: vi.fn().mockReturnValue({ lean: leanFn }), lean: leanFn };
}

// Mock models
vi.mock("../../src/models/LearningSession.js", () => ({
  LearningSession: {
    create: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock("../../src/models/Question.js", () => ({
  Question: {
    find: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("../../src/models/SkillMastery.js", () => ({
  SkillMastery: {
    findOneAndUpdate: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../src/models/WrongAnswer.js", () => ({
  WrongAnswer: {
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
  },
}));

vi.mock("../../src/services/question.service.js", () => ({
  getModuleManifest: vi.fn(),
  getQuestionById: vi.fn(),
  listQuestions: vi.fn(),
  ServedQuestion: {},
}));

vi.mock("../../src/services/moduleLoader.js", () => ({
  getLoadedModules: vi.fn(),
}));

vi.mock("../../src/services/feedbackSelector.js", () => ({
  selectWarmFeedback: vi.fn().mockReturnValue("Nice work!"),
}));

vi.mock("../../src/services/progress.service.js", () => ({
  invalidateProgressOverview: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../src/config/env.js", () => ({
  env: { NODE_ENV: "test", MONGODB_URI: "mongodb://localhost:27017/test" },
}));

import type { Mock } from "vitest";
import {
  startLearningSession,
  getNextLearningQuestion,
  submitLearningAnswer,
  endLearningSession,
  getDiagnosticReport,
  startReviewSession,
  listWrongAnswers,
} from "../../src/services/learning.service.js";

describe("Learning Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start a diagnostic session", async () => {
    const { LearningSession } = await import("../../src/models/LearningSession.js");
    const { getLoadedModules } = await import("../../src/services/moduleLoader.js");

    (getLoadedModules as Mock).mockReturnValue([{ id: "module-1", name: "Test Module" }]);

    (LearningSession.create as Mock).mockResolvedValue({
      _id: "session-1",
      studentId: "user-1",
      moduleId: "module-1",
      type: "diagnostic",
      status: "active",
      config: { totalQuestions: 25 },
      questions: [],
      stats: { correctCount: 0, totalAnswered: 0, averageTime: 0 },
      startedAt: new Date(),
    });

    const result = await startLearningSession("user-1", "diagnostic");

    expect(result).toBeDefined();
    expect(result.session.type).toBe("diagnostic");
    expect(result.session.status).toBe("active");
    expect(LearningSession.create).toHaveBeenCalled();
  });

  it("should start a training session", async () => {
    const { LearningSession } = await import("../../src/models/LearningSession.js");
    const { getLoadedModules } = await import("../../src/services/moduleLoader.js");

    (getLoadedModules as Mock).mockReturnValue([{ id: "module-1", name: "Test Module" }]);

    (LearningSession.create as Mock).mockResolvedValue({
      _id: "session-2",
      studentId: "user-1",
      moduleId: "module-1",
      type: "training",
      status: "active",
      config: { totalQuestions: 30 },
      questions: [],
      stats: { correctCount: 0, totalAnswered: 0, averageTime: 0 },
      startedAt: new Date(),
    });

    const result = await startLearningSession("user-1", "training");

    expect(result).toBeDefined();
    expect(result.session.type).toBe("training");
  });

  it("should get the next unanswered question from an active session", async () => {
    const { LearningSession } = await import("../../src/models/LearningSession.js");
    const { getQuestionById } = await import("../../src/services/question.service.js");

    const mockSession = {
      _id: "session-1",
      studentId: "user-1",
      moduleId: "module-1",
      type: "training",
      status: "active",
      config: { totalQuestions: 30 },
      questions: [
        { questionId: "q1", answered: false },
        { questionId: "q2", answered: true, studentAnswer: "A", isCorrect: true },
      ],
      stats: { correctCount: 1, totalAnswered: 1, averageTime: 5 },
      startedAt: new Date(),
      save: vi.fn().mockResolvedValue(true),
    };

    // activeSession uses findOne(...).sort(...) — we chain it
    (LearningSession.findOne as Mock).mockReturnValue(
      chainableFindOne(mockSession)
    );

    (getQuestionById as Mock).mockResolvedValue({
      id: "q1",
      moduleId: "module-1",
      skill: "skill-1",
      questionType: "multiple-choice",
      difficulty: 0.5,
      prompt: "Test?",
      choices: [{ key: "A", text: "Option A" }, { key: "B", text: "Option B" }],
      answerKey: "A",
      explanation: "Because...",
    });

    const result = await getNextLearningQuestion("user-1", "training");

    expect(result).toBeDefined();
    expect(result.question.id).toBe("q1");
  });

  it("should submit an answer and update mastery", async () => {
    const { LearningSession } = await import("../../src/models/LearningSession.js");
    const { getQuestionById } = await import("../../src/services/question.service.js");
    const { SkillMastery } = await import("../../src/models/SkillMastery.js");
    const { WrongAnswer } = await import("../../src/models/WrongAnswer.js");

    const mockSession = {
      _id: "session-1",
      studentId: "user-1",
      moduleId: "module-1",
      type: "training",
      status: "active",
      config: { totalQuestions: 30 },
      questions: [
        { questionId: "q1", answered: false },
      ],
      stats: { correctCount: 0, totalAnswered: 0, averageTime: 0 },
      startedAt: new Date(),
      save: vi.fn().mockResolvedValue(true),
    };

    (LearningSession.findOne as Mock).mockResolvedValue(mockSession);

    (getQuestionById as Mock).mockResolvedValue({
      id: "q1",
      moduleId: "module-1",
      skill: "skill-1",
      questionType: "multiple-choice",
      difficulty: 0.5,
      prompt: "Test?",
      choices: [{ key: "A", text: "A" }, { key: "B", text: "B" }],
      answerKey: "A",
      explanation: "Correct answer is A",
    });

    mockUpdateBKT.mockReturnValue({ pKnown: 0.6, pLearn: 0.1, pSlip: 0.1, pGuess: 0.25 });
    mockCalculateMasteryScore.mockReturnValue({ score: 85, level: "proficient" });
    mockCalculateNextReview.mockReturnValue({ nextReviewAt: new Date(Date.now() + 86400000), reviewCount: 1, mastered: false });

    (SkillMastery.findOne as Mock).mockResolvedValue({
      _id: "mastery-1",
      studentId: "user-1",
      moduleId: "module-1",
      skillId: "skill-1",
      score: 50,
      level: "seedling",
      bktParams: { pKnown: 0.2, pLearn: 0.1, pSlip: 0.1, pGuess: 0.25 },
      recentAnswers: [true],
      streak: { current: 0, best: 0 },
      totalAttempts: 5,
      correctAttempts: 3,
      save: vi.fn().mockResolvedValue(true),
    });

    (WrongAnswer.findOneAndUpdate as Mock).mockResolvedValue({});

    const result = await submitLearningAnswer("user-1", {
      sessionId: "session-1",
      questionId: "q1",
      answer: "A",
      timeSpent: 5,
    });

    expect(result).toBeDefined();
    expect(result.isCorrect).toBe(true);
    expect(result.feedback).toBeDefined();
    expect(mockSession.save).toHaveBeenCalled();
  });

  it("should end a learning session and return report", async () => {
    const { LearningSession } = await import("../../src/models/LearningSession.js");

    const mockSession = {
      _id: "session-1",
      studentId: "user-1",
      moduleId: "module-1",
      type: "diagnostic",
      status: "active",
      config: { totalQuestions: 25 },
      questions: [
        { questionId: "q1", answered: true, isCorrect: true, timeSpent: 10 },
        { questionId: "q2", answered: true, isCorrect: false, timeSpent: 8 },
      ],
      stats: { correctCount: 1, totalAnswered: 2, averageTime: 9 },
      startedAt: new Date(),
      save: vi.fn().mockResolvedValue(true),
    };

    // latestSession uses findOne(...).sort(...)
    (LearningSession.findOne as Mock).mockReturnValue(
      chainableFindOne(mockSession)
    );

    const result = await endLearningSession("user-1", "diagnostic");

    expect(result).toBeDefined();
    expect(result.sessionId).toBe("session-1");
    expect(result.totalQuestions).toBe(25);
    expect(result.correctCount).toBe(1);
  });

  it("should get a diagnostic report", async () => {
    const { LearningSession } = await import("../../src/models/LearningSession.js");

    // latestSession uses findOne(...).sort(...)
    (LearningSession.findOne as Mock).mockReturnValue(
      chainableFindOne({
        _id: "session-1",
        studentId: "user-1",
        type: "diagnostic",
        status: "completed",
        questions: [
          { questionId: "q1", answered: true, isCorrect: true },
          { questionId: "q2", answered: true, isCorrect: false },
          { questionId: "q3", answered: true, isCorrect: true },
        ],
        config: { totalQuestions: 3 },
        startedAt: new Date(),
      })
    );

    mockCalculateMasteryScore.mockReturnValue({ score: 67, level: "developing" });

    const result = await getDiagnosticReport("user-1");

    expect(result).toBeDefined();
    expect(result.estimatedLevel).toBeDefined();
    expect(result.sessionId).toBe("session-1");
  });

  it("should start a review session from wrong answers", async () => {
    const { LearningSession } = await import("../../src/models/LearningSession.js");
    const { WrongAnswer } = await import("../../src/models/WrongAnswer.js");
    const { Question } = await import("../../src/models/Question.js");
    const { getLoadedModules } = await import("../../src/services/moduleLoader.js");

    (getLoadedModules as Mock).mockReturnValue([{ id: "module-1", name: "Test Module" }]);

    // WrongAnswer.find(...).sort(...).lean()
    (WrongAnswer.find as Mock).mockReturnValue(
      chainableFind([
        {
          _id: "wa-1",
          studentId: "user-1",
          questionId: "q1",
          moduleId: "module-1",
          skillId: "skill-1",
          studentAnswer: "B",
          correctAnswer: "A",
          explanation: "A is correct",
          createdAt: new Date(),
          reviewStatus: "pending",
          reviewCount: 0,
        },
      ])
    );

    // Question.find(...).lean() — needs the lean chain
    (Question.find as Mock).mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        { _id: "q1", moduleId: "module-1", skill: "skill-1", questionType: "mc", difficulty: 0.5, prompt: "Q1?", answerKey: "A", explanation: "", choices: [] },
      ]),
    });

    (LearningSession.create as Mock).mockResolvedValue({
      _id: "session-review-1",
      studentId: "user-1",
      moduleId: "module-1",
      type: "review",
      status: "active",
      config: { totalQuestions: 1 },
      questions: [{ questionId: "q1", answered: false }],
      stats: { correctCount: 0, totalAnswered: 0, averageTime: 0 },
      startedAt: new Date(),
    });

    const result = await startReviewSession("user-1");

    expect(result).toBeDefined();
    expect(result.session.type).toBe("review");
    expect(result.wrongAnswers).toBeDefined();
  });

  it("should handle batch query for wrong answers (N+1 fix verification)", async () => {
    const { WrongAnswer } = await import("../../src/models/WrongAnswer.js");
    const { Question } = await import("../../src/models/Question.js");

    // WrongAnswer.find(...).sort(...).lean()
    (WrongAnswer.find as Mock).mockReturnValue(
      chainableFind([
        { _id: "wa-1", studentId: "user-1", questionId: "q1", moduleId: "m1", studentAnswer: "B", correctAnswer: "A", explanation: "", createdAt: new Date(), reviewStatus: "pending", reviewCount: 0 },
        { _id: "wa-2", studentId: "user-1", questionId: "q2", moduleId: "m1", studentAnswer: "C", correctAnswer: "A", explanation: "", createdAt: new Date(), reviewStatus: "pending", reviewCount: 0 },
      ])
    );

    // Question.find({...}).lean()
    (Question.find as Mock).mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        { _id: "q1", moduleId: "m1", skill: "skill-1", questionType: "mc", difficulty: 0.5, prompt: "Q1?", answerKey: "A", explanation: "", choices: [] },
        { _id: "q2", moduleId: "m1", skill: "skill-1", questionType: "mc", difficulty: 0.5, prompt: "Q2?", answerKey: "A", explanation: "", choices: [] },
      ]),
    });

    const result = await listWrongAnswers("user-1");

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(2);
    // Assert N+1 was prevented: WrongAnswer.find called once, Question.find called once
    expect(WrongAnswer.find).toHaveBeenCalledTimes(1);
    expect(Question.find).toHaveBeenCalledTimes(1);
  });
});
