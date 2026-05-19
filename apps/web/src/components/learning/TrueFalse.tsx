import { cn } from '@/utils/cn'

export interface TrueFalseProps {
  value: boolean | null
  onChange: (v: boolean) => void
  disabled?: boolean
}

export function TrueFalse({ value, onChange, disabled }: TrueFalseProps) {
  const options: { label: string; val: boolean; emoji: string }[] = [
    { label: 'True — sounds right to me', val: true, emoji: '✓' },
    { label: 'False — I would say it another way', val: false, emoji: '…' },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const selected = value === o.val
        return (
          <button
            key={String(o.val)}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.val)}
            className={cn(
              'rounded-[var(--radius-xl)] border px-4 py-5 text-left text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-4',
              selected
                ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)] ring-[hsl(var(--color-primary)/0.25)]'
                : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] hover:border-[hsl(var(--color-primary)/0.35)]',
              disabled && 'pointer-events-none opacity-60',
            )}
          >
            <span className="mr-2" aria-hidden>
              {o.emoji}
            </span>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
