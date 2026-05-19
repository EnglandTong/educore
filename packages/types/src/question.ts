export type QuestionType =
  | "multiple-choice"
  | "gap-filling"
  | "transformation"
  | "matching"
  | "cloze"
  | "true-false"
  | "error-correction"
  | "open";

export interface Choice {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  moduleId: string;
  skill: string;
  subSkill?: string;
  level: string;
  questionType: QuestionType;
  difficulty: number;
  prompt: string;
  choices?: Choice[];
  answerKey: string | string[];
  explanation: string;
  explanationSteps?: string[];
  hints?: string[];
  wrongChoiceReasons?: Record<string, string>;
  tags?: string[];
  estimatedTimeSec?: number;
}
