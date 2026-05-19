import type { Question } from '@educore/types'

import { GapFilling } from './GapFilling'
import { HintButton } from './HintButton'
import { MultipleChoice } from './MultipleChoice'
import { Transformation } from './Transformation'
import { TrueFalse } from './TrueFalse'
import { Card } from '@/components/ui/Card'

export interface QuestionRendererProps {
  question: Question
  value: string | boolean | null
  onChange: (v: string | boolean) => void
  disabled?: boolean
}

export function QuestionRenderer({ question, value, onChange, disabled }: QuestionRendererProps) {
  const strVal = typeof value === 'string' ? value : ''
  const boolVal = typeof value === 'boolean' ? value : null
  const isGap = question.questionType === 'gap-filling'

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">
          {question.skill}
          {question.subSkill ? ` · ${question.subSkill}` : ''}
        </p>
        {!isGap ? (
          <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-[hsl(var(--color-text))] md:text-3xl">
            {question.prompt}
          </h2>
        ) : (
          <h2 className="mt-2 font-display text-xl font-semibold text-[hsl(var(--color-text))]">
            Fill in the blank with confidence
          </h2>
        )}
      </div>

      {question.questionType === 'multiple-choice' && question.choices ? (
        <MultipleChoice
          choices={question.choices}
          value={strVal || null}
          onChange={(k) => onChange(k)}
          disabled={disabled}
        />
      ) : null}

      {question.questionType === 'true-false' ? (
        <TrueFalse value={boolVal} onChange={(b) => onChange(b)} disabled={disabled} />
      ) : null}

      {question.questionType === 'gap-filling' ? (
        <GapFilling prompt={question.prompt} value={strVal} onChange={(v) => onChange(v)} disabled={disabled} />
      ) : null}

      {question.questionType === 'transformation' || question.questionType === 'open' ? (
        <Transformation prompt={question.prompt} value={strVal} onChange={(v) => onChange(v)} disabled={disabled} />
      ) : null}

      {question.questionType === 'matching' ? (
        <div className="space-y-4">
          <p className="rounded-[var(--radius-lg)] border border-dashed border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4 text-sm text-[hsl(var(--color-text-secondary))]">
            Matching adventures are being polished — share your best pairs in words for now, and we will cheer you on.
          </p>
          <Transformation prompt="Describe your pairs (e.g. A → 2, B → 1)" value={strVal} onChange={(v) => onChange(v)} disabled={disabled} />
        </div>
      ) : null}

      {question.questionType === 'error-correction' ? (
        <Transformation prompt={question.prompt} value={strVal} onChange={(v) => onChange(v)} disabled={disabled} />
      ) : null}

      {question.questionType === 'cloze' ? (
        <GapFilling prompt={question.prompt} value={strVal} onChange={(v) => onChange(v)} disabled={disabled} />
      ) : null}

      <HintButton hints={question.hints} />
    </Card>
  )
}
