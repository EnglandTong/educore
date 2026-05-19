import { useEffect, useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Eye, EyeOff, Save, Settings, PanelLeft, PanelRight } from 'lucide-react'

import { fetchLearningPath, savePathGraph, fetchDifficultyCurve } from '@/api/learningPath'
import type { SkillItem } from '@/components/learningPath/SkillPalette'
import { useLearningPathEditorStore } from '@/stores/learningPathEditorStore'
import { SkillPalette } from '@/components/learningPath/SkillPalette'
import { PathCanvas } from '@/components/learningPath/PathCanvas'
import { NodeInspector } from '@/components/learningPath/NodeInspector'
import { DifficultyCurveChart } from '@/components/learningPath/DifficultyCurveChart'
import { PathPreview } from '@/components/learningPath/PathPreview'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { routes } from '@/router/routes'
import { cn } from '@/utils/cn'

export function LearningPathEditorPage() {
  const { pathId } = useParams<{ pathId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    path,
    isDirty,
    selectedNodeId,
    isPreviewMode,
    difficultyCurve,
    loadPath,
    setSaving,
    addNode,
    updateNodePosition,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    selectNode,
    markClean,
    togglePreview,
    setDifficultyCurve,
    reset
  } = useLearningPathEditorStore()

  const [showPalette, setShowPalette] = useState(true)
  const [showInspector, setShowInspector] = useState(true)

  // Fetch path data
  const { data: pathData, isError, refetch } = useQuery({
    queryKey: ['learning-path', pathId],
    queryFn: () => fetchLearningPath(pathId!),
    enabled: Boolean(pathId)
  })

  // Load path into store
  useEffect(() => {
    if (pathData) {
      loadPath({
        id: pathData.id,
        title: pathData.title,
        description: pathData.description,
        moduleId: pathData.moduleId,
        nodes: pathData.nodes,
        edges: pathData.edges,
        status: pathData.status,
        assignedClassIds: pathData.assignedClassIds
      })
    }
    return () => { reset() }
  }, [pathData, loadPath, reset])

  // Load difficulty curve
  useEffect(() => {
    if (!pathId) return
    fetchDifficultyCurve(pathId).then(setDifficultyCurve).catch(() => {})
  }, [pathId, setDifficultyCurve])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: () => {
      if (!path || !pathId) throw new Error('No path to save')
      return savePathGraph(pathId, { nodes: path.nodes, edges: path.edges })
    },
    onMutate: () => setSaving(true),
    onSuccess: () => {
      markClean()
      setSaving(false)
      void queryClient.invalidateQueries({ queryKey: ['learning-path', pathId] })
      void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
      if (pathId) {
        fetchDifficultyCurve(pathId).then(setDifficultyCurve).catch(() => {})
      }
    },
    onError: () => setSaving(false)
  })

  const handleCanvasDrop = useCallback((x: number, y: number, data: string) => {
    try {
      const skill: SkillItem = JSON.parse(data)
      addNode('skill', skill.skillName, x, y, skill.skillId, skill.moduleId)
    } catch {
      // Invalid drag data
    }
  }, [addNode])

  const selectedNode = path?.nodes.find((n) => n.id === selectedNodeId) ?? null

  if (isError) {
    return (
      <div className="space-y-8">
        <WarmQueryError
          title="Learning path could not be loaded"
          description="Something went wrong while fetching this path. Let's try again."
          onRetry={() => void refetch()}
        />
        <Button variant="ghost" onClick={() => navigate(routes.teacherLearningPaths)}>
          <ArrowLeft className="h-4 w-4" />
          Back to learning paths
        </Button>
      </div>
    )
  }

  if (!path) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(routes.teacherLearningPaths)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold text-[hsl(var(--color-text))] truncate">
              {path.title}
            </h1>
            <p className="text-xs text-[hsl(var(--color-text-muted))]">
              {path.nodes.length} nodes · {path.edges.length} connections
              {isDirty && <span className="ml-2 text-[hsl(var(--color-growing))]">(unsaved changes)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPalette(!showPalette)}
            className={cn(!showPalette && 'opacity-50')}
            title="Toggle skills palette"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowInspector(!showInspector)}
            className={cn(!showInspector && 'opacity-50')}
            title="Toggle inspector"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={isPreviewMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={togglePreview}
          >
            {isPreviewMode ? (
              <><EyeOff className="h-4 w-4" /> Exit preview</>
            ) : (
              <><Eye className="h-4 w-4" /> Preview</>
            )}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!isDirty || saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left palette */}
        {showPalette && !isPreviewMode && (
          <div className="w-72 shrink-0 overflow-hidden rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] shadow-[var(--shadow-sm)]">
            <SkillPalette
              onSkillDragStart={() => {}}
              onSkillDrop={(skill) => addNode('skill', skill.skillName, 50, 50, skill.skillId, skill.moduleId)}
            />
          </div>
        )}

        {/* Center canvas */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          {isPreviewMode ? (
            <div className="flex flex-1 gap-4 overflow-hidden">
              <div className="flex-1 overflow-auto rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4">
                <PathPreview
                  nodes={path.nodes}
                  edges={path.edges}
                />
              </div>
              <div className="w-80 shrink-0">
                <DifficultyCurveChart data={difficultyCurve} className="h-full" />
              </div>
            </div>
          ) : (
            <PathCanvas
              nodes={path.nodes}
              edges={path.edges}
              selectedNodeId={selectedNodeId}
              isPreviewMode={false}
              onSelectNode={selectNode}
              onUpdateNodePosition={updateNodePosition}
              onDeleteNode={removeNode}
              onDeleteEdge={removeEdge}
              onCreateEdge={addEdge}
              onCanvasDrop={handleCanvasDrop}
              className="flex-1"
            />
          )}
        </div>

        {/* Right inspector / difficulty curve */}
        {!isPreviewMode && showInspector && (
          <div className="w-72 shrink-0 overflow-y-auto rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] shadow-[var(--shadow-sm)]">
            {selectedNode ? (
              <NodeInspector
                node={selectedNode}
                nodes={path.nodes}
                edges={path.edges}
                onUpdateNode={updateNode}
                onRemoveNode={removeNode}
                onRemoveEdge={removeEdge}
              />
            ) : (
              <div className="p-4">
                <DifficultyCurveChart data={difficultyCurve} />
                <div className="mt-4 rounded-[var(--radius-lg)] bg-[hsl(var(--color-border)/0.25)] p-3 text-center">
                  <Settings className="mx-auto h-5 w-5 text-[hsl(var(--color-text-muted))]" />
                  <p className="mt-1 text-xs text-[hsl(var(--color-text-muted))]">
                    Select a node to edit its settings.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


