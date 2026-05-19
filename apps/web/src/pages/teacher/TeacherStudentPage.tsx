import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchStudentSummary } from '@/api/teacher'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { routes } from '@/router/routes'

function summaryLines(summary: unknown): { label: string; value: string }[] {
  if (summary == null) return []
  if (typeof summary !== 'object' || Array.isArray(summary)) {
    return [{ label: 'Note', value: String(summary) }]
  }
  const o = summary as Record<string, unknown>
  const preferred = ['name', 'displayName', 'email', 'overallScore', 'level', 'streak', 'encouragement', 'focus', 'notes']
  const lines: { label: string; value: string }[] = []
  for (const key of preferred) {
    if (key in o && o[key] != null && o[key] !== '') {
      lines.push({ label: key, value: String(o[key]) })
    }
  }
  if (lines.length > 0) return lines
  return Object.entries(o)
    .filter(([, v]) => v != null && String(v) !== '')
    .slice(0, 12)
    .map(([k, v]) => ({ label: k, value: String(v) }))
}

export function TeacherStudentPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const id = studentId ?? ''
  const navigate = useNavigate()

  const summaryQuery = useQuery({
    queryKey: ['teacher-student-summary', id],
    queryFn: () => fetchStudentSummary(id),
    enabled: Boolean(id),
  })

  if (!id) {
    return (
      <EmptyState
        title="We need a learner id to open this page"
        description="Return to class insights and pick a student card — we will load their gentle snapshot."
        action={
          <Button type="button" variant="primary" className="min-h-[44px]" onClick={() => navigate(routes.teacherClass)}>
            Back to class insights
          </Button>
        }
      />
    )
  }

  const lines = summaryLines(summaryQuery.data ?? null)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Learner lens</p>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
            A calm snapshot for one student
          </h1>
          <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
            Lead with what they are doing well — this page is here to help you notice, not to label.
          </p>
        </div>
        <Button type="button" variant="secondary" className="min-h-[44px]" onClick={() => navigate(routes.teacherClass)}>
          Back to class insights
        </Button>
      </div>

      {summaryQuery.isError ? (
        <WarmQueryError
          title="This learner snapshot could not load"
          description="Something went wrong on our end — permissions may also apply; a gentle retry often helps."
          onRetry={() => void summaryQuery.refetch()}
        />
      ) : summaryQuery.isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : summaryQuery.data == null ? (
        <EmptyState
          title="Their story is still syncing"
          description="When the roster links to learning data, a warm summary will appear — for now, trust the relationship you already have with them."
        />
      ) : (
        <Card className="space-y-4">
          <h2 className="font-display text-xl font-semibold">What we know so far</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {lines.map(({ label, value }) => (
              <div key={label} className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4">
                <dt className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-text-muted))]">{label}</dt>
                <dd className="mt-1 text-sm text-[hsl(var(--color-text))]">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
    </div>
  )
}
