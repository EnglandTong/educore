import { describe, it, expect } from 'vitest'
import { selectDiagnosticQuestion, calculateDiagnosticResult } from '../src/diagnosticStrategy.js'

describe('Diagnostic Strategy', () => {
  it('increases difficulty after many correct answers', () => {
    const result = selectDiagnosticQuestion(
      1,
      3,
      [true, true, true],
      [],
      0.5
    )
    expect(result.targetDifficulty).toBeCloseTo(0.6, 5)
  })

  it('decreases difficulty after many wrong answers', () => {
    const result = selectDiagnosticQuestion(
      1,
      3,
      [false, false, false],
      [],
      0.5
    )
    expect(result.targetDifficulty).toBeCloseTo(0.4, 5)
  })

  it('keeps difficulty stable with mixed answers', () => {
    const result = selectDiagnosticQuestion(
      1,
      2,
      [true, false],
      [],
      0.5
    )
    expect(result.targetDifficulty).toBeCloseTo(0.5, 5)
  })

  it('calculates result with correct level estimate', () => {
    const answers = [
      { skillId: 'tense-aspect', correct: true, difficulty: 0.2 },
      { skillId: 'tense-aspect', correct: true, difficulty: 0.3 },
      { skillId: 'prepositions', correct: true, difficulty: 0.2 },
      { skillId: 'prepositions', correct: false, difficulty: 0.3 },
    ]

    const result = calculateDiagnosticResult(answers)
    expect(result.estimatedLevel).toBeDefined()
    expect(result.skillScores.length).toBe(2)
    expect(result.strengths.length + result.weaknesses.length).toBe(2)
  })

  it('estimates higher level with good performance on hard questions', () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      skillId: 'skill-a',
      correct: true,
      difficulty: 0.8 + i * 0.02,
    }))

    const result = calculateDiagnosticResult(answers)
    expect(['B2', 'C1', 'C2']).toContain(result.estimatedLevel)
  })

  it('estimates lower level with poor performance on easy questions', () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      skillId: 'skill-a',
      correct: false,
      difficulty: 0.1 + i * 0.02,
    }))

    const result = calculateDiagnosticResult(answers)
    expect(['A1', 'A2']).toContain(result.estimatedLevel)
  })
})
