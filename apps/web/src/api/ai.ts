import type { ApiSuccess } from '@educore/types'
import { api } from './client'

export interface AIChatResult {
  answer: string
  source: string
}

export interface AIExplainResult {
  explanation: string
  source: string
}

export interface AISuggestResult {
  suggestion: string
  source: string
}

export interface AIEncourageResult {
  message: string
  source: string
}

export async function aiChat(question: string): Promise<AIChatResult> {
  const res = await api.post<ApiSuccess<unknown>>('/ai/chat', { question })
  if (!res.data.success) throw new Error('AI chat failed')
  return res.data.data as AIChatResult
}

export async function aiExplain(input: {
  questionId?: string
  studentAnswer: string
  correctAnswer: string
}): Promise<AIExplainResult> {
  const res = await api.post<ApiSuccess<unknown>>('/ai/explain', input)
  if (!res.data.success) throw new Error('AI explain failed')
  return res.data.data as AIExplainResult
}

export async function aiSuggest(input: {
  moduleId: string
  skillScores: Record<string, number>
}): Promise<AISuggestResult> {
  const res = await api.post<ApiSuccess<unknown>>('/ai/suggest', input)
  if (!res.data.success) throw new Error('AI suggest failed')
  return res.data.data as AISuggestResult
}

export async function aiEncourage(input: {
  recentPerformance: Array<{ correct: boolean; moduleId?: string }>
}): Promise<AIEncourageResult> {
  const res = await api.post<ApiSuccess<unknown>>('/ai/encourage', input)
  if (!res.data.success) throw new Error('AI encourage failed')
  return res.data.data as AIEncourageResult
}
