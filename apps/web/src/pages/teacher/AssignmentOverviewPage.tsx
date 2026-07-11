import { useTeacherClassOverview } from '@/hooks/useTeacherClassOverview'
import { useTeacherAssignments } from '@/hooks/useTeacherAssignments'
import { Link } from 'react-router-dom'
import { teacherStudentPath } from '@/router/routes'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { TeacherStatCard } from '@/components/teacher/TeacherStatCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'

export default function AssignmentOverviewPage() {
  const { data: overview, isPending, error, refetch } = useTeacherClassOverview()
  const {
    data: assignments = [],
    isPending: assignmentsPending,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useTeacherAssignments()

  if (isPending) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <WarmQueryError
          title="Overview could not load"
          description="Something went wrong while fetching assignment data."
          onRetry={() => void refetch()}
        />
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="p-6">
        <EmptyState
          title="No assignments found"
          description="You don't have any student assignments yet."
        />
      </div>
    )
  }

  const gradeEntries = Object.entries(overview.gradeGroups).sort(
    ([a], [b]) => parseInt(a) - parseInt(b)
  )

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-[hsl(var(--color-text-heading))]">
        Assignment Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TeacherStatCard label="Assigned Students" value={overview.studentCount} />
        <TeacherStatCard label="Average Score" value={overview.averageScore} />
        <TeacherStatCard label="Grade Levels" value={gradeEntries.length} />
        <TeacherStatCard label="Weak Areas" value={overview.topWeakAreas.length} />
      </div>

      {/* Grade Distribution */}
      {gradeEntries.length > 0 && (
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-[hsl(var(--color-text-heading))]">
            Grade Distribution
          </h2>
          <div className="space-y-3">
            {gradeEntries.map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-[hsl(var(--color-text-muted))]">
                  Grade {grade}
                </div>
                <div className="flex-1">
                  <div className="h-4 rounded-full bg-[hsl(var(--color-surface-raised))]">
                    <div
                      className="h-4 rounded-full bg-[hsl(var(--color-primary))] transition-all"
                      style={{
                        width: `${(count / overview.studentCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Weak Areas */}
      {overview.topWeakAreas.length > 0 && (
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-[hsl(var(--color-text-heading))]">
            Top Weak Areas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--color-border))]">
                  <th className="pb-3 font-medium text-[hsl(var(--color-text-muted))]">
                    Skill
                  </th>
                  <th className="pb-3 font-medium text-[hsl(var(--color-text-muted))]">
                    Average Score
                  </th>
                  <th className="pb-3 font-medium text-[hsl(var(--color-text-muted))]">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {overview.topWeakAreas.map((area) => (
                  <tr
                    key={area.skillId}
                    className="border-b border-[hsl(var(--color-border-subtle))] last:border-0"
                  >
                    <td className="py-3 font-medium">{area.skillName}</td>
                    <td className="py-3">{area.averageScore}</td>
                    <td className="py-3">
                      <Badge level={area.level} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Assigned Students List */}
      {assignmentsError ? (
        <Card>
          <WarmQueryError
            title="Assigned students could not load"
            description="Something went wrong while fetching the student list."
            onRetry={() => void refetchAssignments()}
          />
        </Card>
      ) : assignmentsPending ? (
        <Card>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-4 h-32 w-full" />
        </Card>
      ) : assignments.length > 0 ? (
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-[hsl(var(--color-text-heading))]">
            Assigned Students
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--color-border))]">
                  <th className="pb-3 font-medium text-[hsl(var(--color-text-muted))]">
                    Student
                  </th>
                  <th className="pb-3 font-medium text-[hsl(var(--color-text-muted))]">
                    Grade
                  </th>
                  <th className="pb-3 font-medium text-[hsl(var(--color-text-muted))]">
                    Assigned
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr
                    key={assignment.studentId}
                    className="border-b border-[hsl(var(--color-border-subtle))] last:border-0"
                  >
                    <td className="py-3 font-medium">
                      <Link
                        to={teacherStudentPath(assignment.studentId)}
                        className="text-[hsl(var(--color-primary))] hover:underline"
                      >
                        {assignment.studentName}
                      </Link>
                    </td>
                    <td className="py-3">
                      {assignment.gradeLevel ? `Grade ${assignment.gradeLevel}` : '—'}
                    </td>
                    <td className="py-3 text-[hsl(var(--color-text-muted))]">
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
