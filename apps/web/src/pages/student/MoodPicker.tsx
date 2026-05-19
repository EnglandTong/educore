const MOODS: Array<{ emoji: string; label: string }> = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😤', label: 'Angry' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Confused' },
  { emoji: '🥰', label: 'Loved' }
]

interface MoodPickerProps {
  value?: string
  onChange: (mood: string) => void
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {MOODS.map(({ emoji, label }) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border-2 p-3 transition-all ${
            value === emoji
              ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.08)]'
              : 'border-transparent bg-[hsl(var(--color-bg))] hover:bg-[hsl(var(--color-border)/0.3)]'
          }`}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-[10px] font-medium text-[hsl(var(--color-text-secondary))]">{label}</span>
        </button>
      ))}
    </div>
  )
}
