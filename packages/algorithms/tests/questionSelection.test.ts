import { describe, it, expect } from 'vitest'
import { selectNextQuestion } from '../src/questionSelection.js'

describe('Question Selection', () => {
  it('selects a weak skill with 60% probability', () => {
    const masteries = [
      { skillId: 'weak-skill', score: 30, level: 'seedling' },
      { skillId: 'frontier-skill', score: 60, level: 'developing' },
      { skillId: 'mastered-skill', score: 90, level: 'advanced', nextReviewAt: '2000-01-01T00:00:00Z' },
    ]

    const counts = new Map<string, number>()
    for (let i = 0; i < 1000; i++) {
      const result = selectNextQuestion(masteries, [], [])
      counts.set(result.skillId, (counts.get(result.skillId) || 0) + 1)
    }

    const weakCount = counts.get('weak-skill') || 0
    expect(weakCount).toBeGreaterThan(500)
  })

  it('excludes session history and recently seen', () => {
    const masteries = [
      { skillId: 'skill-a', score: 30, level: 'seedling' },
    ]

    const result = selectNextQuestion(
      masteries,
      ['q1', 'q2'],
      ['q3', 'q4'],
      'multiple-choice'
    )

    expect(result.excludeIds).toContain('q1')
    expect(result.excludeIds).toContain('q2')
    expect(result.excludeIds).toContain('q3')
    expect(result.excludeIds).toContain('q4')
  })

  it('varies question types', () => {
    const masteries = [
      { skillId: 'skill-a', score: 30, level: 'seedling' },
    ]

    const result = selectNextQuestion(
      masteries,
      [],
      [],
      'multiple-choice'
    )

    expect(result.preferredTypes).toBeDefined()
    expect(result.preferredTypes).not.toContain('multiple-choice')
  })

  it('throws when no skills available', () => {
    expect(() => selectNextQuestion([], [], [])).toThrow()
  })

  it('target difficulty is within range', () => {
    const masteries = [
      { skillId: 'skill-a', score: 30, level: 'seedling' },
    ]

    const result = selectNextQuestion(masteries, [], [], undefined, 0.7)
    expect(result.targetDifficulty).toBe(0.7)
    expect(result.difficultyRange[0]).toBeCloseTo(0.55, 5)
    expect(result.difficultyRange[1]).toBeCloseTo(0.85, 5)
  })
})
