import { cn } from '@/utils/cn'

export interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-lg)] bg-gradient-to-r from-[hsl(var(--color-border))] via-[hsl(var(--color-surface))] to-[hsl(var(--color-border))] bg-[length:200%_100%]',
        className,
      )}
      aria-hidden
    />
  )
}
