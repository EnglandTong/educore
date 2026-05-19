export function nextReviewIntervalDays(reviewCount: number): number {
  const intervals = [1, 3, 7, 14];
  return intervals[Math.min(reviewCount, intervals.length - 1)] ?? 14;
}
