import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { fetchClassOverview, fetchClassWeakAreas } from '@/api/teacher'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { routes, teacherStudentPath } from '@/router/routes'

function weakAreaLabel(item: unknown): string {
  if (typeof item === 'string') return item
  if (!item || typeof item !== 'object') return 'A place we can nurture together'
  const o = item as Record<string, unknown>
  return (
    (typeof o.label === 'string' && o.label) ||
    (typeof o.skillName === 'string' && o.skillName) ||
    (typeof o.title === 'string' && o.title) ||
    (typeof o.topic === 'string' && o.topic) ||
    'A gentle focus for extra care this week'
  )
}

function rosterFromOverview(overview: unknown): { id: string; label: string }[] {
  if (!overview || typeof overview !== 'object') return []
  const o = overview as Record<string, unknown>
  const students = o.students ?? o.learners ?? o.roster
  if (!Array.isArray(students)) return []
  return students.flatMap((s) => {
    if (!s || typeof s !== 'object') return []
    const r = s as Record<string, unknown>
    const id = typeof r.id === 'string' ? r.id : typeof r.studentId === 'string' ? r.studentId : ''
    const label =
      (typeof r.name === 'string' && r.name) ||
      (typeof r.displayName === 'string' && r.displayName) ||
      (typeof r.email === 'string' && r.email) ||
      'Learner'
    if (!id) return []
    return [{ id, label }]
  })
}

export function TeacherClassPage() {
  const overviewQuery = useQuery({ queryKey: ['teacher-class-overview'], queryFn: fetchClassOverview })
  const weakQuery = useQuery({ queryKey: ['teacher-class-weak-areas'], queryFn: fetchClassWeakAreas })

  const roster = rosterFromOverview(overviewQuery.data ?? null)
  const weak = weakQuery.data ?? []

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Class insights</p>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
          Where the whole room is shining — and where a hug of support helps
        </h1>
        <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
          Use this page to notice patterns with kindness; every name below is a whole story, not a data point.
        </p>
      </div>

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Learners</h2>
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">
          Tap a name to open their gentle snapshot — celebrate strengths before planning supports.
        </p>
        {overviewQuery.isError ? (
          <WarmQueryError
            title="Learner list could not load"
            description="Something went wrong on our end while fetching your class roster — your care in the room is unchanged."
            onRetry={() => void overviewQuery.refetch()}
          />
        ) : overviewQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : roster.length === 0 ? (
          <EmptyState
            title="Your roster is still arriving"
            description="When class data syncs, learner cards will line up here like desks ready for morning hellos."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {roster.map((s) => (
              <li key={s.id}>
                <Link
                  to={teacherStudentPath(s.id)}
                  className="block min-h-[44px] rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-4 text-sm font-semibold leading-snug text-[hsl(var(--color-primary))] shadow-[var(--shadow-sm)] transition-[background-color] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-primary)/0.06)]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Shared stretches</h2>
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">
          Weak spots are really “many students are practicing this together” — frame it that way aloud.
        </p>
        {weakQuery.isError ? (
          <WarmQueryError
            title="Shared stretches could not load"
            description="Something went wrong on our end — try again in a breath."
            onRetry={() => void weakQuery.refetch()}
          />
        ) : weakQuery.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : weak.length === 0 ? (
          <EmptyState
            title="No shared stretches flagged yet"
            description="When patterns emerge across the class, we will list them here with language that feels supportive, not alarming."
          />
        ) : (
          <ul className="space-y-2">
            {weak.map((item, idx) => (
              <li
                key={idx}
                className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] px-4 py-3 text-sm text-[hsl(var(--color-text))]"
              >
                {weakAreaLabel(item)}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-center text-sm text-[hsl(var(--color-text-muted))]">
        Want the aerial view first?{' '}
        <Link className="font-semibold text-[hsl(var(--color-primary))] hover:underline" to={routes.teacherDashboard}>
          Visit your teacher home
        </Link>
        .
      </p>
    </div>
  )
}
