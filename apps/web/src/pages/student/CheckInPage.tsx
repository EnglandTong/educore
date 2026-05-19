import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Cloud, CloudLightning, CloudRain, Heart, Loader2, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { fetchCheckIns, fetchTodayCheckIn, saveCheckIn, type TodayStatus } from '@/api/checkins'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { useAuthStore } from '@/stores/authStore'
import { formatDisplayName } from '@/utils/formatters'
import { cn } from '@/utils/cn'

// --- Mood options factory (requires i18n t function) ---

interface MoodOption {
  value: string
  label: string
  emoji: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  color: string
}

function getMoodOptions(t: (k: string) => string): readonly MoodOption[] {
  return [
    { value: 'sunny', label: t('checkin.moodSunny'), emoji: '☀️', icon: Sun, color: 'var(--sunny-gradient)' },
    { value: 'cloudy', label: t('checkin.moodCloudy'), emoji: '⛅', icon: Cloud, color: 'var(--cloudy-gradient)' },
    { value: 'rainy', label: t('checkin.moodRainy'), emoji: '🌧️', icon: CloudRain, color: 'var(--rainy-gradient)' },
    { value: 'stormy', label: t('checkin.moodStormy'), emoji: '⛈️', icon: CloudLightning, color: 'var(--stormy-gradient)' },
  ] as const
}

const MOOD_BG: Record<string, string> = {
  sunny: 'bg-amber-50 border-amber-200',
  cloudy: 'bg-slate-50 border-slate-200',
  rainy: 'bg-blue-50 border-blue-200',
  stormy: 'bg-indigo-50 border-indigo-200',
}

const MOOD_HOVER: Record<string, string> = {
  sunny: 'hover:bg-amber-100 hover:border-amber-300',
  cloudy: 'hover:bg-slate-100 hover:border-slate-300',
  rainy: 'hover:bg-blue-100 hover:border-blue-300',
  stormy: 'hover:bg-indigo-100 hover:border-indigo-300',
}

const MOOD_SELECTED: Record<string, string> = {
  sunny: 'ring-2 ring-amber-400 bg-amber-100 border-amber-400 scale-[1.03]',
  cloudy: 'ring-2 ring-slate-400 bg-slate-100 border-slate-400 scale-[1.03]',
  rainy: 'ring-2 ring-blue-400 bg-blue-100 border-blue-400 scale-[1.03]',
  stormy: 'ring-2 ring-indigo-400 bg-indigo-100 border-indigo-400 scale-[1.03]',
}

// --- Check-in history mini card ---

function MoodBadge({ mood, t }: { mood: string; t: (k: string) => string }) {
  const option = getMoodOptions(t).find((o) => o.value === mood)
  if (!option) return null
  const Icon = option.icon
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--color-surface))] px-2 py-0.5 text-xs font-medium shadow-[var(--shadow-sm)]">
      <Icon className="h-3 w-3" aria-hidden />
      {option.emoji}
    </span>
  )
}

function formatDate(isoDate: string, t: (k: string) => string): string {
  const d = new Date(isoDate + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return t('checkin.today')
  if (diffDays === 1) return t('checkin.yesterday')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// --- Main page ---

export function CheckInPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const moodOptions = getMoodOptions(t)

  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState('')

  // Fetch today's status
  const {
    data: today,
    isLoading: todayLoading,
    isError: todayError,
    refetch: refetchToday,
  } = useQuery<TodayStatus>({
    queryKey: ['checkins-today'],
    queryFn: fetchTodayCheckIn,
  })

  // Fetch history (only when we have today's data)
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['checkins-history'],
    queryFn: fetchCheckIns,
  })

  // Save check-in mutation
  const saveMutation = useMutation({
    mutationFn: ({ mood, emoji, bodyNote }: { mood: string; emoji?: string; bodyNote?: string }) =>
      saveCheckIn(mood, emoji, bodyNote),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['checkins-today'] })
      void queryClient.invalidateQueries({ queryKey: ['checkins-history'] })
      setSelectedMood(null)
      setNote('')
    },
  })

  const isLoading = todayLoading || historyLoading
  const isError = todayError || historyError

  // Already checked in today
  const alreadyCheckedIn = today?.checkedIn && today.checkIn

  if (isError) {
    return (
      <WarmQueryError
        title={t('checkin.loadError')}
        description={t('checkin.loadErrorDesc')}
        onRetry={() => {
          void refetchToday()
          void refetchHistory()
        }}
      />
    )
  }

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood)
  }

  const handleSubmit = () => {
    if (!selectedMood) return
    const option = moodOptions.find((o) => o.value === selectedMood)
    saveMutation.mutate({
      mood: selectedMood,
      emoji: option?.emoji,
      bodyNote: note.trim() || undefined,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[hsl(var(--color-primary))]">{t('checkin.title')}</p>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
          {t('checkin.heading', { name: formatDisplayName(user?.name ?? t('common.friend')) })}
        </h1>
        <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
          {t('checkin.subtitle')}
        </p>
      </div>

      {/* After check-in: confirmation + streak */}
      {alreadyCheckedIn ? (
        <>
          <Card
            variant="interactive"
            className={cn('border-2', MOOD_BG[alreadyCheckedIn.mood] ?? '')}
          >
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--color-surface))] shadow-[var(--shadow-md)]">
                <span className="text-3xl">
                  {moodOptions.find((o) => o.value === alreadyCheckedIn.mood)?.emoji ?? '🌈'}
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-xl font-semibold">
                  {t('checkin.alreadyCheckedIn')}
                </h2>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                  {alreadyCheckedIn.note
                    ? `"${alreadyCheckedIn.note}"`
                    : t('checkin.feelingsSeen')}
                </p>
              </div>
            </div>
          </Card>

          {/* Option to change mood */}
          <Card className="space-y-4">
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              {t('checkin.canUpdate')}
            </p>
            <MoodSelector
              options={moodOptions}
              selected={selectedMood}
              onSelect={handleMoodSelect}
              disabled={saveMutation.isPending}
            />
            {selectedMood && (
              <CheckInForm
                t={t}
                note={note}
                onNoteChange={setNote}
                onSubmit={handleSubmit}
                isPending={saveMutation.isPending}
              />
            )}
          </Card>
        </>
      ) : (
        /* Fresh check-in */
        <Card variant="interactive" className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold">{t('checkin.pickWeather')}</h2>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              {t('checkin.pickSubtitle')}
            </p>
          </div>

          <MoodSelector
            options={moodOptions}
            selected={selectedMood}
            onSelect={handleMoodSelect}
            disabled={saveMutation.isPending}
          />

          {selectedMood && (
            <CheckInForm
              t={t}
              note={note}
              onNoteChange={setNote}
              onSubmit={handleSubmit}
              isPending={saveMutation.isPending}
            />
          )}

          {saveMutation.isError && (
            <p className="text-sm text-red-600">
              {t('checkin.saveError')}
            </p>
          )}
        </Card>
      )}

      {/* Streak + History */}
      <div className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
        {/* Streak card */}
        <Card className="flex flex-col items-center justify-center gap-3 text-center">
          <Heart className="h-8 w-8 text-[hsl(var(--color-primary))]" aria-hidden />
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-40" />
            </>
          ) : (
            <>
              <p className="font-display text-4xl font-bold text-[hsl(var(--color-text))]">
                {history?.streak ?? 0}
              </p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                {history?.streak === 0
                  ? t('checkin.streakStart')
                  : t('checkin.streakTitle', { count: history?.streak ?? 0, unit: t('checkin.day', { count: history?.streak ?? 0 }) })}
              </p>
            </>
          )}
        </Card>

        {/* Recent history */}
        <Card className="space-y-4">
          <h3 className="font-display text-lg font-semibold">{t('checkin.recentDays')}</h3>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !history?.checkIns?.length ? (
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              {t('checkin.historyEmpty')}
            </p>
          ) : (
            <div className="space-y-2">
              {history.checkIns.slice(0, 7).map((ci) => (
                <div
                  key={ci.id}
                  className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {moodOptions.find((o) => o.value === ci.mood)?.emoji ?? '🌈'}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-[hsl(var(--color-text))]">
                        {formatDate(ci.date, t)}
                      </span>
                      {ci.note && (
                        <p className="text-xs text-[hsl(var(--color-text-secondary))] line-clamp-1">
                          {ci.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <MoodBadge mood={ci.mood} t={t} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// --- Mood selector sub-component ---

interface MoodSelectorProps {
  options: readonly MoodOption[]
  selected: string | null
  onSelect: (mood: string) => void
  disabled?: boolean
}

function MoodSelector({ options, selected, onSelect, disabled }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {options.map((option) => {
        const Icon = option.icon
        const isSelected = selected === option.value
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.value)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border-2 p-4 transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.35)]',
              MOOD_BG[option.value],
              MOOD_HOVER[option.value],
              isSelected && MOOD_SELECTED[option.value],
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <Icon className="h-8 w-8" aria-hidden />
            <span className="text-2xl">{option.emoji}</span>
            <span className="text-xs font-medium text-[hsl(var(--color-text))]">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// --- Check-in note form ---

interface CheckInFormProps {
  t: (k: string) => string
  note: string
  onNoteChange: (value: string) => void
  onSubmit: () => void
  isPending: boolean
}

function CheckInForm({ t, note, onNoteChange, onSubmit, isPending }: CheckInFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="checkin-note"
          className="text-sm font-medium text-[hsl(var(--color-text))]"
        >
          {t('checkin.addNote')}
        </label>
        <textarea
          id="checkin-note"
          rows={3}
          maxLength={500}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={t('checkin.notePlaceholder')}
          className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.4)]"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[hsl(var(--color-text-muted))]">
          {note.length}/500
        </span>
        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          disabled={isPending}
          className="min-w-[140px]"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t('checkin.saving')}
            </span>
          ) : (
            t('checkin.shareMood')
          )}
        </Button>
      </div>
    </div>
  )
}
