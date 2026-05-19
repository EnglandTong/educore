import { type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CardVariant = 'default' | 'elevated' | 'interactive'

const variantClass: Record<CardVariant, string> = {
  default: 'bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] shadow-[var(--shadow-sm)]',
  elevated: 'bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] shadow-[var(--shadow-lg)]',
  interactive:
    'bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 transition-all duration-[var(--transition-base)]',
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return <div className={cn('rounded-[var(--radius-xl)] p-6', variantClass[variant], className)} {...props} />
}
