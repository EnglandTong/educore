import { BookHeart, PartyPopper, Smile, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { fetchMoodTrend, type MoodLogEntry } from '@/api/heart'
import { routes } from '@/router/routes'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

function MoodEmoji({ mood }: { mood: string }) {
  return <span className="text-2xl">{mood}</span>
}

export function HeartSpacePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isLowBandwidth } = useNetworkStatus()
  const [moodTrend, setMoodTrend] = useState<MoodLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLowBandwidth) {
      setLoading(false)
      return
    }
    fetchMoodTrend(7)
      .then(setMoodTrend)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isLowBandwidth])

  const cards = [
    {
      title: t('heart.corner'),
      description: t('heart.cornerDesc'),
      icon: Smile,
      path: routes.heartJournal,
      color: 'from-pink-500 to-rose-600'
    },
    {
      title: t('heart.diary'),
      description: t('heart.diaryDesc'),
      icon: BookHeart,
      path: routes.heartJournal,
      color: 'from-violet-500 to-purple-600'
    },
    {
      title: t('heart.proudWall'),
      description: t('heart.proudWallDesc'),
      icon: PartyPopper,
      path: routes.heartProudWall,
      color: 'from-amber-500 to-orange-600'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[hsl(var(--color-text))]">{t('heart.title')}</h1>
        <p className="mt-1 text-[hsl(var(--color-text-secondary))]">{t('heart.description')}</p>
      </div>

      {/* Mood trend mini-bar */}
      {isLowBandwidth && (
        <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3 text-sm text-[hsl(var(--color-text-secondary))]">
          <WifiOff className="h-4 w-4 text-[hsl(var(--color-text-tertiary))]" />
          <span>{t('heart.offlineHint')}</span>
        </div>
      )}
      {!loading && moodTrend.length > 0 && (
        <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
          <h2 className="mb-4 text-sm font-semibold text-[hsl(var(--color-text-secondary))]">{t('heart.weekMood')}</h2>
          <div className="flex gap-3">
            {moodTrend.slice(0, 7).map((log) => (
              <div key={log.id} className="flex flex-col items-center gap-1">
                <MoodEmoji mood={log.mood} />
                <span className="text-[10px] text-[hsl(var(--color-text-tertiary))]">
                  {new Date(log.date).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => navigate(card.path)}
            className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6 text-left transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.color} opacity-10 transition-opacity group-hover:opacity-20`} />
            <card.icon className="mb-4 h-8 w-8 text-[hsl(var(--color-primary))]" />
            <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">{card.title}</h3>
            <p className="mt-1 text-sm text-[hsl(var(--color-text-secondary))]">{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
