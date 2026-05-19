import { api } from './client'

export interface PathNode {
  id: string
  type: 'module' | 'skill' | 'condition' | 'review' | 'challenge'
  moduleId?: string
  skillId?: string
  label: string
  positionX: number
  positionY: number
  difficulty?: number
  branches: Array<{
    skillId: string
    operator: 'gte' | 'lt' | 'eq'
    thresholdScore: number
    targetNodeId: string
  }>
}

export interface PathEdge {
  id: string
  sourceNodeId: string
  targetNodeId: string
  condition?: {
    type: 'always' | 'score_above' | 'score_below'
    threshold?: number
  }
}

export interface LearningPath {
  id: string
  teacherId: string
  title: string
  description: string
  moduleId: string
  nodes: PathNode[]
  edges: PathEdge[]
  status: 'draft' | 'published' | 'archived'
  assignedClassIds: string[]
  createdAt: string
  updatedAt: string
  nodeCount?: number
  edgeCount?: number
}

export interface DifficultyCurvePoint {
  nodeId: string
  label: string
  difficulty: number
  order: number
}

export interface PreviewAnnotation {
  nodeId: string
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
  studentScore?: number
}

export async function fetchLearningPaths(): Promise<LearningPath[]> {
  const res = await api.get('/teacher/learning-paths')
  if (!res.data.success) return []
  const data = res.data.data as { paths: LearningPath[] }
  return data.paths ?? []
}

export async function fetchLearningPath(id: string): Promise<LearningPath | null> {
  const res = await api.get(`/teacher/learning-paths/${encodeURIComponent(id)}`)
  if (!res.data.success) return null
  const data = res.data.data as { path: LearningPath }
  return data.path ?? null
}

export async function createLearningPath(input: {
  title: string
  description?: string
  moduleId?: string
}): Promise<LearningPath | null> {
  const res = await api.post('/teacher/learning-paths', input)
  if (!res.data.success) return null
  const data = res.data.data as { path: LearningPath }
  return data.path ?? null
}

export async function savePathGraph(
  id: string,
  graph: { nodes: PathNode[]; edges: PathEdge[] }
): Promise<LearningPath | null> {
  const res = await api.put(
    `/teacher/learning-paths/${encodeURIComponent(id)}/graph`,
    graph
  )
  if (!res.data.success) return null
  const data = res.data.data as { path: LearningPath }
  return data.path ?? null
}

export async function fetchDifficultyCurve(
  id: string
): Promise<DifficultyCurvePoint[]> {
  const res = await api.get(
    `/teacher/learning-paths/${encodeURIComponent(id)}/difficulty-curve`
  )
  if (!res.data.success) return []
  const data = res.data.data as { curve: DifficultyCurvePoint[] }
  return data.curve ?? []
}

export async function fetchPathPreview(
  pathId: string,
  studentId: string
): Promise<{ nodes: PathNode[]; edges: PathEdge[]; annotations: PreviewAnnotation[] } | null> {
  const res = await api.get(
    `/teacher/learning-paths/${encodeURIComponent(pathId)}/preview/${encodeURIComponent(studentId)}`
  )
  if (!res.data.success) return null
  const data = res.data.data as { preview: { nodes: PathNode[]; edges: PathEdge[]; annotations: PreviewAnnotation[] } }
  return data.preview ?? null
}

export async function publishLearningPath(
  id: string,
  classIds?: string[]
): Promise<LearningPath | null> {
  const res = await api.post(
    `/teacher/learning-paths/${encodeURIComponent(id)}/publish`,
    { assignedClassIds: classIds }
  )
  if (!res.data.success) return null
  const data = res.data.data as { path: LearningPath }
  return data.path ?? null
}

export async function archiveLearningPath(id: string): Promise<LearningPath | null> {
  const res = await api.post(
    `/teacher/learning-paths/${encodeURIComponent(id)}/archive`
  )
  if (!res.data.success) return null
  const data = res.data.data as { path: LearningPath }
  return data.path ?? null
}

export async function deleteLearningPath(id: string): Promise<boolean> {
  const res = await api.delete(
    `/teacher/learning-paths/${encodeURIComponent(id)}`
  )
  return res.data.success === true
}
