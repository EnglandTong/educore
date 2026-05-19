import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'

export interface ProgressRingProps {
  value: number
  label?: string
  size?: number
  className?: string
}

export function ProgressRing({ value, label, size = 120, className }: ProgressRingProps) {
  const stroke = 10
  const r = size / 2 - stroke
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, value))
  const offset = c - (clamped / 100) * c

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--color-border))"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--color-primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{ filter: 'drop-shadow(0 0 8px hsl(var(--color-primary) / 0.25))' }}
        />
      </svg>
      {label ? (
        <p className="max-w-[12rem] text-center text-sm font-medium text-[hsl(var(--color-text-secondary))]">
          {label}
        </p>
      ) : null}
    </div>
  )
}
