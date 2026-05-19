import type { ApiSuccess, ModuleProgress, ProgressOverview, SkillMastery } from '@educore/types'

import { api } from './client'

export const DEFAULT_MODULE_ID = 'english.grammar'
/** First skill in `modules/english-grammar/manifest.json` — matches live parent guide API. */
export const DEFAULT_GUIDE_SKILL_ID = 'tense-aspect'

export function normalizeProgressOverview(raw: unknown): ProgressOverview {
  const partial = (raw && typeof raw === 'object' ? raw : {}) as Partial<ProgressOverview> & {
    modules?: ModuleProgress[]
  }
  return {
    studentId: typeof partial.studentId === 'string' ? partial.studentId : '',
    modules: Array.isArray(partial.modules) ? partial.modules : [],
    totalXP: typeof partial.totalXP === 'number' ? partial.totalXP : 0,
    currentStreak: typeof partial.currentStreak === 'number' ? partial.currentStreak : 0,
    longestStreak: typeof partial.longestStreak === 'number' ? partial.longestStreak : 0,
  }
}

export async function fetchProgressOverview(): Promise<ProgressOverview> {
  const res = await api.get<ApiSuccess<unknown>>('/progress/overview')
  if (!res.data.success) throw new Error('Progress overview unavailable')
  return normalizeProgressOverview(res.data.data)
}

export async function fetchModuleSkills(moduleId: string): Promise<SkillMastery[]> {
  const res = await api.get<ApiSuccess<{ skills?: SkillMastery[] }>>(
    `/progress/${encodeURIComponent(moduleId)}/skills`,
  )
  if (!res.data.success) throw new Error('Skills unavailable')
  const skills = res.data.data.skills
  return Array.isArray(skills) ? skills : []
}

export interface TimelinePoint {
  at: string
  score: number
  label?: string
}

/** Avoid `label: undefined` in object literals so inferred types match optional `label?`. */
function toTimelinePoint(at: string, score: number, label?: string): TimelinePoint {
  return label === undefined ? { at, score } : { at, score, label }
}

export async function fetchProgressHistory(): Promise<TimelinePoint[]> {
  const res = await api.get<ApiSuccess<unknown>>('/progress/history')
  if (!res.data.success) return []
  const data = res.data.data as { timeline?: unknown[]; points?: unknown[] }
  const raw = Array.isArray(data.timeline) ? data.timeline : Array.isArray(data.points) ? data.points : []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const r = row as Record<string, unknown>
      const at = typeof r.at === 'string' ? r.at : typeof r.date === 'string' ? r.date : typeof r.t === 'string' ? r.t : ''
      const score = typeof r.score === 'number' ? r.score : typeof r.value === 'number' ? r.value : 0
      const label = typeof r.label === 'string' ? r.label : undefined
      if (!at) return null
      return toTimelinePoint(at, score, label)
    })
    .filter((x): x is TimelinePoint => x !== null)
}

export async function fetchModuleTimeline(moduleId: string): Promise<TimelinePoint[]> {
  const res = await api.get<ApiSuccess<unknown>>(`/progress/${encodeURIComponent(moduleId)}/timeline`)
  if (!res.data.success) return []
  const data = res.data.data as { timeline?: unknown[] }
  const raw = Array.isArray(data.timeline) ? data.timeline : []
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const r = row as Record<string, unknown>
      const at = typeof r.at === 'string' ? r.at : typeof r.date === 'string' ? r.date : ''
      const score = typeof r.score === 'number' ? r.score : 0
      if (!at) return null
      return toTimelinePoint(at, score)
    })
    .filter((x): x is TimelinePoint => x !== null)
}
