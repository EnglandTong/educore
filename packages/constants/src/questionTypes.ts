export const QUESTION_TYPES = [
  "multiple-choice",
  "gap-filling",
  "transformation",
  "matching",
  "cloze",
  "true-false",
  "error-correction",
  "open"
] as const;

export type QuestionTypeId = (typeof QUESTION_TYPES)[number];
