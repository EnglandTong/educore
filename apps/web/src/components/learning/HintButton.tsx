import { Lightbulb } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'

export interface HintButtonProps {
  hints?: string[]
}

export function HintButton({ hints }: HintButtonProps) {
  const [step, setStep] = useState(0)
  if (!hints?.length) return null

  const next = () => setStep((s) => Math.min(s + 1, hints.length - 1))
  const visible = hints.slice(0, step + 1)

  return (
    <div className="space-y-3 rounded-[var(--radius-xl)] border border-[hsl(var(--color-secondary)/0.35)] bg-[hsl(var(--color-secondary-light)/0.35)] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--color-text))]">
        <Lightbulb className="h-4 w-4 text-[hsl(var(--color-secondary))]" aria-hidden />
        Need a nudge?
      </div>
      <ul className="space-y-2 text-sm text-[hsl(var(--color-text-secondary))]">
        {visible.map((h, i) => (
          <li key={`${i}-${h}`}>
            <span className="font-semibold text-[hsl(var(--color-primary))]">Hint {i + 1}:</span> {h}
          </li>
        ))}
      </ul>
      {step < hints.length - 1 ? (
        <Button type="button" variant="secondary" size="sm" onClick={next}>
          Another tiny hint, please
        </Button>
      ) : (
        <p className="text-xs text-[hsl(var(--color-text-muted))]">You have every hint — you have got this.</p>
      )}
    </div>
  )
}
