export const MASTERY_LEVELS = [
  "seedling",
  "growing",
  "developing",
  "proficient",
  "advanced",
  "mastered"
] as const;

export const MASTERY_THRESHOLDS = {
  seedling: { min: 0, max: 29 },
  growing: { min: 30, max: 49 },
  developing: { min: 50, max: 69 },
  proficient: { min: 70, max: 84 },
  advanced: { min: 85, max: 94 },
  mastered: { min: 95, max: 100 }
} as const;

export const PROFICIENT_UNLOCK_SCORE = 70;
export const MASTERY_CHALLENGE_PASSING_SCORE = 5;
