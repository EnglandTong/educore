import type { ApiSuccess, ModuleManifest } from '@educore/types'

import { api } from './client'

export function normalizeModule(raw: unknown): ModuleManifest {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    id: typeof r.id === 'string' ? r.id : '',
    name: typeof r.name === 'string' ? r.name : '',
    version: typeof r.version === 'string' ? r.version : '1.0.0',
    subject: typeof r.subject === 'string' ? r.subject : '',
    category: typeof r.category === 'string' ? r.category : '',
    description: typeof r.description === 'string' ? r.description : '',
    icon: typeof r.icon === 'string' ? r.icon : 'book-open',
    color: typeof r.color === 'string' ? r.color : '#6366f1',
    targetAge: {
      min: ((): number => {
        const ta = r.targetAge as Record<string, unknown> | undefined
        return typeof ta?.min === 'number' ? ta.min as number : 6
      })(),
      max: ((): number => {
        const ta = r.targetAge as Record<string, unknown> | undefined
        return typeof ta?.max === 'number' ? ta.max as number : 18
      })(),
    },
    skills: Array.isArray(r.skills) ? r.skills as ModuleManifest['skills'] : [],
    levels: Array.isArray(r.levels) ? r.levels as ModuleManifest['levels'] : [],
    questionTypes: Array.isArray(r.questionTypes) ? r.questionTypes as ModuleManifest['questionTypes'] : [],
    diagnostic: (r.diagnostic as ModuleManifest['diagnostic']) ?? { rounds: 5, questionsPerRound: 5, strategy: 'adaptive' },
    training: (r.training as ModuleManifest['training']) ?? {
      sessionLength: 30,
      adaptiveWeights: { weak: 60, current: 25, review: 15 },
      masteryThreshold: 85,
    },
  }
}

export async function fetchAvailableModules(): Promise<ModuleManifest[]> {
  const res = await api.get<ApiSuccess<unknown>>('/modules')
  if (!res.data.success) return []
  const data = res.data.data as { modules?: unknown }
  const raw = Array.isArray(data.modules) ? data.modules : []
  return raw.map(normalizeModule)
}
