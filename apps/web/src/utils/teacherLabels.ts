/**
 * Shared label helper for teacher weak-area / shared-stretch items.
 */
export function weakAreaLabel(
  item: unknown,
  fallback = 'A gentle focus for extra care this week',
): string {
  if (typeof item === 'string') return item
  if (!item || typeof item !== 'object') return fallback
  const o = item as Record<string, unknown>
  return (
    (typeof o.label === 'string' && o.label) ||
    (typeof o.skillName === 'string' && o.skillName) ||
    (typeof o.title === 'string' && o.title) ||
    (typeof o.topic === 'string' && o.topic) ||
    fallback
  )
}
