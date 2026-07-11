import type { ApiSuccess, MasteryLevel } from '@educore/types'

import { api } from './client'

export interface WeakAreaItem {
  skillId: string
  skillName: string
  averageScore: number
  level: MasteryLevel
}

export interface ClassOverviewStudent {
  id: string
  name: string
  gradeLevel?: string
}

export interface ClassOverview {
  teacherId: string
  studentCount: number
  averageScore: number
  gradeGroups: Record<string, number>
  topWeakAreas: WeakAreaItem[]
  students?: ClassOverviewStudent[]
}

export interface TeacherStudentSummary {
  teacherId: string
  student: {
    id: string
    name: string
    gradeLevel?: string
    avatar?: string
    nickname?: string
  }
  progress?: {
    completedModules?: number
    totalModules?: number
  }
  masteryCount: number
  activeSkills: number
}

export interface TeacherAssignmentItem {
  studentId: string
  studentName: string
  gradeLevel?: string
  assignedAt: string
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

export async function fetchStudentSummary(studentId: string): Promise<TeacherStudentSummary | null> {
  const res = await api.get<ApiSuccess<{ summary: TeacherStudentSummary }>>(
    `/teacher/students/${encodeURIComponent(studentId)}/summary`,
  )
  if (!res.data.success) return null
  return res.data.data.summary ?? null
}

export async function fetchTeacherAssignments(): Promise<TeacherAssignmentItem[]> {
  const res = await api.get<ApiSuccess<{ assignments: TeacherAssignmentItem[] }>>('/teacher/assignments')
  if (!res.data.success) return []
  return res.data.data.assignments ?? []
}
