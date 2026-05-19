export function formatDisplayName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'Friend'
  return trimmed.split(/\s+/)[0] ?? trimmed
}
