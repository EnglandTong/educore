export interface ReviewSchedule {
  nextReviewAt: Date
  interval: number
  reviewCount: number
  mastered: boolean
}

const INTERVALS = [1, 3, 7, 14, 30]

/**
 * Simplified SM-2 for wrong answer review scheduling.
 *
 * After each review:
 *   If correct: interval increases (1d -> 3d -> 7d -> 14d -> 30d -> mastered)
 *   If wrong: reset to 1 day
 */
export function calculateNextReview(
  currentReviewCount: number,
  wasCorrect: boolean
): ReviewSchedule {
  let reviewCount = currentReviewCount
  let interval: number

  if (wasCorrect) {
    reviewCount += 1
    const index = Math.min(reviewCount - 1, INTERVALS.length - 1)
    interval = INTERVALS[index]!
  } else {
    reviewCount = 0
    interval = 1
  }

  const mastered = reviewCount >= 5

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + interval)

  return {
    nextReviewAt,
    interval,
    reviewCount,
    mastered,
  }
}
