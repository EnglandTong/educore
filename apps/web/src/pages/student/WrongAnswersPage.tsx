import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import {
  fetchWrongAnswers,
  fetchWrongAnswersReviewDue,
  markWrongAnswerMastered,
  markWrongAnswerReviewed,
} from '@/api/wrongAnswers'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { useToastStore } from '@/stores/toastStore'
import type { WrongAnswerRecord } from '@/types'
import { cn } from '@/utils/cn'

type TabId = 'all' | 'due'

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

function reviewStatusLabel(status: WrongAnswerRecord['reviewStatus']): string {
  switch (status) {
    case 'pending':
      return 'Waiting for you'
    case 'reviewing':
      return 'You peeked again'
    case 'mastered':
      return 'You grew past this'
    default:
      return status
  }
}

function WrongAnswerCard({
  record,
  onReviewed,
  onMastered,
  reviewedPending,
  masteredPending,
}: {
  record: WrongAnswerRecord
  onReviewed: (id: string) => void
  onMastered: (id: string) => void
  reviewedPending: boolean
  masteredPending: boolean
}) {
  const canAct = record.reviewStatus !== 'mastered'
  const explanation = record.explanation || record.question.explanation

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">
            {record.question.skill}
            {record.question.subSkill ? ` · ${record.question.subSkill}` : ''}
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-[hsl(var(--color-text))]">
            {record.question.prompt}
          </h2>
          <p className="mt-2 text-xs text-[hsl(var(--color-text-muted))]">
            Saved on {formatShortDate(record.createdAt)}
            {record.reviewCount > 0 ? ` · ${record.reviewCount} gentle revisit${record.reviewCount === 1 ? '' : 's'}` : null}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
            record.reviewStatus === 'mastered' &&
              'bg-[hsl(var(--color-mastered)/0.15)] text-[hsl(var(--color-mastered))]',
            record.reviewStatus === 'reviewing' &&
              'bg-[hsl(var(--color-primary)/0.12)] text-[hsl(var(--color-primary-dark))]',
            record.reviewStatus === 'pending' &&
              'bg-[hsl(var(--color-border)/0.5)] text-[hsl(var(--color-text-secondary))]',
          )}
        >
          {reviewStatusLabel(record.reviewStatus)}
        </span>
      </div>

      <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold text-[hsl(var(--color-text-muted))]">Your answer</p>
          <p className="mt-1 text-sm text-[hsl(var(--color-text))]">{record.studentAnswer || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[hsl(var(--color-text-muted))]">Reference path</p>
          <p className="mt-1 text-sm text-[hsl(var(--color-text))]">{record.correctAnswer || '—'}</p>
        </div>
      </div>

      {explanation ? (
        <div className="rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary)/0.06)] p-4 text-sm text-[hsl(var(--color-text-secondary))]">
          <p className="font-semibold text-[hsl(var(--color-text))]">A kind explanation</p>
          <p className="mt-2 leading-relaxed">{explanation}</p>
        </div>
      ) : null}

      {canAct ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={reviewedPending}
            onClick={() => onReviewed(record.id)}
          >
            {reviewedPending ? 'Saving…' : 'I revisited this'}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={masteredPending}
            onClick={() => onMastered(record.id)}
          >
            {masteredPending ? 'Saving…' : 'I feel steady now'}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">
          Beautiful work — this one stays in your trophy garden.
        </p>
      )}
    </Card>
  )
}

export function WrongAnswersPage() {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((s) => s.pushToast)
  const [tab, setTab] = useState<TabId>('all')

  const allQuery = useQuery({ queryKey: ['wrong-answers'], queryFn: fetchWrongAnswers })
  const dueQuery = useQuery({ queryKey: ['wrong-answers-review-due'], queryFn: fetchWrongAnswersReviewDue })

  const list: WrongAnswerRecord[] = tab === 'all' ? (allQuery.data ?? []) : (dueQuery.data ?? [])
  const activeQuery = tab === 'all' ? allQuery : dueQuery
  const isLoading = tab === 'all' ? allQuery.isLoading : dueQuery.isLoading

  const reviewed = useMutation({
    mutationFn: markWrongAnswerReviewed,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wrong-answers'] })
      void queryClient.invalidateQueries({ queryKey: ['wrong-answers-review-due'] })
      pushToast({
        variant: 'success',
        title: 'Noted with care',
        message: 'We saved that you came back — every revisit is courage.',
      })
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'Hmm, that did not stick',
        message: 'The server might be napping — try again in a breath.',
      })
    },
  })

  const mastered = useMutation({
    mutationFn: markWrongAnswerMastered,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wrong-answers'] })
      void queryClient.invalidateQueries({ queryKey: ['wrong-answers-review-due'] })
      pushToast({
        variant: 'success',
        title: 'You did it!',
        message: 'We are cheering for how steady you feel — onward with warmth.',
      })
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'Hmm, that did not stick',
        message: 'The server might be napping — try again in a breath.',
      })
    },
  })

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Gentle review</p>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
          Wrong answers, reframed as invitations
        </h1>
        <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
          Nothing here is a label — only snapshots of where you were brave enough to try. Revisit when it feels right.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={tab === 'all' ? 'primary' : 'secondary'}
          size="sm"
          className="min-h-[44px]"
          onClick={() => setTab('all')}
        >
          Everything saved
        </Button>
        <Button
          type="button"
          variant={tab === 'due' ? 'primary' : 'secondary'}
          size="sm"
          className="min-h-[44px]"
          onClick={() => setTab('due')}
        >
          Ready for a revisit
        </Button>
      </div>

      {activeQuery.isError ? (
        <WarmQueryError
          title="We could not load your review notes"
          description="Something went wrong on our end — your tries are still safe; a retry usually brings them back into view."
          onRetry={() => void activeQuery.refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title={tab === 'due' ? 'Nothing is calling for a revisit yet' : 'Your review garden is peaceful'}
          description={
            tab === 'due'
              ? 'When the right moment comes, items you are nurturing will appear here with a soft nudge.'
              : 'When a try lands a little off-center, we will tuck it here — no shame, only next steps wrapped in warmth.'
          }
        />
      ) : (
        <ul className="space-y-6">
          {list.map((record) => (
            <li key={record.id}>
              <WrongAnswerCard
                record={record}
                onReviewed={(rid) => reviewed.mutate(rid)}
                onMastered={(mid) => mastered.mutate(mid)}
                reviewedPending={reviewed.isPending && reviewed.variables === record.id}
                masteredPending={mastered.isPending && mastered.variables === record.id}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
