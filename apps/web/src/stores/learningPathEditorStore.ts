import { create } from 'zustand'
import type { PathNode, PathEdge, DifficultyCurvePoint } from '@/api/learningPath'

let nodeCounter = 0
function generateNodeId(): string {
  nodeCounter += 1
  return `node_${Date.now()}_${nodeCounter}`
}
function generateEdgeId(): string {
  return `edge_${Date.now()}_${nodeCounter}`
}

export interface EditorPath {
  id: string
  title: string
  description: string
  moduleId: string
  nodes: PathNode[]
  edges: PathEdge[]
  status: 'draft' | 'published' | 'archived'
  assignedClassIds: string[]
}

interface EditorState {
  // Path data
  path: EditorPath | null
  pathId: string | null
  isLoading: boolean
  isSaving: boolean
  isDirty: boolean

  // Selection
  selectedNodeId: string | null

  // Preview
  isPreviewMode: boolean
  previewStudentId: string | null

  // Difficulty curve
  difficultyCurve: DifficultyCurvePoint[]

  // Actions
  loadPath: (path: EditorPath) => void
  setPathId: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  updatePathMeta: (data: { title?: string; description?: string; moduleId?: string }) => void
  addNode: (type: PathNode['type'], label: string, positionX: number, positionY: number, skillId?: string, moduleId?: string) => void
  updateNodePosition: (nodeId: string, x: number, y: number) => void
  updateNode: (nodeId: string, partial: Partial<PathNode>) => void
  removeNode: (nodeId: string) => void
  addEdge: (sourceNodeId: string, targetNodeId: string) => void
  removeEdge: (edgeId: string) => void
  selectNode: (nodeId: string | null) => void
  markClean: () => void
  togglePreview: () => void
  setPreviewStudent: (studentId: string | null) => void
  setDifficultyCurve: (curve: DifficultyCurvePoint[]) => void
  reset: () => void
}

export const useLearningPathEditorStore = create<EditorState>((set, get) => ({
  path: null,
  pathId: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  selectedNodeId: null,
  isPreviewMode: false,
  previewStudentId: null,
  difficultyCurve: [],

  loadPath: (path) => set({
    path,
    pathId: path.id,
    selectedNodeId: null,
    isDirty: false,
    isPreviewMode: false,
    difficultyCurve: []
  }),

  setPathId: (id) => set({ pathId: id }),

  setLoading: (loading) => set({ isLoading: loading }),

  setSaving: (saving) => set({ isSaving: saving }),

  updatePathMeta: (data) => {
    const { path } = get()
    if (!path) return
    set({
      path: { ...path, ...data },
      isDirty: true
    })
  },

  addNode: (type, label, positionX, positionY, skillId, moduleId) => {
    const { path } = get()
    if (!path) return
    const newNode: PathNode = {
      id: generateNodeId(),
      type,
      label,
      positionX,
      positionY,
      difficulty: 50,
      branches: [],
      skillId,
      moduleId: moduleId ?? path.moduleId
    }
    set({
      path: { ...path, nodes: [...path.nodes, newNode] },
      isDirty: true,
      selectedNodeId: newNode.id
    })
  },

  updateNodePosition: (nodeId, x, y) => {
    const { path } = get()
    if (!path) return
    set({
      path: {
        ...path,
        nodes: path.nodes.map((n) =>
          n.id === nodeId ? { ...n, positionX: x, positionY: y } : n
        )
      },
      isDirty: true
    })
  },

  updateNode: (nodeId, partial) => {
    const { path } = get()
    if (!path) return
    set({
      path: {
        ...path,
        nodes: path.nodes.map((n) =>
          n.id === nodeId ? { ...n, ...partial } : n
        )
      },
      isDirty: true
    })
  },

  removeNode: (nodeId) => {
    const { path } = get()
    if (!path) return
    set({
      path: {
        ...path,
        nodes: path.nodes.filter((n) => n.id !== nodeId),
        edges: path.edges.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId)
      },
      isDirty: true,
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId
    })
  },

  addEdge: (sourceNodeId, targetNodeId) => {
    const { path } = get()
    if (!path) return
    const newEdge: PathEdge = {
      id: generateEdgeId(),
      sourceNodeId,
      targetNodeId,
      condition: { type: 'always' }
    }
    set({
      path: { ...path, edges: [...path.edges, newEdge] },
      isDirty: true
    })
  },

  removeEdge: (edgeId) => {
    const { path } = get()
    if (!path) return
    set({
      path: {
        ...path,
        edges: path.edges.filter((e) => e.id !== edgeId)
      },
      isDirty: true
    })
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  markClean: () => set({ isDirty: false }),

  togglePreview: () => set((s) => ({ isPreviewMode: !s.isPreviewMode })),

  setPreviewStudent: (studentId) => set({ previewStudentId: studentId }),

  setDifficultyCurve: (curve) => set({ difficultyCurve: curve }),

  reset: () => set({
    path: null,
    pathId: null,
    isLoading: false,
    isSaving: false,
    isDirty: false,
    selectedNodeId: null,
    isPreviewMode: false,
    previewStudentId: null,
    difficultyCurve: []
  })
}))
