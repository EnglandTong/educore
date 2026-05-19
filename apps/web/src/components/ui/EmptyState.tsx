import type { ReactNode } from 'react'
import { Sprout } from 'lucide-react'

import { cn } from '@/utils/cn'

export interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-10 text-center shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--color-primary)/0.12)] text-[hsl(var(--color-primary))]">
        <Sprout className="h-8 w-8" aria-hidden />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm text-[hsl(var(--color-text-secondary))]">{description}</p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
