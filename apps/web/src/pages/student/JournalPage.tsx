import { ArrowLeft, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { fetchJournals, createJournal, type JournalEntry } from '@/api/heart'

function getMoodOptions(t: (k: string) => string) {
  return [
    { value: 'happy', emoji: '😊', label: t('journal.happy') },
    { value: 'calm', emoji: '😌', label: t('journal.calm') },
    { value: 'sad', emoji: '😢', label: t('journal.sad') },
    { value: 'anxious', emoji: '😰', label: t('journal.anxious') },
    { value: 'angry', emoji: '😤', label: t('journal.angry') },
    { value: 'tired', emoji: '😴', label: t('journal.tired') }
  ]
}

export function JournalPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [mood, setMood] = useState<string>('calm')
  const [content, setContent] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [saving, setSaving] = useState(false)
  const moodOptions = getMoodOptions(t)

  useEffect(() => {
    fetchJournals()
      .then(setJournals)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!content.trim()) return
    setSaving(true)
    try {
      const entry = await createJournal({
        mood: mood as JournalEntry['mood'],
        content,
        isPrivate
      })
      setJournals((prev) => [entry, ...prev])
      setContent('')
      setMood('calm')
    } catch {
      // Error handled by API client
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/student/dashboard')}
          className="rounded-[var(--radius-lg)] p-2 text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/0.3)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">{t('journal.title')}</h1>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">{t('journal.subtitle')}</p>
        </div>
      </div>

      {/* New entry form */}
      <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
        <h2 className="mb-4 text-sm font-semibold text-[hsl(var(--color-text-secondary))]">{t('journal.feelingTitle')}</h2>
        <div className="mb-4 flex gap-2">
          {moodOptions.map(({ value, emoji, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMood(value)}
              className={`flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border-2 px-4 py-2 transition-all ${
                mood === value
                  ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.08)]'
                  : 'border-transparent hover:bg-[hsl(var(--color-border)/0.3)]'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs text-[hsl(var(--color-text-secondary))]">{label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('journal.placeholder')}
          rows={4}
          maxLength={2000}
          className="w-full resize-none rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] p-4 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
        />

        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[hsl(var(--color-text-secondary))]">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded border-[hsl(var(--color-border))]"
            />
            {t('journal.keepPrivate')}
          </label>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary))] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? t('journal.saving') : t('journal.save')}
          </button>
        </div>
      </div>

      {/* Journal entries */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--color-primary))] border-t-transparent" />
        </div>
      ) : journals.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border))] p-12 text-center">
          <p className="text-sm text-[hsl(var(--color-text-tertiary))]">{t('journal.empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {journals.map((entry) => {
            const moodOpt = moodOptions.find((m) => m.value === entry.mood)
            return (
              <div
                key={entry.id}
                className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{moodOpt?.emoji}</span>
                  <span className="text-sm font-medium text-[hsl(var(--color-text))]">{moodOpt?.label}</span>
                  <span className="text-xs text-[hsl(var(--color-text-tertiary))]">
                    {new Date(entry.createdAt).toLocaleDateString('en', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {entry.isPrivate && (
                    <span className="rounded-full bg-[hsl(var(--color-border)/0.4)] px-2 py-0.5 text-[10px] text-[hsl(var(--color-text-tertiary))]">
                      Private
                    </span>
                  )}
                </div>
                {entry.content && (
                  <p className="text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">{entry.content}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
