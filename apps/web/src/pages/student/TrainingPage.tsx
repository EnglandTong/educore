import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  getTrainingNext,
  isAnswerFeedback,
  isSessionReport,
  postTrainingAnswer,
  postTrainingEnd,
  postTrainingStart,
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
import type { SessionQuestion, SessionReport } from '@educore/types'
import { cn } from '@/utils/cn'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { addOfflineAnswer } from '@/db/sessions-store'
import { enqueueOperation, registerSyncListener, processSyncQueue } from '@/db/sync-queue'

export function TrainingPage() {
  const { t } = useTranslation()
  const setTrainingSessionId = useSessionStore((s) => s.setTrainingSessionId)
  const pushToast = useToastStore((s) => s.pushToast)
  const { isOnline } = useNetworkStatus()

  const [phase, setPhase] = useState<'welcome' | 'active' | 'summary'>('welcome')
  const [current, setCurrent] = useState<SessionQuestion | null>(null)
  const [answerVal, setAnswerVal] = useState<string | boolean | null>(null)
  const [feedback, setFeedback] = useState<AnswerFeedbackData | null>(null)
  const [questionOrdinal, setQuestionOrdinal] = useState(0)
  const [sessionReport, setSessionReport] = useState<SessionReport | null>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const offlineSessionStarted = useRef(false)

  useEffect(() => {
    registerSyncListener((result) => {
      if (result.blocked > 0) {
        pushToast({ variant: 'error', title: 'Sync needs attention', message: `${result.blocked} offline item(s) reached the retry limit and remain unsynced.` })
      } else if (result.failed > 0) {
        pushToast({ variant: 'error', title: 'Sync is still trying', message: `${result.failed} offline item(s) will retry when the connection is ready.` })
      } else if (result.synced > 0) {
        pushToast({ variant: 'info', title: 'Offline work restored', message: `${result.synced} saved answer(s) synced successfully.` })
      }
    })
  }, [pushToast])

  useEffect(() => {
    if (isOnline && offlineSessionStarted.current) {
      processSyncQueue().catch(() => {})
      offlineSessionStarted.current = false
    }
  }, [isOnline])

  const clearTimer = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  const loadNext = useMutation({
    mutationFn: getTrainingNext,
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
        title: 'Tiny hiccup',
        message: 'We could not fetch the next practice moment — want to try again softly?',
      })
    },
  })

  const start = useMutation({
    mutationFn: () => {
      const moduleId = useSessionStore.getState().activeModuleId ?? undefined
      return postTrainingStart(moduleId)
    },
    onSuccess: (env) => {
      if (!env.success) {
        pushToast({ variant: 'error', title: 'Not quite — let me help!', message: 'Training could not start yet.' })
        return
      }
      const d = env.data
      const sessionPayload = isLearningSession(d)
        ? d
        : (d && typeof d === 'object' && 'session' in d ? (d as { session: unknown }).session : null)
      if (isLearningSession(sessionPayload)) {
        setTrainingSessionId(sessionPayload.id)
      } else if (isPlaceholderMessage(d)) {
        pushToast({ variant: 'info', title: 'Almost ready', message: d.message })
      }
      setPhase('active')
      loadNext.mutate()
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'Not quite — let me help!',
        message: 'The adventure could not begin — please give it another try soon.',
      })
    },
  })

  const submit = useMutation({
    mutationFn: async () => {
      const sid = useSessionStore.getState().trainingSessionId
      if (!sid || !current) throw new Error('missing-session')
      const answer =
        typeof answerVal === 'boolean' ? (answerVal ? 'true' : 'false') : (answerVal ?? '').trim()
      if (!answer) throw new Error('missing-answer')
      const eventId = crypto.randomUUID()

      if (!isOnline) {
        await addOfflineAnswer(sid, {
          sessionId: sid,
          questionId: current.questionId,
          answer,
        })
        await enqueueOperation({
          type: 'submit_answer',
          payload: { sessionId: sid, questionId: current.questionId, eventId, answer, sessionType: 'training' },
        })
        offlineSessionStarted.current = true
        return { success: true, data: { isCorrect: false, feedback: 'Saved offline — will sync when connected.', explanation: '' } }
      }

      try {
        return await postTrainingAnswer({ sessionId: sid, questionId: current.questionId, eventId, answer })
      } catch (error) {
        const maybeAxios = error as { response?: unknown; message?: string }
        if (maybeAxios.response || maybeAxios.message !== 'Network Error') throw error
        await addOfflineAnswer(sid, { sessionId: sid, questionId: current.questionId, answer })
        await enqueueOperation({
          type: 'submit_answer',
          payload: { sessionId: sid, questionId: current.questionId, eventId, answer, sessionType: 'training' },
        })
        offlineSessionStarted.current = true
        return { success: true, data: { isCorrect: false, feedback: 'Saved offline — will sync when connected.', explanation: '' } }
      }
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
        pushToast({ variant: 'info', title: 'Recorded with care', message: d.message })
        loadNext.mutate()
        return
      }
      loadNext.mutate()
    },
    onError: (e) => {
      if (e instanceof Error && e.message === 'missing-answer') {
        pushToast({
          variant: 'info',
          title: 'Almost there',
          message: 'Add your answer when you feel ready — we are in no rush.',
        })
        return
      }
      pushToast({
        variant: 'error',
        title: 'Not quite — let me help!',
        message: 'That answer did not travel through — want to try once more?',
      })
    },
  })

  const endSession = useMutation({
    mutationFn: async () => {
      if (!isOnline) {
        const sid = useSessionStore.getState().trainingSessionId
        if (sid) {
          const eventId = crypto.randomUUID()
          await enqueueOperation({
            type: 'end_session',
            payload: { sessionId: sid, eventId, sessionType: 'training' },
          })
        }
        return { success: true, data: { encouragement: 'Session saved offline!', correctCount: 0, totalQuestions: 0, accuracy: 0, growthAreas: [] } }
      }
      return postTrainingEnd()
    },
    onSuccess: (env) => {
      if (!env.success) {
        pushToast({ variant: 'error', title: 'Not quite — let me help!', message: 'Ending the session hit a snag.' })
        return
      }
      const d = env.data
      if (isSessionReport(d)) {
        setSessionReport(d)
      } else if (isPlaceholderMessage(d)) {
        pushToast({ variant: 'info', title: 'Session wrapped', message: d.message })
        setSessionReport(null)
      }
      setPhase('summary')
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'Not quite — let me help!',
        message: 'We could not close the session gently — please try again.',
      })
    },
  })

  const totalQuestions = 30

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--color-primary))]">{t('training.title')}</p>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))]">{t('training.heading')}</h1>
          <p className="mt-2 max-w-2xl text-[hsl(var(--color-text-secondary))]">
            {t('training.subtitle')}
          </p>
        </div>
        <Link
          to={routes.studentDashboard}
          className={cn(
            'inline-flex items-center justify-center rounded-[var(--radius-lg)] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-primary))] transition hover:bg-[hsl(var(--color-primary)/0.08)]',
          )}
        >
          {t('training.backToHome')}
        </Link>
      </div>

      {phase === 'welcome' ? (
        <Card className="space-y-6 text-center md:text-left">
          <h2 className="font-display text-2xl font-semibold text-[hsl(var(--color-text))]">{t('training.warmUp')}</h2>
          <p className="text-[hsl(var(--color-text-secondary))]">
            {t('training.warmUpDescription')}
          </p>
          <Button
            type="button"
            size="lg"
            disabled={start.isPending}
            onClick={() => {
              setTrainingSessionId(null)
              setSessionReport(null)
              start.mutate()
            }}
          >
            {start.isPending ? t('training.startPending') : t('training.startButton')}
          </Button>
        </Card>
      ) : null}

      {phase === 'active' ? (
        <div className="space-y-6">
          <SessionProgress
            label={t('training.practiceRhythm')}
            current={Math.max(1, questionOrdinal)}
            total={totalQuestions}
          />

          {loadNext.isPending && !current ? (
            <Skeleton className="h-64 w-full rounded-[var(--radius-xl)]" />
          ) : null}

          {!loadNext.isPending && !current && !feedback ? (
            <EmptyState
              title="Questions are on their way"
              description="The practice queue is still connecting — you are doing everything right by waiting patiently."
              action={
                <Button type="button" variant="secondary" onClick={() => loadNext.mutate()}>
                  Try loading again
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
                  {submit.isPending ? 'Sending encouragement…' : 'Share my answer'}
                </Button>
                <Button type="button" variant="secondary" disabled={endSession.isPending} onClick={() => endSession.mutate()}>
                  {endSession.isPending ? 'Closing softly…' : 'End on a proud note'}
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
                continueLabel="↩ Let us keep going together"
              />
              {!feedback.isCorrect && feedback.explanation ? (
                <Explanation explanation={feedback.explanation} />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === 'summary' ? (
        <Card className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-[hsl(var(--color-text))]">What we practiced today</h2>
          {sessionReport ? (
            <div className="space-y-4">
              <p className="text-lg text-[hsl(var(--color-text))]">
                {sessionReport.encouragement || 'Beautiful work showing up today.'}
              </p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                You answered {sessionReport.correctCount} of {sessionReport.totalQuestions} with heart — accuracy{' '}
                {(() => {
                  const a = sessionReport.accuracy
                  const pct = a <= 1 ? Math.round(a * 100) : Math.round(a)
                  return pct
                })()}
                % is a snapshot, not a verdict.
              </p>
              {sessionReport.growthAreas?.length ? (
                <div>
                  <h3 className="font-semibold text-[hsl(var(--color-text))]">Gentle next focus</h3>
                  <ul className="mt-2 list-disc pl-5 text-[hsl(var(--color-text-secondary))]">
                    {sessionReport.growthAreas.map((g: string) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title="Your recap is almost written"
              description="The server is still assembling the full session story — your effort already matters."
            />
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              to={routes.studentDashboard}
              className="inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-text))] shadow-[var(--shadow-sm)] transition hover:bg-[hsl(var(--color-border)/0.25)]"
            >
              Back home, feeling proud
            </Link>
            <Button type="button" onClick={() => setPhase('welcome')}>
              Plan another session
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
