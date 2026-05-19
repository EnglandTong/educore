import { Input } from '@/components/ui/Input'

export interface GapFillingProps {
  prompt: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export function GapFilling({ prompt, value, onChange, disabled }: GapFillingProps) {
  const parts = prompt.split('___')
  if (parts.length < 2) {
    return (
      <div className="space-y-3">
        <p className="text-lg leading-relaxed text-[hsl(var(--color-text))]">{prompt}</p>
        <Input
          label="Your gentle answer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          helperText="Fill in the blank in a way that feels right to you."
        />
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-lg leading-relaxed text-[hsl(var(--color-text))]">
      {parts.map((part, i) => (
        <span key={`${i}-${part.slice(0, 8)}`} className="contents">
          <span>{part}</span>
          {i < parts.length - 1 ? (
            <input
              className="inline-block min-w-[6rem] rounded-[var(--radius-md)] border border-[hsl(var(--color-primary)/0.45)] bg-[hsl(var(--color-surface))] px-2 py-1 text-center text-base font-medium text-[hsl(var(--color-text))] outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.35)]"
              value={value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              aria-label="Fill blank"
            />
          ) : null}
        </span>
      ))}
    </div>
  )
}
