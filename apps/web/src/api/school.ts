import type { ApiSuccess } from '@educore/types'
import { api } from './client'

export interface School {
  _id: string
  name: string
  code?: string
  region?: string
  status: string
  address?: string
  contactPhone?: string
  settings?: Record<string, unknown>
  createdAt: string
}

export interface SchoolUser {
  _id: string
  name: string
  email: string
  createdAt: string
}

export interface SchoolOverview {
  studentCount: number
  teacherCount: number
  totalUsers: number
}

export async function fetchSchool(): Promise<School> {
  const res = await api.get<ApiSuccess<unknown>>('/school')
  if (!res.data.success) throw new Error('Could not load school info')
  const data = res.data.data as Record<string, unknown>
  return data.school as School
}

export async function updateSchool(input: Partial<{
  name: string
  address: string
  contactPhone: string
  settings: Record<string, unknown>
}>): Promise<School> {
  const res = await api.put<ApiSuccess<unknown>>('/school', input)
  if (!res.data.success) throw new Error('Could not update school')
  const data = res.data.data as Record<string, unknown>
  return data.school as School
}

export async function fetchStudents(): Promise<SchoolUser[]> {
  const res = await api.get<ApiSuccess<unknown>>('/school/students')
  if (!res.data.success) throw new Error('Could not load students')
  const data = res.data.data as Record<string, unknown>
  return data.students as SchoolUser[]
}

export async function fetchTeachers(): Promise<SchoolUser[]> {
  const res = await api.get<ApiSuccess<unknown>>('/school/teachers')
  if (!res.data.success) throw new Error('Could not load teachers')
  const data = res.data.data as Record<string, unknown>
  return data.teachers as SchoolUser[]
}

export async function fetchSchoolOverview(): Promise<SchoolOverview> {
  const res = await api.get<ApiSuccess<unknown>>('/school/overview')
  if (!res.data.success) throw new Error('Could not load overview')
  const data = res.data.data as Record<string, unknown>
  return data.overview as SchoolOverview
}
