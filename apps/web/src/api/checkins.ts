import type { ApiSuccess, CheckInDTO, CheckInListResponse, CheckInResponse } from '@educore/types'

import { api } from './client'

// --- Normalizers ---

function normalizeCheckIn(raw: unknown): CheckInDTO {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    id: typeof r.id === 'string' ? r.id : '',
    studentId: typeof r.studentId === 'string' ? r.studentId : '',
    mood: typeof r.mood === 'string' ? (r.mood as CheckInDTO['mood']) : 'cloudy',
    emoji: typeof r.emoji === 'string' ? r.emoji : undefined,
    note: typeof r.note === 'string' ? r.note : undefined,
    date: typeof r.date === 'string' ? r.date : '',
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : '',
  }
}

// --- Create / Update daily check-in ---

export async function saveCheckIn(mood: string, emoji?: string, note?: string): Promise<CheckInResponse> {
  const body: Record<string, unknown> = { mood }
  if (emoji) body.emoji = emoji
  if (note) body.note = note

  const res = await api.post<ApiSuccess<unknown>>('/students/me/checkins', body)
  if (!res.data.success) throw new Error('Could not save your check-in')

  const data = res.data.data as Record<string, unknown>
  return {
    checkIn: normalizeCheckIn(data.checkIn),
    message: typeof data.message === 'string' ? data.message : 'Thank you for sharing how you feel today.',
  }
}

// --- Get check-in history ---

export async function fetchCheckIns(): Promise<CheckInListResponse> {
  const res = await api.get<ApiSuccess<unknown>>('/students/me/checkins')
  if (!res.data.success) throw new Error('Could not load your check-ins')

  const data = res.data.data as Record<string, unknown>
  const rawList = Array.isArray(data.checkIns) ? data.checkIns : []
  return {
    checkIns: rawList.map(normalizeCheckIn),
    streak: typeof data.streak === 'number' ? data.streak : 0,
    total: typeof data.total === 'number' ? data.total : 0,
  }
}

// --- Get today's status ---

export interface TodayStatus {
  checkedIn: boolean
  checkIn: CheckInDTO | null
}

export async function fetchTodayCheckIn(): Promise<TodayStatus> {
  const res = await api.get<ApiSuccess<unknown>>('/students/me/checkins/today')
  if (!res.data.success) return { checkedIn: false, checkIn: null }

  const data = res.data.data as Record<string, unknown>
  const checkedIn = typeof data.checkedIn === 'boolean' ? data.checkedIn : false
  const checkIn = checkedIn && data.checkIn ? normalizeCheckIn(data.checkIn) : null
  return { checkedIn, checkIn }
}
