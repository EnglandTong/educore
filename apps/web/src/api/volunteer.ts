import type { ApiSuccess } from '@educore/types'
import { api } from './client'

export interface VolunteerProfile {
  _id: string
  userId: string
  expertise: string[]
  bio?: string
  status: 'pending' | 'active' | 'suspended'
  stats: {
    questionsAnswered: number
    helpfulCount: number
    totalContributions: number
  }
  createdAt: string
}

export interface QuestionItem {
  _id: string
  studentId: string
  moduleId?: string
  skillId?: string
  content: string
  status: 'open' | 'answered' | 'closed'
  answers: Array<{
    _id: string
    questionId: string
    volunteerId: string
    content: string
    rating?: number
    isAccepted: boolean
    createdAt: string
  }>
  createdAt: string
}

export interface VolunteerStats {
  totalAnswered: number
  totalRatings: number
  avgRating: number
}

// --- Volunteer Profile ---

export async function registerVolunteer(input: {
  expertise: string[]
  bio?: string
}): Promise<VolunteerProfile> {
  const res = await api.post<ApiSuccess<unknown>>('/volunteer/register', input)
  if (!res.data.success) throw new Error('Could not register as volunteer')
  const data = res.data.data as Record<string, unknown>
  return data.profile as VolunteerProfile
}

export async function fetchVolunteerProfile(): Promise<VolunteerProfile> {
  const res = await api.get<ApiSuccess<unknown>>('/volunteer/profile')
  if (!res.data.success) throw new Error('Could not load profile')
  const data = res.data.data as Record<string, unknown>
  return data.profile as VolunteerProfile
}

export async function fetchVolunteerStats(): Promise<VolunteerStats> {
  const res = await api.get<ApiSuccess<unknown>>('/volunteer/stats')
  if (!res.data.success) throw new Error('Could not load stats')
  const data = res.data.data as Record<string, unknown>
  return data.stats as VolunteerStats
}

// --- Q&A ---

export async function fetchQuestions(status?: string): Promise<QuestionItem[]> {
  const params = status ? `?status=${status}` : ''
  const res = await api.get<ApiSuccess<unknown>>(`/qa/questions${params}`)
  if (!res.data.success) throw new Error('Could not load questions')
  const data = res.data.data as Record<string, unknown>
  return data.questions as QuestionItem[]
}

export async function createQuestion(input: {
  content: string
  moduleId?: string
  skillId?: string
}): Promise<QuestionItem> {
  const res = await api.post<ApiSuccess<unknown>>('/qa/questions', input)
  if (!res.data.success) throw new Error('Could not create question')
  const data = res.data.data as Record<string, unknown>
  return data.question as QuestionItem
}

export async function fetchQuestionById(id: string): Promise<QuestionItem> {
  const res = await api.get<ApiSuccess<unknown>>(`/qa/questions/${id}`)
  if (!res.data.success) throw new Error('Could not load question')
  const data = res.data.data as Record<string, unknown>
  return data.question as QuestionItem
}

export async function createAnswer(questionId: string, content: string) {
  const res = await api.post<ApiSuccess<unknown>>(`/qa/questions/${questionId}/answers`, { content })
  if (!res.data.success) throw new Error('Could not submit answer')
  const data = res.data.data as Record<string, unknown>
  return data.answer
}

export async function rateAnswer(answerId: string, rating: number) {
  const res = await api.post<ApiSuccess<unknown>>(`/qa/answers/${answerId}/rate`, { rating })
  if (!res.data.success) throw new Error('Could not rate answer')
  const data = res.data.data as Record<string, unknown>
  return data.answer
}
