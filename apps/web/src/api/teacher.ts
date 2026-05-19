import type { ApiSuccess } from '@educore/types'

import { api } from './client'

export async function fetchClassOverview(): Promise<unknown | null> {
  const res = await api.get<ApiSuccess<unknown>>('/teacher/class/overview')
  if (!res.data.success) return null
  const data = res.data.data as { overview?: unknown }
  return data.overview ?? null
}

export async function fetchClassWeakAreas(): Promise<unknown[]> {
  const res = await api.get<ApiSuccess<unknown>>('/teacher/class/weak-areas')
  if (!res.data.success) return []
  const data = res.data.data as { weakAreas?: unknown }
  return Array.isArray(data.weakAreas) ? data.weakAreas : []
}

export async function fetchStudentSummary(studentId: string): Promise<unknown | null> {
  const res = await api.get<ApiSuccess<unknown>>(`/teacher/students/${encodeURIComponent(studentId)}/summary`)
  if (!res.data.success) return null
  const data = res.data.data as { summary?: unknown }
  return data.summary ?? null
}
