import { motion } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { pickWarmCorrect, pickWarmWrong } from '@/utils/warmFeedback'
import { cn } from '@/utils/cn'

export interface AnswerFeedbackProps {
  isCorrect: boolean
  serverFeedback?: string
  explanation?: string
  onContinue?: () => void
  continueLabel?: string
  className?: string
}

export function AnswerFeedback({
  isCorrect,
  serverFeedback,
  explanation,
  onContinue,
  continueLabel = 'Continue',
  className,
}: AnswerFeedbackProps) {
  const headline = serverFeedback?.trim() || (isCorrect ? pickWarmCorrect() : pickWarmWrong())

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[var(--radius-xl)] border p-6 shadow-[var(--shadow-md)]',
        isCorrect
          ? 'border-[hsl(var(--color-success)/0.35)] bg-[hsl(var(--color-success-light))]'
          : 'border-[hsl(var(--color-error)/0.35)] bg-[hsl(var(--color-error-light))]',
        className,
      )}
    >
      <p className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">{headline}</p>
      {explanation ? (
        <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">{explanation}</p>
      ) : null}
      {onContinue ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={onContinue}>
            {continueLabel}
          </Button>
        </div>
      ) : null}
    </motion.div>
  )
}
