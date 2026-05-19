import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchVolunteerProfile, fetchVolunteerStats, type VolunteerProfile, type VolunteerStats } from '@/api/volunteer'
import { routes } from '@/router/routes'

export function VolunteerProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<VolunteerProfile | null>(null)
  const [stats, setStats] = useState<VolunteerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchVolunteerProfile().catch(() => null),
      fetchVolunteerStats().catch(() => null)
    ]).then(([p, s]) => {
      if (p) setProfile(p)
      if (s) setStats(s)
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
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(routes.volunteerDashboard)}
          className="rounded-[var(--radius-lg)] p-2 text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/0.3)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">My Volunteer Profile</h1>
        </div>
      </div>

      {!profile ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border))] p-12 text-center">
          <p className="text-sm text-[hsl(var(--color-text-tertiary))]">
            You haven't registered as a volunteer yet.
          </p>
        </div>
      ) : (
        <>
          {/* Status badge */}
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              profile.status === 'active'
                ? 'bg-green-100 text-green-700'
                : profile.status === 'pending'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
            </span>
          </div>

          {/* Expertise */}
          <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
            <h2 className="mb-3 text-sm font-semibold text-[hsl(var(--color-text-secondary))]">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {profile.expertise.map((exp) => (
                <span
                  key={exp}
                  className="rounded-full bg-[hsl(var(--color-primary)/0.08)] px-3 py-1 text-xs font-medium text-[hsl(var(--color-primary))]"
                >
                  {exp}
                </span>
              ))}
            </div>
            {profile.bio && (
              <>
                <h2 className="mb-2 mt-6 text-sm font-semibold text-[hsl(var(--color-text-secondary))]">Bio</h2>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">{profile.bio}</p>
              </>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4 text-center">
                <p className="text-2xl font-bold text-[hsl(var(--color-text))]">{stats.totalAnswered}</p>
                <p className="text-xs text-[hsl(var(--color-text-tertiary))]">Answered</p>
              </div>
              <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4 text-center">
                <p className="text-2xl font-bold text-[hsl(var(--color-text))]">{stats.totalRatings}</p>
                <p className="text-xs text-[hsl(var(--color-text-tertiary))]">Ratings</p>
              </div>
              <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4 text-center">
                <p className="text-2xl font-bold text-[hsl(var(--color-text))]">{stats.avgRating}</p>
                <p className="text-xs text-[hsl(var(--color-text-tertiary))]">Avg Rating</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
