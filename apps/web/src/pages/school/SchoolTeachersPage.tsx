import { ArrowLeft, Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchTeachers, type SchoolUser } from '@/api/school'
import { routes } from '@/router/routes'

export function SchoolTeachersPage() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState<SchoolUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchTeachers()
      .then(setTeachers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? teachers.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
      )
    : teachers

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(routes.schoolManage)}
          className="rounded-[var(--radius-lg)] p-2 text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/0.3)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">Teachers</h1>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">{teachers.length} teachers on staff</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--color-text-tertiary))]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teachers..."
          className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] py-2 pl-10 pr-4 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--color-primary))] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border))] p-12 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-[hsl(var(--color-text-tertiary))]" />
          <p className="text-sm text-[hsl(var(--color-text-tertiary))]">
            {search ? 'No teachers match your search.' : 'No teachers assigned yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[hsl(var(--color-text-secondary))]">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[hsl(var(--color-text-secondary))]">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[hsl(var(--color-text-secondary))]">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((teacher) => (
                <tr key={teacher._id} className="border-b border-[hsl(var(--color-border))] last:border-0 hover:bg-[hsl(var(--color-border)/0.15)]">
                  <td className="px-4 py-3 text-sm font-medium text-[hsl(var(--color-text))]">{teacher.name}</td>
                  <td className="px-4 py-3 text-sm text-[hsl(var(--color-text-secondary))]">{teacher.email}</td>
                  <td className="px-4 py-3 text-sm text-[hsl(var(--color-text-tertiary))]">
                    {new Date(teacher.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
