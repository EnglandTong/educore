import { describe, it, expect } from 'vitest'
import { calculateNextReview } from '../src/spacedRepetition.js'

describe('Spaced Repetition', () => {
  it('resets to 1 day on wrong answer', () => {
    const result = calculateNextReview(3, false)
    expect(result.interval).toBe(1)
    expect(result.reviewCount).toBe(0)
    expect(result.mastered).toBe(false)
  })

  it('increases interval on correct answer', () => {
    const r1 = calculateNextReview(0, true)
    expect(r1.interval).toBe(1)
    expect(r1.reviewCount).toBe(1)

    const r2 = calculateNextReview(1, true)
    expect(r2.interval).toBe(3)
    expect(r2.reviewCount).toBe(2)

    const r3 = calculateNextReview(2, true)
    expect(r3.interval).toBe(7)
    expect(r3.reviewCount).toBe(3)
  })

  it('marks mastered after 5 correct reviews', () => {
    const result = calculateNextReview(4, true)
    expect(result.interval).toBe(30)
    expect(result.reviewCount).toBe(5)
    expect(result.mastered).toBe(true)
  })

  it('caps interval at 30 days', () => {
    const result = calculateNextReview(10, true)
    expect(result.interval).toBe(30)
    expect(result.reviewCount).toBe(11)
    expect(result.mastered).toBe(true)
  })

  it('nextReviewAt is in the future', () => {
    const before = new Date()
    const result = calculateNextReview(0, true)
    const after = new Date()
    expect(result.nextReviewAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(result.nextReviewAt.getTime()).toBeLessThanOrEqual(after.getTime() + 2 * 86400000)
  })
})
