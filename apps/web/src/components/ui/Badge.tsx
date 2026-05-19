import { cn } from '@/utils/cn'
import type { MasteryLevel } from '@/types'

const levelToClass: Record<MasteryLevel, string> = {
  seedling: 'bg-[hsl(var(--color-seedling)/0.15)] text-[hsl(var(--color-seedling))] ring-1 ring-[hsl(var(--color-seedling)/0.25)]',
  growing: 'bg-[hsl(var(--color-growing)/0.15)] text-[hsl(var(--color-growing))] ring-1 ring-[hsl(var(--color-growing)/0.25)]',
  developing:
    'bg-[hsl(var(--color-developing)/0.15)] text-[hsl(var(--color-developing))] ring-1 ring-[hsl(var(--color-developing)/0.25)]',
  proficient:
    'bg-[hsl(var(--color-proficient)/0.15)] text-[hsl(var(--color-proficient))] ring-1 ring-[hsl(var(--color-proficient)/0.25)]',
  advanced: 'bg-[hsl(var(--color-advanced)/0.15)] text-[hsl(var(--color-advanced))] ring-1 ring-[hsl(var(--color-advanced)/0.25)]',
  mastered: 'bg-[hsl(var(--color-mastered)/0.15)] text-[hsl(var(--color-mastered))] ring-1 ring-[hsl(var(--color-mastered)/0.25)]',
}

const levelLabel: Record<MasteryLevel, string> = {
  seedling: 'Seedling',
  growing: 'Growing',
  developing: 'Developing',
  proficient: 'Proficient',
  advanced: 'Advanced',
  mastered: 'Mastered',
}

export interface BadgeProps {
  level: MasteryLevel
  className?: string
}

export function Badge({ level, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize',
        levelToClass[level],
        className,
      )}
    >
      {levelLabel[level]}
    </span>
  )
}
