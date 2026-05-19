import { describe, it, expect } from 'vitest'
import { calculateMasteryScore, scoreToLevel } from '../src/scoring.js'

describe('Scoring', () => {
  it('returns seedling for low scores', () => {
    const result = calculateMasteryScore(0.2, [], 0, 5)
    expect(result.level).toBe('seedling')
    expect(result.score).toBeLessThan(30)
  })

  it('returns growing for moderate scores', () => {
    const result = calculateMasteryScore(0.4, [true, false, false], 1, 10)
    expect(result.score).toBeGreaterThanOrEqual(30)
    expect(result.score).toBeLessThan(50)
    expect(result.level).toBe('growing')
  })

  it('returns developing for decent scores', () => {
    const result = calculateMasteryScore(0.7, [true, true, true, false], 3, 15)
    expect(result.score).toBeGreaterThanOrEqual(50)
    expect(result.score).toBeLessThan(70)
    expect(result.level).toBe('developing')
  })

  it('returns proficient for good scores', () => {
    const result = calculateMasteryScore(0.8, [true, true, true, true, true], 5, 20)
    expect(result.score).toBeGreaterThanOrEqual(70)
    expect(result.score).toBeLessThan(85)
    expect(result.level).toBe('proficient')
  })

  it('returns advanced for very good scores', () => {
    const result = calculateMasteryScore(0.9, Array(10).fill(true), 10, 25)
    expect(result.score).toBeGreaterThanOrEqual(85)
    expect(result.score).toBeLessThan(95)
    expect(result.level).toBe('advanced')
  })

  it('returns mastered for top scores', () => {
    const result = calculateMasteryScore(1.0, Array(10).fill(true), 25, 25)
    expect(result.score).toBeGreaterThanOrEqual(95)
    expect(result.level).toBe('mastered')
  })

  it('throws on invalid bktPKnown', () => {
    expect(() => calculateMasteryScore(-0.1, [], 0, 0)).toThrow()
    expect(() => calculateMasteryScore(1.1, [], 0, 0)).toThrow()
  })

  it('scoreToLevel maps correctly', () => {
    expect(scoreToLevel(0)).toBe('seedling')
    expect(scoreToLevel(29)).toBe('seedling')
    expect(scoreToLevel(30)).toBe('growing')
    expect(scoreToLevel(49)).toBe('growing')
    expect(scoreToLevel(50)).toBe('developing')
    expect(scoreToLevel(69)).toBe('developing')
    expect(scoreToLevel(70)).toBe('proficient')
    expect(scoreToLevel(84)).toBe('proficient')
    expect(scoreToLevel(85)).toBe('advanced')
    expect(scoreToLevel(94)).toBe('advanced')
    expect(scoreToLevel(95)).toBe('mastered')
    expect(scoreToLevel(100)).toBe('mastered')
  })
})
