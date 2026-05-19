import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import { DEFAULT_MODULE_ID, fetchModuleSkills, fetchModuleTimeline, fetchProgressOverview } from '@/api/progress'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Skeleton } from '@/components/ui/Skeleton'
import { routes } from '@/router/routes'
import type { MasteryLevel, SkillMastery } from '@/types'
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

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export function StudentProgressPage() {
  const moduleId = DEFAULT_MODULE_ID

  const [overviewQ, skillsQ, timelineQ] = useQueries({
    queries: [
      { queryKey: ['progress-overview'], queryFn: fetchProgressOverview },
      {
        queryKey: ['progress-skills', moduleId],
        queryFn: () => fetchModuleSkills(moduleId),
        enabled: true,
      },
      {
        queryKey: ['progress-timeline', moduleId],
        queryFn: () => fetchModuleTimeline(moduleId),
        enabled: true,
      },
    ],
  })

  const overview = overviewQ.data
  const module = overview?.modules[0]
  const skills: SkillMastery[] = skillsQ.data ?? []
  const timeline = timelineQ.data ?? []

  const radarData = skills.slice(0, 10).map((s) => ({
    skill: s.skillName.length > 18 ? `${s.skillName.slice(0, 16)}…` : s.skillName,
    score: Math.min(100, Math.max(0, s.score)),
  }))

  const lineData = timeline.map((p) => ({
    name: formatShortDate(p.at),
    score: Math.min(100, Math.max(0, p.score)),
  }))

  const loading = overviewQ.isLoading

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--color-primary))]">Progress home</p>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))]">Your growth garden</h1>
          <p className="mt-2 max-w-2xl text-[hsl(var(--color-text-secondary))]">
            Numbers here are little love notes about effort — never a cold judgment. Celebrate what is blooming first.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={routes.studentDiagnostic}
            className={cn(
              'inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-text))] shadow-[var(--shadow-sm)] transition hover:bg-[hsl(var(--color-border)/0.25)]',
            )}
          >
            Discovery session
          </Link>
          <Link
            to={routes.studentTraining}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-surface))] shadow-[var(--shadow-md)] transition-[background-color] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-primary-dark))]"
          >
            Practice lab
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Skill warmth map</h2>
            {module ? <Badge level={parseMasteryLevel(module.overallLevel)} /> : null}
          </div>
          {skillsQ.isLoading ? (
            <Skeleton className="h-80 w-full rounded-[var(--radius-xl)]" />
          ) : radarData.length === 0 ? (
            <EmptyState
              title="Your radar is ready for petals"
              description="As soon as skills sync from the server, you will see a colorful bloom here — for now, enjoy knowing the soil is prepared."
            />
          ) : (
            <div className="h-80 w-full min-h-[16rem]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius={110} data={radarData}>
                  <PolarGrid stroke="hsl(var(--color-border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--color-text-secondary))', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--color-text-muted))', fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--color-primary))"
                    fill="hsl(var(--color-primary))"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-lg font-semibold">Overall snapshot</h2>
          {loading ? (
            <Skeleton className="h-36 w-36 rounded-full" />
          ) : (
            <ProgressRing value={module?.overallScore ?? 0} label="How nourished your skills feel lately" />
          )}
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            {module
              ? `${module.masteredCount} mastered skills in ${module.moduleName} — every one earned with care.`
              : 'When modules appear, we will paint this space with your wins.'}
          </p>
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Gentle timeline</h2>
        {timelineQ.isLoading ? (
          <Skeleton className="h-56 w-full rounded-[var(--radius-xl)]" />
        ) : lineData.length === 0 ? (
          <EmptyState
            title="Your line chart is waiting for footsteps"
            description="Once practice history streams in, you will see your upward curves — patience is part of the story too."
          />
        ) : (
          <div className="h-64 w-full min-h-[14rem]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--color-text-muted))', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--color-text-muted))', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: 'hsl(var(--color-border))',
                    background: 'hsl(var(--color-surface))',
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--color-primary))" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[hsl(var(--color-text-muted))]">Current streak</p>
          <p className="text-2xl font-semibold text-[hsl(var(--color-text))]">{overview?.currentStreak ?? 0} days</p>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">Consistency, not perfection, is the magic.</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[hsl(var(--color-text-muted))]">Total XP</p>
          <p className="text-2xl font-semibold text-[hsl(var(--color-text))]">{overview?.totalXP ?? 0}</p>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">Every kind try adds a sparkle.</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[hsl(var(--color-text-muted))]">Longest streak</p>
          <p className="text-2xl font-semibold text-[hsl(var(--color-text))]">{overview?.longestStreak ?? 0} days</p>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">Proof you can show up for yourself.</p>
        </Card>
      </div>
    </div>
  )
}
