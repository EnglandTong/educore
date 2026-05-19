import type { MasteryLevel } from '@educore/types'
import { scoreToLevel } from './scoring.js'

export interface DiagnosticQuestionCriteria {
  targetDifficulty: number
  difficultyRange: [number, number]
  preferredSkills?: string[]
  excludeIds: string[]
}

export interface DiagnosticResult {
  estimatedLevel: string
  estimatedAbility: number
  skillScores: { skillId: string; score: number; level: MasteryLevel }[]
  strengths: string[]
  weaknesses: string[]
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

/**
 * Diagnostic: 5 rounds x 5 questions = 25 total
 *
 * Round 1: Random sampling across all skills (broad assessment)
 * Round 2-5: Weighted toward estimated weak areas
 *
 * Difficulty starts at 0.5 (mid-level) and adapts:
 *   3+ correct -> difficulty += 0.1
 *   3+ wrong -> difficulty -= 0.1
 *
 * Final output: estimated level + per-skill scores
 */
export function selectDiagnosticQuestion(
  _round: number,
  _questionIndex: number,
  answersThisRound: boolean[],
  allAnswers: { skillId: string; correct: boolean; difficulty: number }[],
  currentDifficulty: number
): DiagnosticQuestionCriteria {
  let targetDifficulty = currentDifficulty

  const correctCount = answersThisRound.filter(Boolean).length
  const wrongCount = answersThisRound.length - correctCount

  if (correctCount >= 3) {
    targetDifficulty = Math.min(1, currentDifficulty + 0.1)
  } else if (wrongCount >= 3 && answersThisRound.length >= 3) {
    targetDifficulty = Math.max(0, currentDifficulty - 0.1)
  }

  const difficultyRange: [number, number] = [
    Math.max(0, targetDifficulty - 0.15),
    Math.min(1, targetDifficulty + 0.15),
  ]

  const usedIds = allAnswers.map((_, i) => `diag-${i}`)

  return {
    targetDifficulty,
    difficultyRange,
    excludeIds: usedIds,
  }
}

export function calculateDiagnosticResult(
  answers: { skillId: string; correct: boolean; difficulty: number }[]
): DiagnosticResult {
  const skillMap = new Map<
    string,
    { correct: number; total: number; totalDifficulty: number }
  >()

  let totalCorrect = 0
  let totalDifficultySum = 0

  for (const { skillId, correct, difficulty } of answers) {
    if (!skillMap.has(skillId)) {
      skillMap.set(skillId, { correct: 0, total: 0, totalDifficulty: 0 })
    }
    const stat = skillMap.get(skillId)!
    stat.correct += correct ? 1 : 0
    stat.total += 1
    stat.totalDifficulty += difficulty

    if (correct) totalCorrect += 1
    totalDifficultySum += difficulty
  }

  const skillScores: { skillId: string; score: number; level: MasteryLevel }[] =
    []
  for (const [skillId, stat] of skillMap) {
    const accuracy = stat.total > 0 ? stat.correct / stat.total : 0
    const avgDifficulty =
      stat.total > 0 ? stat.totalDifficulty / stat.total : 0.5
    const score = Math.round(
      accuracy * 70 + avgDifficulty * 30
    )
    skillScores.push({
      skillId,
      score,
      level: scoreToLevel(score),
    })
  }

  const overallAccuracy =
    answers.length > 0 ? totalCorrect / answers.length : 0
  const avgDifficulty =
    answers.length > 0 ? totalDifficultySum / answers.length : 0.5

  const estimatedAbility = overallAccuracy * 6 - 3 + (avgDifficulty - 0.5) * 2
  const clampedAbility = Math.max(-3, Math.min(3, estimatedAbility))

  const levelIndex = Math.min(
    LEVEL_ORDER.length - 1,
    Math.max(0, Math.floor((clampedAbility + 3) / 1.2))
  )
  const estimatedLevel = LEVEL_ORDER[levelIndex]!

  const avgScore =
    skillScores.reduce((sum, s) => sum + s.score, 0) /
    (skillScores.length || 1)
  const strengths = skillScores
    .filter((s) => s.score > avgScore)
    .map((s) => s.skillId)
  const weaknesses = skillScores
    .filter((s) => s.score < avgScore)
    .map((s) => s.skillId)

  return {
    estimatedLevel,
    estimatedAbility: clampedAbility,
    skillScores,
    strengths,
    weaknesses,
  }
}
