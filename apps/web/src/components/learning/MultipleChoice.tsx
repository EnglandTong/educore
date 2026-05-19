import type { Choice } from '@educore/types'

import { cn } from '@/utils/cn'

export interface MultipleChoiceProps {
  choices: Choice[]
  value: string | null
  onChange: (key: string) => void
  disabled?: boolean
}

export function MultipleChoice({ choices, value, onChange, disabled }: MultipleChoiceProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Answer choices">
      {choices.map((c) => {
        const selected = value === c.key
        return (
          <button
            key={c.key}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(c.key)}
            className={cn(
              'rounded-[var(--radius-xl)] border px-4 py-4 text-left text-base font-medium transition focus-visible:outline-none focus-visible:ring-4',
              selected
                ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)] text-[hsl(var(--color-primary-dark))] ring-[hsl(var(--color-primary)/0.25)]'
                : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] text-[hsl(var(--color-text))] hover:border-[hsl(var(--color-primary)/0.45)]',
              disabled && 'pointer-events-none opacity-60',
            )}
          >
            <span className="mr-2 font-display text-sm text-[hsl(var(--color-text-muted))]">{c.key}.</span>
            {c.text}
          </button>
        )
      })}
    </div>
  )
}
