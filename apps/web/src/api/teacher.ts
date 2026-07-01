import type { ApiSuccess, MasteryLevel } from '@educore/types'

import { api } from './client'

export interface WeakAreaItem {
  skillId: string
  skillName: string
  averageScore: number
  level: MasteryLevel
}

export interface ClassOverview {
  teacherId: string
  studentCount: number
  averageScore: number
  gradeGroups: Record<string, number>
  topWeakAreas: WeakAreaItem[]
}

export async function fetchClassOverview(): Promise<ClassOverview | null> {
  const res = await api.get<ApiSuccess<{ overview: ClassOverview }>>('/teacher/class/overview')
  if (!res.data.success) return null
  return res.data.data.overview ?? null
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
