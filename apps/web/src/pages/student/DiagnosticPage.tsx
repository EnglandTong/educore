import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  getDiagnosticNext,
  getDiagnosticReport,
  isAnswerFeedback,
  isDiagnosticReport,
  postDiagnosticAnswer,
  postDiagnosticStart,
} from '@/api/learning'
import { isLearningSession, isPlaceholderMessage, isSessionQuestionPayload } from '@/api/learningGuards'
import type { AnswerFeedbackData } from '@/api/learning'
import { AnswerFeedback } from '@/components/learning/AnswerFeedback'
import { Explanation } from '@/components/learning/Explanation'
import { QuestionRenderer } from '@/components/learning/QuestionRenderer'
import { SessionProgress } from '@/components/learning/SessionProgress'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { routes } from '@/router/routes'
import { useSessionStore } from '@/stores/sessionStore'
import { useToastStore } from '@/stores/toastStore'
import type { DiagnosticReport, SessionQuestion } from '@educore/types'
import { cn } from '@/utils/cn'

export function DiagnosticPage() {
  const { t } = useTranslation()
  const setDiagnosticSessionId = useSessionStore((s) => s.setDiagnosticSessionId)
  const pushToast = useToastStore((s) => s.pushToast)

  const [phase, setPhase] = useState<'welcome' | 'active' | 'report'>('welcome')
  const [current, setCurrent] = useState<SessionQuestion | null>(null)
  const [answerVal, setAnswerVal] = useState<string | boolean | null>(null)
  const [feedback, setFeedback] = useState<AnswerFeedbackData | null>(null)
  const [questionOrdinal, setQuestionOrdinal] = useState(0)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  const loadNext = useMutation({
    mutationFn: getDiagnosticNext,
    onSuccess: (env) => {
      if (!env.success) return
      const d = env.data
      if (isPlaceholderMessage(d)) {
        setCurrent(null)
        return
      }
      if (isSessionQuestionPayload(d)) {
        setCurrent(d)
        setAnswerVal(null)
        setFeedback(null)
        setQuestionOrdinal((n) => n + 1)
      }
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: t('warm.tinyBump'),
        message: t('warm.tinyBumpDesc'),
      })
    },
  })

  const start = useMutation({
    mutationFn: () => {
      const moduleId = useSessionStore.getState().activeModuleId ?? undefined
      return postDiagnosticStart(moduleId)
    },
    onSuccess: (env) => {
      if (!env.success) {
        pushToast({ variant: 'error', title: t('warm.notQuite'), message: t('warm.startFailed') })
        return
      }
      const d = env.data
      if (isLearningSession(d)) {
        setDiagnosticSessionId(d.id)
      } else if (isPlaceholderMessage(d)) {
        pushToast({
          variant: 'info',
          title: t('warm.connectedCare'),
          message: d.message,
        })
      }
      setPhase('active')
      loadNext.mutate()
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: t('warm.notQuite'),
        message: t('warm.journeyStartFailed'),
      })
    },
  })

  const submit = useMutation({
    mutationFn: async () => {
      const sid = useSessionStore.getState().diagnosticSessionId
      if (!sid || !current) throw new Error('missing-session')
      const answer =
        typeof answerVal === 'boolean' ? (answerVal ? 'true' : 'false') : (answerVal ?? '').trim()
      if (!answer) throw new Error('missing-answer')
      return postDiagnosticAnswer({ sessionId: sid, questionId: current.questionId, answer })
    },
    onSuccess: (env) => {
      if (!env.success) return
      const d = env.data
      if (isAnswerFeedback(d)) {
        setFeedback(d)
        clearTimer()
        if (d.isCorrect) {
          advanceTimer.current = setTimeout(() => {
            setFeedback(null)
            loadNext.mutate()
          }, 1500)
        }
        return
      }
      if (isPlaceholderMessage(d)) {
        pushToast({ variant: 'info', title: t('warm.lovelyTry'), message: d.message })
        loadNext.mutate()
        return
      }
      loadNext.mutate()
    },
    onError: (e) => {
      if (e instanceof Error && e.message === 'missing-answer') {
        pushToast({
          variant: 'info',
          title: t('warm.almostThere'),
          message: t('warm.chooseAnswer'),
        })
        return
      }
      pushToast({
        variant: 'error',
        title: t('warm.notQuite'),
        message: t('warm.answerFailed'),
      })
    },
  })

  const reportQuery = useQuery({
    queryKey: ['diagnostic-report'],
    queryFn: async () => {
      const env = await getDiagnosticReport()
      if (!env.success) throw new Error('report')
      return env.data
    },
    enabled: phase === 'report',
  })

  const report: DiagnosticReport | null =
    reportQuery.data && isDiagnosticReport(reportQuery.data) ? reportQuery.data : null

  const totalQuestions = 25
  const totalRounds = 5

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--color-primary))]">{t('diagnostic.title')}</p>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))]">{t('diagnostic.heading')}</h1>
          <p className="mt-2 max-w-2xl text-[hsl(var(--color-text-secondary))]">
            {t('diagnostic.subtitle')}
          </p>
        </div>
        <Link
          to={routes.studentDashboard}
          className={cn(
            'inline-flex items-center justify-center rounded-[var(--radius-lg)] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-primary))] transition hover:bg-[hsl(var(--color-primary)/0.08)]',
          )}
        >
          {t('diagnostic.backToHome')}
        </Link>
      </div>

      {phase === 'welcome' ? (
        <Card className="space-y-6 text-center md:text-left">
          <h2 className="font-display text-2xl font-semibold text-[hsl(var(--color-text))]">{t('diagnostic.welcomeTitle')}</h2>
          <p className="text-[hsl(var(--color-text-secondary))]">
            {t('diagnostic.welcomeDesc')}
          </p>
          <Button
            type="button"
            size="lg"
            disabled={start.isPending}
            onClick={() => {
              setDiagnosticSessionId(null)
              start.mutate()
            }}
          >
            {start.isPending ? t('diagnostic.startPending') : t('diagnostic.startButton')}
          </Button>
        </Card>
      ) : null}

      {phase === 'active' ? (
        <div className="space-y-6">
          <SessionProgress
            label={t('diagnostic.sessionLabel')}
            current={Math.max(1, questionOrdinal)}
            total={totalQuestions}
            round={Math.min(totalRounds, Math.max(1, Math.ceil(questionOrdinal / 5)))}
            totalRounds={totalRounds}
          />

          {loadNext.isPending && !current ? (
            <Skeleton className="h-64 w-full rounded-[var(--radius-xl)]" />
          ) : null}

          {!loadNext.isPending && !current && !feedback ? (
            <EmptyState
              title={t('diagnostic.nextPending')}
              description={t('diagnostic.nextDesc')}
              action={
                <Button type="button" variant="secondary" onClick={() => loadNext.mutate()}>
                  {t('diagnostic.retryNext')}
                </Button>
              }
            />
          ) : null}

          {current && !feedback ? (
            <>
              <QuestionRenderer
                question={current.question}
                value={answerVal}
                onChange={(v) => setAnswerVal(v)}
                disabled={submit.isPending}
              />
              <div className="flex flex-wrap gap-3">
                <Button type="button" size="lg" disabled={submit.isPending} onClick={() => submit.mutate()}>
                  {submit.isPending ? t('diagnostic.sendingThoughts') : t('diagnostic.shareAnswer')}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setPhase('report')}>
                  {t('diagnostic.wrapUp')}
                </Button>
              </div>
            </>
          ) : null}

          {feedback ? (
            <div className="space-y-4">
              <AnswerFeedback
                isCorrect={feedback.isCorrect}
                serverFeedback={feedback.feedback}
                explanation={feedback.explanation}
                onContinue={
                  feedback.isCorrect
                    ? undefined
                    : () => {
                        clearTimer()
                        setFeedback(null)
                        loadNext.mutate()
                      }
                }
                continueLabel={t('diagnostic.continueReview')}
              />
              {!feedback.isCorrect && feedback.explanation ? (
                <Explanation explanation={feedback.explanation} />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === 'report' ? (
        <Card className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-[hsl(var(--color-text))]">{t('diagnostic.reportTitle')}</h2>
          {reportQuery.isLoading ? <Skeleton className="h-40 w-full" /> : null}
          {reportQuery.isError ? (
            <EmptyState
              title={t('diagnostic.reportLoading')}
              description={t('diagnostic.reportDesc')}
              action={
                <Button type="button" onClick={() => reportQuery.refetch()}>
                  {t('diagnostic.retryReport')}
                </Button>
              }
            />
          ) : null}
          {report ? (
            <div className="space-y-6">
              <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-success)/0.35)] bg-[hsl(var(--color-success-light))] p-5">
                <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">
                  {t('diagnostic.strengthsTitle')}
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[hsl(var(--color-text-secondary))]">
                  {(report.strengths ?? []).length ? (report.strengths ?? []).map((s) => (
                    <li key={s}>{s}</li>
                  )) : (
                    <li>{t('diagnostic.defaultStrength')}</li>
                  )}
                </ul>
              </div>
              <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-5">
                <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">
                  {t('diagnostic.weaknessesTitle')}
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[hsl(var(--color-text-secondary))]">
                  {(report.weaknesses ?? []).length ? (report.weaknesses ?? []).map((w) => (
                    <li key={w}>{w}</li>
                  )) : (
                    <li>{t('diagnostic.defaultWeakness')}</li>
                  )}
                </ul>
              </div>
          <p className="text-lg text-[hsl(var(--color-text))]">
            {report.encouragement?.trim() || t('diagnostic.defaultEncouragement')}
          </p>
              <p className="text-sm text-[hsl(var(--color-text-muted))]">
                {t('diagnostic.levelLabel')}: <span className="font-semibold text-[hsl(var(--color-text))]">{report.estimatedLevel}</span> {t('diagnostic.levelSuffix')}
              </p>
            </div>
          ) : null}
          {!reportQuery.isLoading && reportQuery.isSuccess && !report ? (
            <EmptyState
              title={t('diagnostic.reportPlaceholder')}
              description={t('diagnostic.reportPlaceholderDesc')}
            />
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Link
              to={routes.studentDashboard}
              className="inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-text))] shadow-[var(--shadow-sm)] transition hover:bg-[hsl(var(--color-border)/0.25)]"
            >
              {t('diagnostic.returnHome')}
            </Link>
            <Button type="button" onClick={() => setPhase('welcome')}>
              {t('diagnostic.exploreAgain')}
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
