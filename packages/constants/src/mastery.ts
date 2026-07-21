export const MASTERY_LEVELS = [
  "seedling",
  "growing",
  "developing",
  "proficient",
  "advanced",
  "mastered"
] as const;

export type MasteryLevelId = (typeof MASTERY_LEVELS)[number];

export const MASTERY_THRESHOLDS = {
  seedling: { min: 0, max: 29 },
  growing: { min: 30, max: 49 },
  developing: { min: 50, max: 69 },
  proficient: { min: 70, max: 84 },
  advanced: { min: 85, max: 94 },
  mastered: { min: 95, max: 100 }
} as const;

/** Single source for score → mastery level mapping (aligned with MASTERY_THRESHOLDS). */
export function scoreToMasteryLevel(score: number): MasteryLevelId {
  if (score < MASTERY_THRESHOLDS.growing.min) return "seedling";
  if (score < MASTERY_THRESHOLDS.developing.min) return "growing";
  if (score < MASTERY_THRESHOLDS.proficient.min) return "developing";
  if (score < MASTERY_THRESHOLDS.advanced.min) return "proficient";
  if (score < MASTERY_THRESHOLDS.mastered.min) return "advanced";
  return "mastered";
}

export function parseMasteryLevel(
  level: string | undefined,
  fallback: MasteryLevelId = "developing"
): MasteryLevelId {
  if (level && (MASTERY_LEVELS as readonly string[]).includes(level)) {
    return level as MasteryLevelId;
  }
  return fallback;
}

export const PROFICIENT_UNLOCK_SCORE = 70;
export const MASTERY_CHALLENGE_PASSING_SCORE = 5;
