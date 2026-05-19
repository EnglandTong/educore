import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Heart,
  Quote,
  Send,
  Server,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { createDonation, fetchDonationImpact, fetchDonations, type DonationImpact, type DonationResult } from '@/api/donation'

const PRESET_AMOUNTS = [5, 10, 25, 50]

const FUNDS_ITEMS = [
  { key: 'fundsCurriculum', icon: BookOpen, pct: 40, color: 'hsl(var(--color-primary))' },
  { key: 'fundsInfrastructure', icon: Server, pct: 25, color: 'hsl(180, 60%, 50%)' },
  { key: 'fundsScholarship', icon: GraduationCap, pct: 20, color: 'hsl(30, 80%, 55%)' },
  { key: 'fundsTraining', icon: Users, pct: 15, color: 'hsl(280, 50%, 60%)' },
] as const

const STORIES = [
  { nameKey: 'storiesTeacher', quoteKey: 'storiesTeacherQuote', roleKey: 'storiesTeacherRole' },
  { nameKey: 'storiesStudent', quoteKey: 'storiesStudentQuote', roleKey: 'storiesStudentRole' },
  { nameKey: 'storiesPrincipal', quoteKey: 'storiesPrincipalQuote', roleKey: 'storiesPrincipalRole' },
] as const

function ImpactMetric({ label, value, icon: Icon, prefix }: { label: string; value: number | string; icon: React.FC<{ className?: string }>; prefix?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6 transition-shadow hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--color-primary)/0.1)]">
        <Icon className="h-5 w-5 text-[hsl(var(--color-primary))]" />
      </div>
      <span className="font-display text-3xl font-bold text-[hsl(var(--color-text))]">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <span className="text-sm text-[hsl(var(--color-text-secondary))]">{label}</span>
    </div>
  )
}

export function DonationPage() {
  const { t } = useTranslation()
  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState<number>(10)
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [impact, setImpact] = useState<DonationImpact | null>(null)
  const [recentDonations, setRecentDonations] = useState<DonationResult[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [impactData, donations] = await Promise.all([
          fetchDonationImpact(),
          fetchDonations(),
        ])
        setImpact(impactData)
        setRecentDonations(donations.slice(0, 8))
      } catch {
        // silent fail — page is still usable
      }
    }
    loadData()
  }, [])

  async function handleDonate() {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount
    if (!donorName.trim() || !email.trim() || !finalAmount || finalAmount <= 0) return

    setSaving(true)
    try {
      const result = await createDonation({
        donorName: donorName.trim(),
        email: email.trim(),
        amount: finalAmount,
        message: message.trim() || undefined,
        isPublic,
      })
      if (result) {
        // Refresh impact metrics after donation
        fetchDonationImpact().then(setImpact).catch(() => {})
        fetchDonations().then((d) => setRecentDonations(d.slice(0, 8))).catch(() => {})
        setSuccess(true)
      }
    } catch {
      // handled
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md pt-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--color-primary)/0.1)]">
          <Heart className="h-8 w-8 fill-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">{t('donation.thankYou')}</h1>
        <p className="mt-2 text-[hsl(var(--color-text-secondary))]">{t('donation.thankYouDesc')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--color-bg))]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(var(--color-primary)/0.08)] via-[hsl(var(--color-primary)/0.03)] to-transparent pb-16 pt-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--color-primary)/0.12)]">
            <Heart className="h-7 w-7 text-[hsl(var(--color-primary))]" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-text))] sm:text-5xl">
            {t('donation.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
            {t('donation.subtitle')}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
            {t('donation.projectDesc')}
          </p>
        </div>
      </section>

      {/* Impact Metrics */}
      {impact && (
        <section className="mx-auto max-w-4xl px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ImpactMetric
              label={t('donation.studentsHelped')}
              value={impact.studentsHelped}
              icon={Users}
            />
            <ImpactMetric
              label={t('donation.schoolsSupported')}
              value={impact.schoolsSupported}
              icon={Target}
            />
            <ImpactMetric
              label={t('donation.totalRaised')}
              value={impact.totalRaised}
              icon={TrendingUp}
              prefix="$"
            />
            <ImpactMetric
              label={t('donation.totalDonors')}
              value={impact.totalDonors}
              icon={Heart}
            />
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left Column: Stories + Transparency */}
          <div className="space-y-12 lg:col-span-3">
            {/* Beneficiary Stories */}
            <section>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">
                {t('donation.storiesTitle')}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {STORIES.map((story) => (
                  <div
                    key={story.nameKey}
                    className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-5"
                  >
                    <Quote className="mb-3 h-5 w-5 text-[hsl(var(--color-primary)/0.4)]" />
                    <p className="text-sm italic leading-relaxed text-[hsl(var(--color-text-secondary))]">
                      "{t(story.quoteKey)}"
                    </p>
                    <div className="mt-4 border-t border-[hsl(var(--color-border))] pt-3">
                      <p className="text-sm font-medium text-[hsl(var(--color-text))]">
                        {t(story.nameKey)}
                      </p>
                      <p className="text-xs text-[hsl(var(--color-text-tertiary))]">
                        {t(story.roleKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Transparency */}
            <section>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">
                {t('donation.transparencyTitle')}
              </h2>
              <p className="mt-2 text-sm text-[hsl(var(--color-text-secondary))]">
                {t('donation.transparencyDesc')}
              </p>
              <div className="mt-6 space-y-4">
                {FUNDS_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <item.icon className="h-4 w-4" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[hsl(var(--color-text))]">
                            {t(`donation.${item.key}`)}
                          </span>
                          <span className="text-sm font-semibold text-[hsl(var(--color-text))]">
                            {item.pct}%
                          </span>
                        </div>
                        <p className="text-xs text-[hsl(var(--color-text-tertiary))]">
                          {t(`donation.${item.key}Desc`)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--color-border))]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Donations */}
            {recentDonations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">
                  {t('donation.recentDonors')}
                </h2>
                <div className="mt-4 space-y-2">
                  {recentDonations.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--color-primary)/0.08)]">
                          <Heart className="h-3.5 w-3.5 text-[hsl(var(--color-primary))]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[hsl(var(--color-text))]">
                            {d.donorName}
                          </p>
                          {d.message && (
                            <p className="text-xs text-[hsl(var(--color-text-tertiary))]">
                              "{d.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[hsl(var(--color-primary))]">
                        ${d.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Donation Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-[hsl(var(--color-text))]">
                  {t('donation.orDonateDirectly')}
                </h3>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[hsl(var(--color-text-secondary))]">{t('donation.nameLabel')}</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={t('donation.namePlaceholder')}
                      className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] px-4 py-2 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-[hsl(var(--color-text-secondary))]">{t('donation.emailLabel')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('donation.emailPlaceholder')}
                      className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] px-4 py-2 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[hsl(var(--color-text-secondary))]">{t('donation.amountLabel')}</label>
                    <div className="mb-2 flex gap-2">
                      {PRESET_AMOUNTS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => { setAmount(preset); setCustomAmount('') }}
                          className={`flex-1 rounded-[var(--radius-lg)] border-2 py-2 text-sm font-medium transition-all ${
                            amount === preset && !customAmount
                              ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.08)] text-[hsl(var(--color-primary))]'
                              : 'border-[hsl(var(--color-border))] text-[hsl(var(--color-text-secondary))] hover:border-[hsl(var(--color-primary)/0.3)]'
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setAmount(0) }}
                      placeholder={t('donation.customAmountPlaceholder')}
                      min={0.01}
                      step={0.01}
                      className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] px-4 py-2 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-[hsl(var(--color-text-secondary))]">{t('donation.messageLabel')}</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('donation.messagePlaceholder')}
                      rows={2}
                      maxLength={500}
                      className="w-full resize-none rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] px-4 py-2 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-[hsl(var(--color-text-secondary))]">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded border-[hsl(var(--color-border))]"
                    />
                    {t('donation.displayName')}
                  </label>

                  <button
                    type="button"
                    onClick={handleDonate}
                    disabled={saving || !donorName.trim() || !email.trim() || (!amount && !customAmount)}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary))] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {saving ? t('donation.processing') : (
                      <>
                        {t('donation.donate')} ${customAmount || amount}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
