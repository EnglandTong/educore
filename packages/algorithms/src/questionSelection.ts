export interface SkillMastery {
  skillId: string
  score: number
  level: string
  lastPracticedAt?: string
  nextReviewAt?: string
}

export interface QuestionSelectionCriteria {
  skillId: string
  targetDifficulty: number
  difficultyRange: [number, number]
  preferredTypes?: string[]
  excludeIds: string[]
}

/**
 * Select next question based on student state.
 *
 * Priority strategy:
 * 1. Weak skills (mastery < 50%) — 60% probability
 * 2. Frontier skills (50-70%, adjacent to mastered skills) — 25%
 * 3. Review skills (mastered but due for refresh) — 15%
 *
 * Within selected skill:
 * - Pick question difficulty within ±0.15 of estimated ability
 * - Never repeat within current session
 * - Never show same question to same student within 24h
 * - Vary question types (don't give 5 MCQs in a row)
 */
export function selectNextQuestion(
  studentMasteries: SkillMastery[],
  sessionHistory: string[],
  recentlySeenIds: string[],
  lastQuestionType?: string,
  estimatedAbility = 0.5
): QuestionSelectionCriteria {
  const now = new Date().toISOString()

  const weak = studentMasteries.filter((m) => m.score < 50)
  const frontier = studentMasteries.filter(
    (m) => m.score >= 50 && m.score < 70
  )
  const review = studentMasteries.filter(
    (m) => m.score >= 70 && m.nextReviewAt && m.nextReviewAt <= now
  )

  const rand = Math.random() * 100
  let selectedSkill: SkillMastery | undefined

  if (rand < 60 && weak.length > 0) {
    selectedSkill = weak[Math.floor(Math.random() * weak.length)]
  } else if (rand < 85 && frontier.length > 0) {
    selectedSkill = frontier[Math.floor(Math.random() * frontier.length)]
  } else if (review.length > 0) {
    selectedSkill = review[Math.floor(Math.random() * review.length)]
  } else if (weak.length > 0) {
    selectedSkill = weak[Math.floor(Math.random() * weak.length)]
  } else if (frontier.length > 0) {
    selectedSkill = frontier[Math.floor(Math.random() * frontier.length)]
  } else if (studentMasteries.length > 0) {
    selectedSkill =
      studentMasteries[Math.floor(Math.random() * studentMasteries.length)]
  }

  if (!selectedSkill) {
    throw new Error('No skills available for selection')
  }

  const targetDifficulty = Math.min(1, Math.max(0, estimatedAbility))
  const difficultyRange: [number, number] = [
    Math.max(0, targetDifficulty - 0.15),
    Math.min(1, targetDifficulty + 0.15),
  ]

  const preferredTypes = lastQuestionType
    ? getPreferredTypes(lastQuestionType)
    : undefined

  return {
    skillId: selectedSkill.skillId,
    targetDifficulty,
    difficultyRange,
    preferredTypes,
    excludeIds: [...new Set([...sessionHistory, ...recentlySeenIds])],
  }
}

function getPreferredTypes(lastType: string): string[] {
  const allTypes = [
    'multiple-choice',
    'gap-filling',
    'transformation',
    'matching',
    'cloze',
    'true-false',
    'error-correction',
    'open',
  ]
  return allTypes.filter((t) => t !== lastType)
}
