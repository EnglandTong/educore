export interface SessionProgressProps {
  label: string
  current: number
  total: number
  round?: number
  totalRounds?: number
}

export function SessionProgress({ label, current, total, round, totalRounds }: SessionProgressProps) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-[hsl(var(--color-text-secondary))]">
        <span>{label}</span>
        {round != null && totalRounds != null ? (
          <span>
            Round {round} of {totalRounds} — you are doing great!
          </span>
        ) : null}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[hsl(var(--color-border)/0.6)]">
        <div
          className="h-full rounded-full bg-[hsl(var(--color-primary))] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-[hsl(var(--color-text-muted))]">
        Question {Math.min(current, total)} of {total} — breathe, think, then choose.
      </p>
    </div>
  )
}
