import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { fetchClassOverview, fetchClassWeakAreas } from '@/api/teacher'
import { Card } from '@/components/ui/Card'
import { TeacherStatGrid } from '@/components/teacher/TeacherStatCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { routes } from '@/router/routes'
import { weakAreaLabel } from '@/utils/teacherLabels'

export function TeacherDashboardPage() {
  const overviewQuery = useQuery({ queryKey: ['teacher-class-overview'], queryFn: fetchClassOverview })
  const weakQuery = useQuery({ queryKey: ['teacher-class-weak-areas'], queryFn: fetchClassWeakAreas })

  const weak = weakQuery.data ?? []
  const overview = overviewQuery.data
  const gradeLevelCount = overview
    ? Object.keys(overview.gradeGroups).length
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">Class overview</h1>
        <p className="mt-2 max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
          A calm at-a-glance home for every learner you champion — numbers are only tiny lanterns, never verdicts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Whole-class pulse</h2>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            When analytics sync, a bird&apos;s-eye snapshot will settle here — for now, trust your instincts and the relationships you have built.
          </p>
          {overviewQuery.isError ? (
            <WarmQueryError
              title="Overview could not load"
              description="Something went wrong on our end while fetching the class pulse — your learners still know you care."
              onRetry={() => void overviewQuery.refetch()}
            />
          ) : overviewQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : overviewQuery.data == null ? (
            <EmptyState
              title="We are still stitching the tapestry"
              description="Overview metrics will appear as soon as your class data connects — your care in the room already counts."
            />
          ) : (
            <TeacherStatGrid
              items={[
                { label: 'Assigned students', value: overview!.studentCount },
                { label: 'Average score', value: overview!.averageScore },
                { label: 'Grade levels', value: gradeLevelCount },
                { label: 'Weak areas', value: overview!.topWeakAreas.length },
              ]}
            />
          )}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Shared stretches</h2>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            Think of these as “many students are practicing this together” — never a wall of worry.
          </p>
          {weakQuery.isError ? (
            <WarmQueryError
              title="Shared stretches could not load"
              description="Something went wrong on our end — patterns will return when the connection steadies."
              onRetry={() => void weakQuery.refetch()}
            />
          ) : weakQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : weak.length === 0 ? (
            <EmptyState
              title="No shared stretches flagged yet"
              description="When patterns emerge, we will float them here with language meant for humans, not alarms."
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
      </div>

      <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Assignment overview</h2>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            See every assigned student, grade distribution, and shared weak areas in one place.
          </p>
        </div>
        <Link
          to={routes.teacherAssignmentOverview}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-xl)] border border-[hsl(var(--color-primary))] bg-transparent px-5 py-3 text-sm font-semibold text-[hsl(var(--color-primary))] transition-[background-color,transform] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-primary)/0.06)] active:scale-[0.99]"
        >
          View assignments
        </Link>
      </Card>

      <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Ready to zoom in?</h2>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            Class insights hold learner cards, weak-area context, and soft next steps.
          </p>
        </div>
        <Link
          to={routes.teacherClass}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-xl)] bg-[hsl(var(--color-primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--color-surface))] shadow-[var(--shadow-md)] transition-[background-color,transform] duration-[var(--transition-base)] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[hsl(var(--color-primary-dark))] active:scale-[0.99]"
        >
          Open class insights
        </Link>
      </Card>
    </div>
  )
}
