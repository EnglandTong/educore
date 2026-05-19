import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/utils/cn'

export interface ExplanationProps {
  explanation: string
  steps?: string[]
  className?: string
}

export function Explanation({ explanation, steps, className }: ExplanationProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn('rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))]', className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[hsl(var(--color-text))]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Peek at the friendly explanation
        <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} aria-hidden />
      </button>
      {open ? (
        <div className="space-y-3 border-t border-[hsl(var(--color-border))] px-4 py-4 text-sm text-[hsl(var(--color-text-secondary))]">
          <p>{explanation}</p>
          {steps?.length ? (
            <ol className="list-decimal space-y-2 pl-5">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
