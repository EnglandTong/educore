import type { MasteryLevel } from '@educore/types'

/**
 * Calculate mastery score from multiple signals:
 * - BKT pKnown (60% weight)
 * - Recent accuracy: last 10 answers (30% weight)
 * - Consistency bonus: streak / attempts ratio (10% weight)
 *
 * Returns 0-100 score and corresponding MasteryLevel
 */
export function calculateMasteryScore(
  bktPKnown: number,
  recentAnswers: boolean[],
  streak: number,
  totalAttempts: number
): { score: number; level: MasteryLevel } {
  if (bktPKnown < 0 || bktPKnown > 1) {
    throw new Error('bktPKnown must be between 0 and 1')
  }

  const bktComponent = bktPKnown * 60

  const recent = recentAnswers.slice(-10)
  const recentAccuracy =
    recent.length > 0
      ? recent.filter(Boolean).length / recent.length
      : 0
  const recentComponent = recentAccuracy * 30

  const consistency =
    totalAttempts > 0 ? Math.min(streak / totalAttempts, 1) : 0
  const consistencyComponent = consistency * 10

  const rawScore = bktComponent + recentComponent + consistencyComponent
  const score = Math.round(Math.min(100, Math.max(0, rawScore)))

  return { score, level: scoreToLevel(score) }
}

/** Map score to mastery level */
export function scoreToLevel(score: number): MasteryLevel {
  if (score < 30) return 'seedling'
  if (score < 50) return 'growing'
  if (score < 70) return 'developing'
  if (score < 85) return 'proficient'
  if (score < 95) return 'advanced'
  return 'mastered'
}
