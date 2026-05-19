import type { ApiSuccess } from '@educore/types'
import { api } from './client'

export interface JournalEntry {
  id: string
  date: string
  mood: 'happy' | 'calm' | 'sad' | 'anxious' | 'angry' | 'tired'
  content?: string
  isPrivate: boolean
  createdAt: string
}

export interface ProudMoment {
  id: string
  userId: string
  title: string
  description?: string
  reactions: Array<{
    userId: string
    type: 'heart' | 'star' | 'thumbsup' | 'hug'
    createdAt: string
  }>
  createdAt: string
}

export interface MoodLogEntry {
  id: string
  date: string
  mood: '😊' | '😌' | '😢' | '😰' | '😤' | '😴' | '🤔' | '🥰'
  note?: string
  createdAt: string
}

export async function fetchJournals(): Promise<JournalEntry[]> {
  const res = await api.get<ApiSuccess<unknown>>('/heart/journal')
  if (!res.data.success) throw new Error('Could not load journals')
  const data = res.data.data as Record<string, unknown>
  const raw = Array.isArray(data.journals) ? data.journals : []
  return raw as JournalEntry[]
}

export async function createJournal(input: {
  mood: JournalEntry['mood']
  content?: string
  isPrivate?: boolean
}): Promise<JournalEntry> {
  const res = await api.post<ApiSuccess<unknown>>('/heart/journal', input)
  if (!res.data.success) throw new Error('Could not save journal entry')
  const data = res.data.data as Record<string, unknown>
  return data.journal as JournalEntry
}

export async function fetchProudMoments(): Promise<ProudMoment[]> {
  const res = await api.get<ApiSuccess<unknown>>('/heart/proud-moments')
  if (!res.data.success) throw new Error('Could not load proud moments')
  const data = res.data.data as Record<string, unknown>
  const raw = Array.isArray(data.moments) ? data.moments : []
  return raw as ProudMoment[]
}

export async function createProudMoment(input: {
  title: string
  description?: string
}): Promise<ProudMoment> {
  const res = await api.post<ApiSuccess<unknown>>('/heart/proud-moments', input)
  if (!res.data.success) throw new Error('Could not create proud moment')
  const data = res.data.data as Record<string, unknown>
  return data.moment as ProudMoment
}

export async function addReaction(momentId: string, type: string): Promise<ProudMoment> {
  const res = await api.post<ApiSuccess<unknown>>(`/heart/proud-moments/${momentId}/react`, { type })
  if (!res.data.success) throw new Error('Could not add reaction')
  const data = res.data.data as Record<string, unknown>
  return data.moment as ProudMoment
}

export async function createMoodLog(input: {
  mood: MoodLogEntry['mood']
  note?: string
}): Promise<MoodLogEntry> {
  const res = await api.post<ApiSuccess<unknown>>('/heart/mood', input)
  if (!res.data.success) throw new Error('Could not save mood')
  const data = res.data.data as Record<string, unknown>
  return data.moodLog as MoodLogEntry
}

export async function fetchMoodTrend(days = 30): Promise<MoodLogEntry[]> {
  const res = await api.get<ApiSuccess<unknown>>(`/heart/mood/trend?days=${days}`)
  if (!res.data.success) throw new Error('Could not load mood trend')
  const data = res.data.data as Record<string, unknown>
  const raw = Array.isArray(data.trend) ? data.trend : []
  return raw as MoodLogEntry[]
}
