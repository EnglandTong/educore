import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { fetchAvailableModules } from '@/api/modules'
import { fetchProgressOverview } from '@/api/progress'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { ModulePicker } from '@/components/learning/ModulePicker'
import { routes } from '@/router/routes'
import { useAuthStore } from '@/stores/authStore'
import { useSessionStore } from '@/stores/sessionStore'
import type { MasteryLevel } from '@/types'
import { formatDisplayName } from '@/utils/formatters'
import { cn } from '@/utils/cn'

function greetingKey(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'student.greetingMorning'
  if (hour < 18) return 'student.greetingAfternoon'
  return 'student.greetingEvening'
}

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

export function StudentDashboardPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const activeModuleId = useSessionStore((s) => s.activeModuleId)
  const setActiveModuleId = useSessionStore((s) => s.setActiveModuleId)

  const { data: overview, isLoading, isError, refetch } = useQuery({
    queryKey: ['progress-overview'],
    queryFn: fetchProgressOverview,
  })

  // Fetch available modules for the picker
  const { data: modules = [] } = useQuery({
    queryKey: ['available-modules'],
    queryFn: fetchAvailableModules,
    staleTime: 5 * 60 * 1000,
  })

  // Default to first module if none selected yet
  useEffect(() => {
    if (modules.length > 0 && !activeModuleId) {
      setActiveModuleId(modules[0]!.id)
    }
  }, [modules, activeModuleId, setActiveModuleId])

  const module = overview?.modules[0]

  if (isError) {
    return (
      <WarmQueryError
        title={t('warm.errorTitle')}
        description={t('warm.errorDesc')}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[hsl(var(--color-primary))]">{t('student.home')}</p>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
          {t(greetingKey())}, {formatDisplayName(user?.name ?? t('common.friend'))}! {t('student.greetingReady')}
        </h1>
        <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
          {t('student.subtitle')}
        </p>
      </div>

      {/* Module picker — only visible when multiple subjects available */}
      <ModulePicker
        modules={modules.map((m) => ({ id: m.id, name: m.name, icon: m.icon, color: m.color }))}
        activeId={activeModuleId ?? modules[0]?.id ?? ''}
        onChange={(id) => setActiveModuleId(id)}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="interactive" className="space-y-4">
          <h2 className="font-display text-xl font-semibold">{t('student.continueLearning')}</h2>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            {t('student.continueSubtitle')}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={routes.studentTraining}
              className={cn(
                'block w-full min-h-[44px] rounded-[var(--radius-xl)] bg-[hsl(var(--color-primary))] px-4 py-4 text-left text-sm font-semibold text-[hsl(var(--color-surface))] shadow-[var(--shadow-md)] transition-[background-color,box-shadow] duration-[var(--transition-base)] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[hsl(var(--color-primary-dark))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.35)]',
              )}
            >
              {t('student.practiceLab')}
            </Link>
            <Link
              to={routes.studentDiagnostic}
              className="block w-full rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3 text-center text-sm font-semibold text-[hsl(var(--color-primary))] shadow-[var(--shadow-sm)] transition hover:bg-[hsl(var(--color-primary)/0.06)]"
            >
              {t('student.discoverySession')}
            </Link>
            <Link
              to={routes.studentWrongAnswers}
              className="block w-full rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3 text-center text-sm font-semibold text-[hsl(var(--color-primary))] shadow-[var(--shadow-sm)] transition hover:bg-[hsl(var(--color-primary)/0.06)]"
            >
              {t('student.reviewNotes')}
            </Link>
            <Link
              to={routes.studentProgress}
              className="block w-full text-center text-sm font-semibold text-[hsl(var(--color-text-secondary))] underline-offset-4 hover:text-[hsl(var(--color-primary))] hover:underline"
            >
              {t('student.fullProgress')}
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-xl font-semibold">{t('student.yourProgress')}</h2>
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                {t('student.nurturedSkills', {
                  count: module?.masteredCount ?? 0,
                  module: module?.moduleName ?? t('common.loading'),
                })}
              </p>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-32 w-32 rounded-full" />
          ) : (
            <ProgressRing value={module?.overallScore ?? 0} label={t('student.overallGrowth')} />
          )}
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-semibold">{t('student.snapshot')}</h2>
          {module && <Badge level={parseMasteryLevel(module.overallLevel)} />}
        </div>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4">
              <p className="text-xs uppercase tracking-wide text-[hsl(var(--color-text-muted))]">{t('student.currentStreak')}</p>
              <p className="mt-2 text-2xl font-semibold text-[hsl(var(--color-text))]">
                {overview?.currentStreak ?? 0} {t('student.days', { count: overview?.currentStreak ?? 0 })}
              </p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">{t('student.streakRhythm')}</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4">
              <p className="text-xs uppercase tracking-wide text-[hsl(var(--color-text-muted))]">{t('student.totalXp')}</p>
              <p className="mt-2 text-2xl font-semibold text-[hsl(var(--color-text))]">{overview?.totalXP ?? 0}</p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">{t('student.xpCounts')}</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4">
              <p className="text-xs uppercase tracking-wide text-[hsl(var(--color-text-muted))]">{t('student.longestStreak')}</p>
              <p className="mt-2 text-2xl font-semibold text-[hsl(var(--color-text))]">
                {overview?.longestStreak ?? 0} {t('student.days', { count: overview?.longestStreak ?? 0 })}
              </p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">{t('student.dedicationProof')}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
