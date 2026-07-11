export type ExamQuestionType =
  | "standard"
  | "variant"
  | "integrated"
  | "application"
  | "analysis"
  | "synthesis"
  | "evaluation";

export type SolutionStrategy =
  | "direct"
  | "elimination"
  | "substitution"
  | "diagram"
  | "decomposition"
  | "pattern-matching"
  | "analogy"
  | "proof";

export interface ExamVariant {
  baseQuestionId: string;
  variantId: string;
  variantType: ExamQuestionType;
  modifications: string[];
  difficultyShift: -2 | -1 | 0 | 1 | 2;
}

export interface ExamTrainingSession {
  id: string;
  studentId: string;
  examType: string;
  questionTypes: ExamQuestionType[];
  strategies: SolutionStrategy[];
  questions: Array<{
    questionId: string;
    variantId?: string;
    strategy: SolutionStrategy;
  }>;
  startedAt: string;
  completedAt?: string;
  score?: number;
}

export interface SolutionPattern {
  id: string;
  name: string;
  strategy: SolutionStrategy;
  subject: string;
  steps: string[];
  applicableTo: string[];
}
