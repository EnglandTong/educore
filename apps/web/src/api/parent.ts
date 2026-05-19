import type { ApiResponse, ApiSuccess, ProgressOverview, SubjectGuide } from '@educore/types'

import { api } from './client'
import { normalizeProgressOverview } from './progress'

/** Matches live `GET /parent/children` rows (GuardianLink + student profile). */
export interface LinkedChild {
  id: string
  name: string
  avatar?: string
  nickname?: string
  gradeLevel?: string
  relationship: string
  consentGiven: boolean
  consentDate?: string
}

export interface ChildActivitySession {
  id: string
  type: string
  status: string
  moduleId: string
  totalQuestions: number
  correctCount: number
  startedAt: string
  completedAt?: string
  encouragement: string
}

export interface ChildActivityMessage {
  id: string
  conversationId: string
  content: string
  sentAt: string
  senderName: string
  senderRole: 'teacher' | 'parent'
}

export interface ChildActivityView {
  childId: string
  recentSessions: ChildActivitySession[]
  recentMessages: ChildActivityMessage[]
}

function normalizeLinkedChild(raw: unknown): LinkedChild | null {
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Record<string, unknown>
  const id = typeof c.id === 'string' ? c.id : ''
  const name = typeof c.name === 'string' ? c.name : ''
  if (!id || !name) return null
  return {
    id,
    name,
    avatar: typeof c.avatar === 'string' ? c.avatar : undefined,
    nickname: typeof c.nickname === 'string' ? c.nickname : undefined,
    gradeLevel: typeof c.gradeLevel === 'string' ? c.gradeLevel : undefined,
    relationship: typeof c.relationship === 'string' ? c.relationship : 'family',
    consentGiven: c.consentGiven === true,
    consentDate: typeof c.consentDate === 'string' ? c.consentDate : undefined,
  }
}

export async function fetchParentChildren(): Promise<LinkedChild[]> {
  const res = await api.get<ApiSuccess<unknown>>('/parent/children')
  if (!res.data.success) return []
  const data = res.data.data as { children?: unknown }
  if (!Array.isArray(data.children)) return []
  return data.children.map(normalizeLinkedChild).filter((x): x is LinkedChild => x !== null)
}

export async function postParentLink(inviteCode: string, relationship: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>('/parent/links', { inviteCode: inviteCode.trim(), relationship })
  if (!res.data.success) throw new Error('Link request did not complete')
}

export async function putParentChildConsent(childId: string, consentGiven: boolean): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(`/parent/children/${encodeURIComponent(childId)}/consent`, {
    consentGiven,
  })
  if (!res.data.success) throw new Error('Consent update did not complete')
}

export async function fetchChildProgress(childId: string): Promise<ProgressOverview | null> {
  const res = await api.get<ApiSuccess<unknown>>(`/parent/children/${encodeURIComponent(childId)}/progress`)
  if (!res.data.success) return null
  const data = res.data.data as { progress?: unknown }
  if (data.progress == null) return null
  return normalizeProgressOverview(data.progress)
}

function normalizeSession(raw: unknown): ChildActivitySession | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Record<string, unknown>
  const id = typeof s.id === 'string' ? s.id : ''
  if (!id) return null
  return {
    id,
    type: typeof s.type === 'string' ? s.type : 'session',
    status: typeof s.status === 'string' ? s.status : 'unknown',
    moduleId: typeof s.moduleId === 'string' ? s.moduleId : '',
    totalQuestions: typeof s.totalQuestions === 'number' ? s.totalQuestions : 0,
    correctCount: typeof s.correctCount === 'number' ? s.correctCount : 0,
    startedAt: typeof s.startedAt === 'string' ? s.startedAt : new Date(0).toISOString(),
    completedAt: typeof s.completedAt === 'string' ? s.completedAt : undefined,
    encouragement:
      typeof s.encouragement === 'string'
        ? s.encouragement
        : 'Your learner kept showing up — that steadiness is worth a quiet cheer.',
  }
}

function normalizeActivityMessage(raw: unknown): ChildActivityMessage | null {
  if (!raw || typeof raw !== 'object') return null
  const m = raw as Record<string, unknown>
  const id = typeof m.id === 'string' ? m.id : ''
  if (!id) return null
  const role = m.senderRole === 'teacher' || m.senderRole === 'parent' ? m.senderRole : 'teacher'
  return {
    id,
    conversationId: typeof m.conversationId === 'string' ? m.conversationId : '',
    content: typeof m.content === 'string' ? m.content : '',
    sentAt: typeof m.sentAt === 'string' ? m.sentAt : new Date(0).toISOString(),
    senderName: typeof m.senderName === 'string' ? m.senderName : 'Someone who cares',
    senderRole: role,
  }
}

export async function fetchChildActivity(childId: string): Promise<ChildActivityView> {
  const empty: ChildActivityView = { childId, recentSessions: [], recentMessages: [] }
  const res = await api.get<ApiSuccess<unknown>>(`/parent/children/${encodeURIComponent(childId)}/activity`)
  if (!res.data.success) return empty
  const data = res.data.data as { activity?: unknown }
  const activity = data.activity
  if (!activity || typeof activity !== 'object') return empty
  const a = activity as Record<string, unknown>
  const sessionsRaw = a.recentSessions
  const messagesRaw = a.recentMessages
  const recentSessions = Array.isArray(sessionsRaw)
    ? sessionsRaw.map(normalizeSession).filter((x): x is ChildActivitySession => x !== null)
    : []
  const recentMessages = Array.isArray(messagesRaw)
    ? messagesRaw.map(normalizeActivityMessage).filter((x): x is ChildActivityMessage => x !== null)
    : []
  return { childId: typeof a.childId === 'string' ? a.childId : childId, recentSessions, recentMessages }
}

export async function fetchSubjectGuide(moduleId: string, skillId: string): Promise<SubjectGuide | null> {
  const res = await api.get<ApiSuccess<unknown>>(
    `/parent/guides/${encodeURIComponent(moduleId)}/${encodeURIComponent(skillId)}`,
  )
  if (!res.data.success) return null
  const data = res.data.data as { guide?: unknown }
  if (data.guide == null || typeof data.guide !== 'object') return null
  return normalizeSubjectGuide(data.guide)
}

function normalizeSubjectGuide(raw: unknown): SubjectGuide | null {
  if (!raw || typeof raw !== 'object') return null
  const g = raw as Record<string, unknown>
  const moduleId = typeof g.moduleId === 'string' ? g.moduleId : ''
  const skillId = typeof g.skillId === 'string' ? g.skillId : ''
  if (!moduleId || !skillId) return null
  const howToHelp = Array.isArray(g.howToHelp) ? g.howToHelp.filter((s): s is string => typeof s === 'string') : []
  const commonMistakes = Array.isArray(g.commonMistakes)
    ? g.commonMistakes.filter((s): s is string => typeof s === 'string')
    : []
  const signsOfProgress = Array.isArray(g.signsOfProgress)
    ? g.signsOfProgress.filter((s): s is string => typeof s === 'string')
    : []
  const ifStruggling = Array.isArray(g.ifStruggling) ? g.ifStruggling.filter((s): s is string => typeof s === 'string') : []
  return {
    moduleId,
    skillId,
    skillName: typeof g.skillName === 'string' ? g.skillName : 'This topic',
    title: typeof g.title === 'string' ? g.title : 'Subject guide',
    whatIsIt: typeof g.whatIsIt === 'string' ? g.whatIsIt : '',
    howToHelp,
    commonMistakes,
    signsOfProgress,
    ifStruggling,
  }
}
