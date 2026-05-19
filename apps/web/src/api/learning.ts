import type { ApiSuccess, DiagnosticReport, SessionReport } from '@educore/types'

import { api } from './client'

export interface AnswerFeedbackData {
  isCorrect: boolean
  feedback: string
  explanation: string
  nextReviewAt?: string
}

export async function postDiagnosticStart(moduleId?: string): Promise<ApiSuccess<unknown>> {
  const body: Record<string, unknown> = {}
  if (moduleId) body.moduleId = moduleId
  const res = await api.post<ApiSuccess<unknown>>('/learning/diagnostic/start', body)
  return res.data
}

export async function getDiagnosticNext(): Promise<ApiSuccess<unknown>> {
  const res = await api.get<ApiSuccess<unknown>>('/learning/diagnostic/next')
  return res.data
}

export async function postDiagnosticAnswer(payload: {
  sessionId: string
  questionId: string
  answer: string | string[]
  timeSpent?: number
  hintsUsed?: number
}): Promise<ApiSuccess<unknown>> {
  const res = await api.post<ApiSuccess<unknown>>('/learning/diagnostic/answer', payload)
  return res.data
}

export async function getDiagnosticReport(): Promise<ApiSuccess<unknown>> {
  const res = await api.get<ApiSuccess<unknown>>('/learning/diagnostic/report')
  return res.data
}

export async function postTrainingStart(moduleId?: string): Promise<ApiSuccess<unknown>> {
  const body: Record<string, unknown> = {}
  if (moduleId) body.moduleId = moduleId
  const res = await api.post<ApiSuccess<unknown>>('/learning/training/start', body)
  return res.data
}

export async function getTrainingNext(): Promise<ApiSuccess<unknown>> {
  const res = await api.get<ApiSuccess<unknown>>('/learning/training/next')
  return res.data
}

export async function postTrainingAnswer(payload: {
  sessionId: string
  questionId: string
  answer: string | string[]
  timeSpent?: number
  hintsUsed?: number
}): Promise<ApiSuccess<unknown>> {
  const res = await api.post<ApiSuccess<unknown>>('/learning/training/answer', payload)
  return res.data
}

export async function postTrainingEnd(): Promise<ApiSuccess<unknown>> {
  const res = await api.post<ApiSuccess<unknown>>('/learning/training/end', {})
  return res.data
}

export function isAnswerFeedback(data: unknown): data is AnswerFeedbackData {
  if (!data || typeof data !== 'object') return false
  const d = data as AnswerFeedbackData
  return typeof d.isCorrect === 'boolean' && typeof d.feedback === 'string' && typeof d.explanation === 'string'
}

export function isDiagnosticReport(data: unknown): data is DiagnosticReport {
  if (!data || typeof data !== 'object') return false
  const d = data as Partial<DiagnosticReport>
  return typeof d.sessionId === 'string' && typeof d.estimatedLevel === 'string'
}

export function isSessionReport(data: unknown): data is SessionReport {
  if (!data || typeof data !== 'object') return false
  return 'sessionId' in data && typeof (data as SessionReport).accuracy === 'number'
}
