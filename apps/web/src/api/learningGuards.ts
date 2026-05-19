import type { LearningSession, SessionQuestion } from '@educore/types'

export function isPlaceholderMessage(data: unknown): data is { message: string } {
  if (!data || typeof data !== 'object') return false
  if (!('message' in data)) return false
  if (typeof (data as { message: unknown }).message !== 'string') return false
  return !('id' in data) && !('questionId' in data) && !('question' in data)
}

export function isLearningSession(data: unknown): data is LearningSession {
  if (!data || typeof data !== 'object') return false
  const d = data as LearningSession
  return typeof d.id === 'string' && typeof d.type === 'string' && typeof d.status === 'string'
}

export function isSessionQuestionPayload(data: unknown): data is SessionQuestion {
  if (!data || typeof data !== 'object') return false
  const d = data as SessionQuestion
  return typeof d.questionId === 'string' && !!d.question && typeof d.question === 'object'
}
