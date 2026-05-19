import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { fetchChildActivity, fetchChildProgress } from '@/api/parent'
import { DEFAULT_GUIDE_SKILL_ID, DEFAULT_MODULE_ID } from '@/api/progress'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { parentSubjectGuidePath, routes } from '@/router/routes'
import type { MasteryLevel } from '@/types'
import { cn } from '@/utils/cn'

const masteryLevels: MasteryLevel[] = [
  'seedling',
  'growing',
  'developing',
  'proficient',
  'advanced',
  'mastered',
]

function parseMasteryLevel(level: string | undefined): MasteryLevel {
  if (level && masteryLevels.includes(level as MasteryLevel)) {
    return level as MasteryLevel
  }
  return 'developing'
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export function ParentChildProgressPage() {
  const { childId } = useParams<{ childId: string }>()
  const id = childId ?? ''
  const navigate = useNavigate()

  const progressQuery = useQuery({
    queryKey: ['parent-child-progress', id],
    queryFn: () => fetchChildProgress(id),
    enabled: Boolean(id),
  })

  const activityQuery = useQuery({
    queryKey: ['parent-child-activity', id],
    queryFn: () => fetchChildActivity(id),
    enabled: Boolean(id),
  })

  if (!id) {
    return (
      <EmptyState
        title="We lost track of which learner to show"
        description="Head back home and pick your child again — we will load their garden with extra care."
        action={
          <Button type="button" variant="primary" className="min-h-[44px]" onClick={() => navigate(routes.parentDashboard)}>
            Back to family hub
          </Button>
        }
      />
    )
  }

  if (progressQuery.isError) {
    return (
      <WarmQueryError
        title="We could not load this learner’s snapshot"
        description="Something went wrong on our end while fetching progress — your patience means the world."
        onRetry={() => void progressQuery.refetch()}
      />
    )
  }

  const overview = progressQuery.data
  const module = overview?.modules[0]
  const activity = activityQuery.data

  const guideModuleId = module?.moduleId ?? DEFAULT_MODULE_ID
  const guidePath = parentSubjectGuidePath(guideModuleId, DEFAULT_GUIDE_SKILL_ID)

  const sessions = activity?.recentSessions ?? []
  const messages = activity?.recentMessages ?? []
  const hasActivity = sessions.length > 0 || messages.length > 0

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Child progress</p>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
            Their growth, told as a story of care
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[hsl(var(--color-text-secondary))]">
            Numbers are only tiny breadcrumbs — the real plot is effort, curiosity, and how proud they feel trying.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="min-h-[44px]"
          onClick={() => navigate(routes.parentDashboard)}
        >
          Back to family hub
        </Button>
      </div>

      {progressQuery.isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !overview ? (
        <EmptyState
          title="We are still gathering their petals"
          description="Progress will unfurl here as soon as the classroom and app sync — nothing is wrong, just a little patience."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl font-semibold">Snapshot</h2>
              {module ? <Badge level={parseMasteryLevel(module.overallLevel)} /> : null}
            </div>
            <p className="text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
              {module
                ? `${module.moduleName} is blooming with ${module.masteredCount} mastered skills so far — every revisit counts.`
                : 'We will tuck module highlights here the moment they arrive.'}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4">
                <p className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--color-text-muted))]">Current streak</p>
                <p className="mt-2 text-2xl font-semibold text-[hsl(var(--color-text))]">{overview.currentStreak} days</p>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">Rhythm builds confidence quietly.</p>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4">
                <p className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--color-text-muted))]">Total XP</p>
                <p className="mt-2 text-2xl font-semibold text-[hsl(var(--color-text))]">{overview.totalXP}</p>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">Every thoughtful try earns sparkle.</p>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4">
                <p className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--color-text-muted))]">Longest streak</p>
                <p className="mt-2 text-2xl font-semibold text-[hsl(var(--color-text))]">{overview.longestStreak} days</p>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">Proof of their dedication.</p>
              </div>
            </div>
            <Link
              to={guidePath}
              className={cn(
                'inline-flex min-h-[44px] w-full items-center justify-center rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-primary)/0.08)] px-4 py-3 text-center text-sm font-semibold text-[hsl(var(--color-primary-dark))] transition-[background-color] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-primary)/0.14)]',
              )}
            >
              Open a cozy subject guide for at-home support
            </Link>
          </Card>
          <Card className="flex flex-col items-center gap-4">
            <h2 className="font-display text-xl font-semibold">Overall warmth</h2>
            <ProgressRing value={module?.overallScore ?? 0} label="Whole-child growth lens" />
            <p className="text-center text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
              This ring is a hug-shaped chart — celebrate motion, not perfection.
            </p>
          </Card>
        </div>
      )}

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Recent moments</h2>
        <p className="text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
          Practice sessions and school notes land here — read them aloud like tiny victories.
        </p>
        {activityQuery.isError ? (
          <WarmQueryError
            title="Activity could not load"
            description="Something went wrong on our end while fetching recent moments — their progress snapshot above may still help."
            onRetry={() => void activityQuery.refetch()}
          />
        ) : activityQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !hasActivity ? (
          <EmptyState
            title="No recent lines yet"
            description="When sessions and messages sync, you will see a gentle timeline here — nothing urgent, just context to celebrate together."
          />
        ) : (
          <div className="space-y-6">
            {sessions.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-text-muted))]">
                  Practice sessions
                </h3>
                <ul className="space-y-3">
                  {sessions.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4"
                    >
                      <p className="text-sm font-semibold text-[hsl(var(--color-text-muted))]">{formatWhen(s.startedAt)}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--color-text))]">{s.encouragement}</p>
                      <p className="mt-2 text-sm text-[hsl(var(--color-text-secondary))]">
                        {s.type} · {s.status} · module {s.moduleId}
                        {s.totalQuestions ? ` · ${s.correctCount}/${s.totalQuestions} thoughtful tries` : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {messages.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-text-muted))]">
                  Recent school notes
                </h3>
                <ul className="space-y-3">
                  {messages.map((m) => (
                    <li
                      key={m.id}
                      className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4"
                    >
                      <p className="text-sm font-semibold text-[hsl(var(--color-text-muted))]">
                        {m.senderName} ({m.senderRole}) · {formatWhen(m.sentAt)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--color-text))]">{m.content}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  )
}
