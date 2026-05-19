import type { Question } from "./question.js";

export type LearningSessionType = "diagnostic" | "training" | "review" | "challenge";
export type LearningSessionStatus = "active" | "completed" | "abandoned";

export type MasteryLevel =
  | "seedling"
  | "growing"
  | "developing"
  | "proficient"
  | "advanced"
  | "mastered";

export interface LearningSession {
  id: string;
  studentId: string;
  moduleId: string;
  type: LearningSessionType;
  status: LearningSessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  completedAt?: string;
}

export interface SessionQuestion {
  questionId: string;
  question: Question;
  answered: boolean;
  studentAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
  hintsUsed?: number;
}

export interface SkillScore {
  skillId: string;
  skillName: string;
  score: number;
  level: MasteryLevel;
  questionsAttempted: number;
  questionsCorrect: number;
}

export interface SessionReport {
  sessionId: string;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  timeSpent: number;
  skillBreakdown: { skill: string; correct: number; total: number }[];
  strengths: string[];
  growthAreas: string[];
  levelEstimate?: string;
  encouragement: string;
}

export interface DiagnosticReport {
  sessionId: string;
  estimatedLevel: string;
  skillScores: SkillScore[];
  strengths: string[];
  weaknesses: string[];
  nextSteps: string[];
  encouragement: string;
}
