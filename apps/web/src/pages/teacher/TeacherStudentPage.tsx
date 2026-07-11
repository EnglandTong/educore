import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchStudentSummary } from '@/api/teacher'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { routes } from '@/router/routes'

interface ParsedStudentSummary {
  studentName: string | null
  gradeLevel: string | null
  masteryCount: number | null
  activeSkills: number | null
}

function parseStudentSummary(summary: unknown): ParsedStudentSummary {
  const empty: ParsedStudentSummary = {
    studentName: null,
    gradeLevel: null,
    masteryCount: null,
    activeSkills: null,
  }
  if (!summary || typeof summary !== 'object' || Array.isArray(summary)) return empty
  const root = summary as Record<string, unknown>
  const student = root.student
  let studentName: string | null = null
  let gradeLevel: string | null = null
  if (student && typeof student === 'object' && !Array.isArray(student)) {
    const s = student as Record<string, unknown>
    if (typeof s.name === 'string' && s.name.trim()) studentName = s.name.trim()
    if (typeof s.gradeLevel === 'string' && s.gradeLevel.trim()) gradeLevel = s.gradeLevel.trim()
  }
  const masteryCount = typeof root.masteryCount === 'number' ? root.masteryCount : null
  const activeSkills = typeof root.activeSkills === 'number' ? root.activeSkills : null
  return { studentName, gradeLevel, masteryCount, activeSkills }
}

function summaryLines(summary: unknown): { label: string; value: string }[] {
  if (summary == null) return []
  const parsed = parseStudentSummary(summary)
  const lines: { label: string; value: string }[] = []
  if (parsed.studentName) lines.push({ label: 'Student', value: parsed.studentName })
  if (parsed.gradeLevel) lines.push({ label: 'Grade level', value: parsed.gradeLevel })
  if (summary && typeof summary === 'object' && !Array.isArray(summary)) {
    const progress = (summary as Record<string, unknown>).progress
    if (progress && typeof progress === 'object' && !Array.isArray(progress)) {
      const p = progress as Record<string, unknown>
      if (typeof p.completedModules === 'number' && typeof p.totalModules === 'number') {
        lines.push({ label: 'Modules completed', value: `${p.completedModules} / ${p.totalModules}` })
      }
    }
  }
  if (parsed.masteryCount != null) lines.push({ label: 'Skills tracked', value: String(parsed.masteryCount) })
  if (parsed.activeSkills != null) lines.push({ label: 'Active skills', value: String(parsed.activeSkills) })
  return lines
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
  const parsed = parseStudentSummary(summaryQuery.data ?? null)
  const pageTitle = parsed.studentName ?? 'A calm snapshot for one student'

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Learner lens</p>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
            {pageTitle}
          </h1>
          <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
            {parsed.studentName
              ? 'Lead with what they are doing well — this page is here to help you notice, not to label.'
              : 'Lead with what they are doing well — this page is here to help you notice, not to label.'}
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
        <>
          {(parsed.gradeLevel != null || parsed.masteryCount != null || parsed.activeSkills != null) && (
            <div className="grid gap-4 sm:grid-cols-3">
              {parsed.gradeLevel != null && (
                <Card>
                  <div className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Grade</div>
                  <div className="mt-1 text-2xl font-bold text-[hsl(var(--color-primary))]">
                    {parsed.gradeLevel}
                  </div>
                </Card>
              )}
              {parsed.masteryCount != null && (
                <Card>
                  <div className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Skills tracked</div>
                  <div className="mt-1 text-2xl font-bold text-[hsl(var(--color-primary))]">
                    {parsed.masteryCount}
                  </div>
                </Card>
              )}
              {parsed.activeSkills != null && (
                <Card>
                  <div className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Active skills</div>
                  <div className="mt-1 text-2xl font-bold text-[hsl(var(--color-primary))]">
                    {parsed.activeSkills}
                  </div>
                </Card>
              )}
            </div>
          )}
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
        </>
      )}
    </div>
  )
}
