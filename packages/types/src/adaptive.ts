export type PracticeMode =
  | "diagnostic"
  | "targeted"
  | "review"
  | "spaced-repetition"
  | "exam-simulation"
  | "free-practice";

export interface AdaptiveSessionConfig {
  mode: PracticeMode;
  targetSkillIds?: string[];
  difficultyRange?: { min: number; max: number };
  questionCount: number;
  timeLimitMinutes?: number;
  spacedRepetition?: {
    intervalDays: number;
    easeFactor: number;
    nextReviewDate: string;
  };
}

export interface WrongAnswerReview {
  questionId: string;
  studentId: string;
  wrongAttempts: number;
  lastWrongAt: string;
  nextReviewAt: string;
  reviewCount: number;
  mastered: boolean;
}

export interface DiagnosticReportExtended {
  studentId: string;
  skillScores: Array<{
    skillId: string;
    skillName: string;
    score: number;
    mastery: "not-started" | "learning" | "proficient" | "mastered";
  }>;
  recommendedNextSteps: Array<{
    action: string;
    priority: "high" | "medium" | "low";
    skillId: string;
  }>;
  overallScore: number;
  generatedAt: string;
}
