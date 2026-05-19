import { describe, it, expect } from 'vitest'
import { probability, estimateAbility, optimalDifficulty, mapDifficultyToIRT, mapIRTToDifficulty } from '../src/irt.js'

describe('IRT', () => {
  it('probability is 0.5 when ability equals difficulty', () => {
    const p = probability(0, { difficulty: 0, discrimination: 1 })
    expect(p).toBeCloseTo(0.5, 5)
  })

  it('probability increases with ability', () => {
    const pLow = probability(-2, { difficulty: 0, discrimination: 1 })
    const pHigh = probability(2, { difficulty: 0, discrimination: 1 })
    expect(pHigh).toBeGreaterThan(pLow)
  })

  it('probability decreases with difficulty', () => {
    const pEasy = probability(0, { difficulty: -2, discrimination: 1 })
    const pHard = probability(0, { difficulty: 2, discrimination: 1 })
    expect(pEasy).toBeGreaterThan(pHard)
  })

  it('discrimination affects steepness', () => {
    const pSteep = probability(1, { difficulty: 0, discrimination: 2 })
    const pFlat = probability(1, { difficulty: 0, discrimination: 0.5 })
    expect(pSteep).toBeGreaterThan(pFlat)
  })

  it('estimateAbility returns 0 for empty responses', () => {
    expect(estimateAbility([])).toBe(0)
  })

  it('estimateAbility increases with more correct answers', () => {
    const easyQ = { params: { difficulty: -2, discrimination: 1 }, correct: true }
    const hardQ = { params: { difficulty: 2, discrimination: 1 }, correct: true }

    const abilityEasy = estimateAbility([easyQ, easyQ])
    const abilityHard = estimateAbility([hardQ, hardQ])

    expect(abilityHard).toBeGreaterThanOrEqual(abilityEasy)
  })

  it('optimalDifficulty maps ability back to 0-1', () => {
    expect(optimalDifficulty(-3)).toBeCloseTo(0, 5)
    expect(optimalDifficulty(0)).toBeCloseTo(0.5, 5)
    expect(optimalDifficulty(3)).toBeCloseTo(1, 5)
  })

  it('mapDifficultyToIRT is inverse of mapIRTToDifficulty', () => {
    for (let d = 0; d <= 1; d += 0.1) {
      expect(mapIRTToDifficulty(mapDifficultyToIRT(d))).toBeCloseTo(d, 5)
    }
  })
})
