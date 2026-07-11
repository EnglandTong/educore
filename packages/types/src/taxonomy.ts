export type QuestionCategory =
  | "multiple-choice"
  | "fill-blank"
  | "short-answer"
  | "essay"
  | "coding"
  | "reading-comprehension"
  | "listening"
  | "speaking"
  | "experiment"
  | "project";

export type DifficultyLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "advanced"
  | "expert";

export type ExamScenario =
  | "daily-practice"
  | "unit-test"
  | "midterm"
  | "final"
  | "entrance-exam"
  | "competition"
  | "diagnostic"
  | "adaptive";

export interface KnowledgePoint {
  id: string;
  subject: string;
  topic: string;
  subtopic?: string;
  description: string;
  prerequisites?: string[];
}

export interface ContentTaxonomy {
  questionCategory: QuestionCategory;
  difficulty: DifficultyLevel;
  examScenario: ExamScenario;
  knowledgePoints: KnowledgePoint[];
  estimatedTimeMinutes: number;
  tags?: string[];
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  "multiple-choice",
  "fill-blank",
  "short-answer",
  "essay",
  "coding",
  "reading-comprehension",
  "listening",
  "speaking",
  "experiment",
  "project",
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  "beginner",
  "elementary",
  "intermediate",
  "advanced",
  "expert",
];

export const EXAM_SCENARIOS: ExamScenario[] = [
  "daily-practice",
  "unit-test",
  "midterm",
  "final",
  "entrance-exam",
  "competition",
  "diagnostic",
  "adaptive",
];
