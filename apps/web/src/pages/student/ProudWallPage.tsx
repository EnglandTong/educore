import { Heart, PartyPopper, Star, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fetchProudMoments, createProudMoment, addReaction, type ProudMoment } from '@/api/heart'
import { useAuthStore } from '@/stores/authStore'

function getReactionIcons(t: (k: string) => string): Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> {
  return {
    heart: { icon: Heart, label: t('proudWall.reactionHeart') },
    star: { icon: Star, label: t('proudWall.reactionStar') },
    thumbsup: { icon: ThumbsUp, label: t('proudWall.reactionThumbsUp') },
    hug: { icon: PartyPopper, label: t('proudWall.reactionHug') }
  }
}

export function ProudWallPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const [moments, setMoments] = useState<ProudMoment[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const reactionIcons = getReactionIcons(t)

  useEffect(() => {
    fetchProudMoments()
      .then(setMoments)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    if (!title.trim()) return
    setSaving(true)
    try {
      const moment = await createProudMoment({ title, description })
      setMoments((prev) => [moment, ...prev])
      setTitle('')
      setDescription('')
    } catch {
      // Error handled by API client
    } finally {
      setSaving(false)
    }
  }

  async function handleReaction(momentId: string, type: string) {
    try {
      const updated = await addReaction(momentId, type)
      setMoments((prev) => prev.map((m) => (m.id === momentId ? updated : m)))
    } catch {
      // Error handled by API client
    }
  }

  function getReactionCount(moment: ProudMoment, type: string): number {
    return moment.reactions.filter((r) => r.type === type).length
  }

  function hasUserReacted(moment: ProudMoment, type: string): boolean {
    return moment.reactions.some((r) => r.userId === user?.id && r.type === type)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[hsl(var(--color-text))]">{t('proudWall.title')}</h1>
        <p className="mt-1 text-[hsl(var(--color-text-secondary))]">{t('proudWall.subtitle')}</p>
      </div>

      {/* Create new proud moment */}
      <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
        <h2 className="mb-4 text-sm font-semibold text-[hsl(var(--color-text-secondary))]}">{t('proudWall.shareTitle')}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('proudWall.titlePlaceholder')}
          maxLength={100}
          className="mb-3 w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] px-4 py-2 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('proudWall.descPlaceholder')}
          rows={2}
          maxLength={500}
          className="mb-4 w-full resize-none rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving || !title.trim()}
          className="rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary))] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? t('proudWall.sharing') : t('proudWall.share')}
        </button>
      </div>

      {/* Moments feed */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--color-primary))] border-t-transparent" />
        </div>
      ) : moments.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border))] p-12 text-center">
          <p className="text-sm text-[hsl(var(--color-text-tertiary))]">{t('proudWall.empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6"
            >
              <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">{moment.title}</h3>
              {moment.description && (
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">{moment.description}</p>
              )}
              <p className="mt-2 text-xs text-[hsl(var(--color-text-tertiary))]">
                {new Date(moment.createdAt).toLocaleDateString('en', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              {/* Reactions */}
              <div className="mt-4 flex gap-2">
                {Object.entries(reactionIcons).map(([type, { icon: Icon, label }]) => {
                  const count = getReactionCount(moment, type)
                  const reacted = hasUserReacted(moment, type)
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleReaction(moment.id, type)}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-all ${
                        reacted
                          ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.08)] text-[hsl(var(--color-primary))]'
                          : 'border-[hsl(var(--color-border))] text-[hsl(var(--color-text-tertiary))] hover:border-[hsl(var(--color-primary)/0.3)]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{label}</span>
                      {count > 0 && <span className="font-medium">{count}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
