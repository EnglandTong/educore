import { describe, it, expect } from 'vitest'
import { updateBKT } from '../src/bkt.js'

describe('BKT', () => {
  it('updates correctly on correct answer', () => {
    const result = updateBKT({ pKnown: 0.3 }, true)
    expect(result.pKnown).toBeGreaterThan(0.3)
    expect(result.learned).toBe(false)
  })

  it('updates correctly on incorrect answer', () => {
    const result = updateBKT({ pKnown: 0.3 }, false)
    expect(result.pKnown).toBeLessThan(0.3)
    expect(result.learned).toBe(false)
  })

  it('reaches mastery after many correct answers', () => {
    let pKnown = 0.3
    let learned = false
    for (let i = 0; i < 20; i++) {
      const result = updateBKT({ pKnown }, true)
      pKnown = result.pKnown
      learned = result.learned
    }
    expect(learned).toBe(true)
    expect(pKnown).toBeGreaterThan(0.85)
  })

  it('stays below 1.0 even with infinite correct answers', () => {
    let pKnown = 0.3
    for (let i = 0; i < 100; i++) {
      const result = updateBKT({ pKnown }, true)
      pKnown = result.pKnown
    }
    expect(pKnown).toBeLessThanOrEqual(1)
    expect(pKnown).toBeGreaterThan(0.9)
  })

  it('throws on invalid parameters', () => {
    expect(() => updateBKT({ pKnown: -0.1 }, true)).toThrow()
    expect(() => updateBKT({ pKnown: 1.5 }, true)).toThrow()
  })

  it('handles edge case: pKnown = 0', () => {
    const result = updateBKT({ pKnown: 0 }, true)
    expect(result.pKnown).toBeGreaterThan(0)
  })

  it('handles edge case: pKnown = 1', () => {
    const result = updateBKT({ pKnown: 1 }, false)
    expect(result.pKnown).toBeLessThanOrEqual(1)
    expect(result.pKnown).toBeGreaterThanOrEqual(0.99)
  })
})
