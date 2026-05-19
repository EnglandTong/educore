import type { MasteryLevel } from "./learning.js";
import type { Question } from "./question.js";

export interface SkillMastery {
  studentId: string;
  moduleId: string;
  skillId: string;
  skillName: string;
  score: number;
  level: MasteryLevel;
  streak: { current: number; best: number };
  totalAttempts: number;
  correctAttempts: number;
  lastPracticedAt?: string;
  nextReviewAt?: string;
}

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  overallScore: number;
  overallLevel: MasteryLevel;
  skillCount: number;
  masteredCount: number;
  lastActivityAt?: string;
}

export interface ProgressOverview {
  studentId: string;
  modules: ModuleProgress[];
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
}

export interface WrongAnswerRecord {
  id: string;
  studentId: string;
  questionId: string;
  question: Question;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  createdAt: string;
  reviewStatus: "pending" | "reviewing" | "mastered";
  nextReviewAt?: string;
  reviewCount: number;
}
