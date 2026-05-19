import { Building2, GraduationCap, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchSchool, fetchSchoolOverview, type School, type SchoolOverview } from '@/api/school'
import { routes } from '@/router/routes'

export function SchoolManagementPage() {
  const navigate = useNavigate()
  const [school, setSchool] = useState<School | null>(null)
  const [overview, setOverview] = useState<SchoolOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchSchool().catch(() => null),
      fetchSchoolOverview().catch(() => null)
    ]).then(([s, o]) => {
      if (s) setSchool(s)
      if (o) setOverview(o)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--color-primary))] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[hsl(var(--color-text))]">School Management</h1>
        <p className="mt-1 text-[hsl(var(--color-text-secondary))]">Manage your school's students, teachers, and settings</p>
      </div>

      {school && (
        <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary)/0.1)]">
              <Building2 className="h-6 w-6 text-[hsl(var(--color-primary))]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[hsl(var(--color-text))]">{school.name}</h2>
              {school.code && <p className="text-xs text-[hsl(var(--color-text-tertiary))]">Code: {school.code}</p>}
            </div>
          </div>
          {school.address && <p className="mt-3 text-sm text-[hsl(var(--color-text-secondary))]">{school.address}</p>}
        </div>
      )}

      {/* Overview cards */}
      {overview && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
            <GraduationCap className="mb-3 h-8 w-8 text-[hsl(var(--color-primary))]" />
            <p className="text-2xl font-bold text-[hsl(var(--color-text))]">{overview.studentCount}</p>
            <p className="text-xs text-[hsl(var(--color-text-tertiary))]">Students</p>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
            <Users className="mb-3 h-8 w-8 text-[hsl(var(--color-primary))]" />
            <p className="text-2xl font-bold text-[hsl(var(--color-text))]">{overview.teacherCount}</p>
            <p className="text-xs text-[hsl(var(--color-text-tertiary))]">Teachers</p>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
            <Users className="mb-3 h-8 w-8 text-[hsl(var(--color-primary))]" />
            <p className="text-2xl font-bold text-[hsl(var(--color-text))]">{overview.totalUsers}</p>
            <p className="text-xs text-[hsl(var(--color-text-tertiary))]">Total Users</p>
          </div>
        </div>
      )}

      {/* Management cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate(routes.schoolStudents)}
          className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6 text-left transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
        >
          <GraduationCap className="mb-4 h-8 w-8 text-[hsl(var(--color-primary))]" />
          <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">Students</h3>
          <p className="mt-1 text-sm text-[hsl(var(--color-text-secondary))]">View and manage student accounts</p>
        </button>
        <button
          type="button"
          onClick={() => navigate(routes.schoolTeachers)}
          className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6 text-left transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
        >
          <Users className="mb-4 h-8 w-8 text-[hsl(var(--color-primary))]" />
          <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">Teachers</h3>
          <p className="mt-1 text-sm text-[hsl(var(--color-text-secondary))]">View and manage teacher accounts</p>
        </button>
      </div>
    </div>
  )
}
