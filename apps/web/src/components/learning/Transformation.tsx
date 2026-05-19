import { Input } from '@/components/ui/Input'

export interface TransformationProps {
  prompt: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export function Transformation({ prompt, value, onChange, disabled }: TransformationProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg leading-relaxed text-[hsl(var(--color-text))]">{prompt}</p>
      <Input
        label="Share your transformed sentence"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        helperText="Take your time — small steps still move mountains."
      />
    </div>
  )
}
