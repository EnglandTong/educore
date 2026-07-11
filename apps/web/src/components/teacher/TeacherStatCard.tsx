import { Card } from '@/components/ui/Card'

interface TeacherStatCardProps {
  label: string
  value: string | number
  variant?: 'elevated' | 'default'
}

export function TeacherStatCard({ label, value, variant = 'elevated' }: TeacherStatCardProps) {
  return (
    <Card variant={variant}>
      <div className="text-sm font-medium text-[hsl(var(--color-text-muted))]">{label}</div>
      <div className="mt-2 text-4xl font-bold text-[hsl(var(--color-primary))]">{value}</div>
    </Card>
  )
}

interface TeacherStatGridItemProps {
  label: string
  value: string | number
}

export function TeacherStatGrid({ items }: { items: TeacherStatGridItemProps[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary)/0.06)] p-4"
        >
          <div className="text-sm font-medium text-[hsl(var(--color-text-muted))]">{item.label}</div>
          <div className="mt-1 text-3xl font-bold text-[hsl(var(--color-primary))]">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
