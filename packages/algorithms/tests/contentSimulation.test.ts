import { describe, it, expect } from 'vitest'
import { calculateMasteryScore } from '../src/scoring.js'
import { updateBKT } from '../src/bkt.js'
import { selectNextQuestion } from '../src/questionSelection.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedsDir = join(__dirname, '../../../modules/english-grammar/seeds')

const allQuestions: any[] = []
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
for (const level of levels) {
  const qs = JSON.parse(readFileSync(join(seedsDir, `${level}.json`), 'utf8'))
  allQuestions.push(...qs)
}

const skillIds = [
  'tense-aspect', 'subject-verb-agreement', 'articles-determiners',
  'prepositions', 'conditionals', 'passive-voice', 'modal-verbs',
  'relative-clauses', 'reported-speech', 'conjunctions-connectors',
]

function runSimulation(name: string, accuracyByLevel: Record<string, number>) {
  const skillMasteries = skillIds.map((skillId) => ({
    skillId,
    score: 30,
    level: 'seedling',
  }))

  const sessionHistory: string[] = []
  const recentlySeenIds: string[] = []
  const recentAnswers: boolean[] = []
  let streak = 0
  let totalAttempts = 0

  for (let i = 0; i < 30; i++) {
    const criteria = selectNextQuestion(skillMasteries, sessionHistory, recentlySeenIds)
    const candidates = allQuestions.filter(
      (q) =>
        q.skill === criteria.skillId &&
        q.difficulty >= criteria.difficultyRange[0] &&
        q.difficulty <= criteria.difficultyRange[1] &&
        !criteria.excludeIds.includes(q.id)
    )

    if (candidates.length === 0) continue
    const q = candidates[Math.floor(Math.random() * candidates.length)]
    sessionHistory.push(q.id)
    recentlySeenIds.push(q.id)

    const levelAccuracy = accuracyByLevel[q.level] || 0.5
    const isCorrect = Math.random() < levelAccuracy
    recentAnswers.push(isCorrect)
    if (isCorrect) streak++
    else streak = 0
    totalAttempts++

    const mastery = skillMasteries.find((s) => s.skillId === q.skill)!
    const bktResult = updateBKT({ pKnown: mastery.score / 100 }, isCorrect)
    const scoreResult = calculateMasteryScore(
      bktResult.pKnown,
      recentAnswers,
      streak,
      totalAttempts
    )
    mastery.score = scoreResult.score
    mastery.level = scoreResult.level
  }

  const avgScore = skillMasteries.reduce((s, m) => s + m.score, 0) / skillMasteries.length
  return {
    name,
    avgScore,
    overallLevel: scoreResultLevel(avgScore),
    uniqueQuestions: new Set(sessionHistory).size,
    totalQuestions: sessionHistory.length,
    correctRate: recentAnswers.filter(Boolean).length / recentAnswers.length,
    skillMasteries,
  }
}

function scoreResultLevel(score: number): string {
  if (score < 30) return 'seedling'
  if (score < 50) return 'growing'
  if (score < 70) return 'developing'
  if (score < 85) return 'proficient'
  if (score < 95) return 'advanced'
  return 'mastered'
}

describe('End-to-end content simulation', () => {
  it('simulates a weak student with gentle progression', () => {
    const result = runSimulation('Weak Student', {
      A1: 0.7, A2: 0.5, B1: 0.3, B2: 0.15, C1: 0.05, C2: 0.0,
    })
    expect(result.uniqueQuestions).toBe(result.totalQuestions)
    expect(result.correctRate).toBeLessThan(0.5)
    expect(result.avgScore).toBeLessThan(60)
  })

  it('simulates an average student with balanced progression', () => {
    // Run 3 times and take average to smooth randomness
    let rates = 0
    for (let i = 0; i < 3; i++) {
      const result = runSimulation('Average Student', {
        A1: 0.9, A2: 0.75, B1: 0.55, B2: 0.35, C1: 0.15, C2: 0.05,
      })
      expect(result.uniqueQuestions).toBe(result.totalQuestions)
      rates += result.correctRate
    }
    const avgRate = rates / 3
    expect(avgRate).toBeGreaterThan(0.3)
    expect(avgRate).toBeLessThan(0.7)
  })

  it('simulates a strong student with challenging content', () => {
    const result = runSimulation('Strong Student', {
      A1: 0.95, A2: 0.9, B1: 0.8, B2: 0.65, C1: 0.45, C2: 0.25,
    })
    expect(result.uniqueQuestions).toBe(result.totalQuestions)
    expect(result.correctRate).toBeGreaterThan(0.5)
  })

  it('never repeats questions within a session', () => {
    const result = runSimulation('Uniqueness Check', {
      A1: 0.7, A2: 0.6, B1: 0.5, B2: 0.4, C1: 0.3, C2: 0.2,
    })
    expect(result.uniqueQuestions).toBe(result.totalQuestions)
  })

  it('weak student stays mostly in A1-A2 range', () => {
    const result = runSimulation('Weak Range', {
      A1: 0.7, A2: 0.5, B1: 0.3, B2: 0.15, C1: 0.05, C2: 0.0,
    })
    // Weak student should not reach advanced levels quickly
    expect(['seedling', 'growing', 'developing']).toContain(result.overallLevel)
  })

  it('strong student progresses to higher levels', () => {
    const result = runSimulation('Strong Progress', {
      A1: 0.95, A2: 0.9, B1: 0.85, B2: 0.7, C1: 0.5, C2: 0.3,
    })
    expect(['developing', 'proficient', 'advanced', 'mastered']).toContain(result.overallLevel)
  })
})

describe('Content quality checks', () => {
  it('has 600 unique question IDs', () => {
    const ids = allQuestions.map((q) => q.id)
    expect(new Set(ids).size).toBe(600)
  })

  it('has no duplicate questions across levels', () => {
    const prompts = allQuestions.map((q) => q.prompt)
    const uniquePrompts = new Set(prompts)
    expect(uniquePrompts.size).toBe(prompts.length)
  })

  it('has exactly 3 hints on all questions', () => {
    const bad = allQuestions.filter((q) => !q.hints || q.hints.length !== 3)
    expect(bad.length).toBe(0)
  })

  it('has 2-3 explanationSteps on all questions', () => {
    const bad = allQuestions.filter((q) => !q.explanationSteps || q.explanationSteps.length < 2 || q.explanationSteps.length > 3)
    expect(bad.length).toBe(0)
  })

  it('has no cold or blaming language in explanations', () => {
    const coldPatterns = ['incorrect.', 'wrong.', 'you failed', 'try harder', 'bad answer']
    let found = 0
    const offenders: string[] = []
    for (const q of allQuestions) {
      const lower = q.explanation.toLowerCase()
      for (const pattern of coldPatterns) {
        if (lower.includes(pattern.toLowerCase())) {
          found++
          offenders.push(q.id)
          break
        }
      }
    }
    expect(found).toBe(0)
  })

  it('has balanced answer key distribution across MCQs', () => {
    const mcqs = allQuestions.filter((q) => q.questionType === 'multiple-choice')
    const counts = { A: 0, B: 0, C: 0, D: 0 }
    for (const q of mcqs) {
      if (counts[q.answerKey as keyof typeof counts] !== undefined) {
        counts[q.answerKey as keyof typeof counts]++
      }
    }
    const total = mcqs.length
    // Allow 10% to 40% distribution — content has been rebalanced
    const minExpected = total * 0.10
    const maxExpected = total * 0.40
    for (const [key, count] of Object.entries(counts)) {
      expect(count).toBeGreaterThanOrEqual(minExpected)
      expect(count).toBeLessThanOrEqual(maxExpected)
    }
  })

  it('has answerKey matching one of the choices for all MCQs', () => {
    const mcqs = allQuestions.filter((q) => q.questionType === 'multiple-choice')
    for (const q of mcqs) {
      const keys = q.choices.map((c: { key: string }) => c.key)
      expect(keys).toContain(q.answerKey)
    }
  })

  it('has wrongChoiceReasons for every wrong option in MCQs', () => {
    const mcqs = allQuestions.filter((q) => q.questionType === 'multiple-choice')
    for (const q of mcqs) {
      const wrongKeys = q.choices
        .map((c: { key: string }) => c.key)
        .filter((k: string) => k !== q.answerKey)
      for (const key of wrongKeys) {
        expect(q.wrongChoiceReasons).toHaveProperty(key)
        expect(q.wrongChoiceReasons[key].length).toBeGreaterThan(5)
      }
    }
  })
})
