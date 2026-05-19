import { Eye, Lock, CheckCircle, Play } from 'lucide-react'

import type { PathNode, PathEdge } from '@/api/learningPath'
import { cn } from '@/utils/cn'

export interface PathPreviewProps {
  nodes: PathNode[]
  edges: PathEdge[]
  annotations?: Array<{
    nodeId: string
    status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
    studentScore?: number
  }>
  className?: string
}

const statusConfig = {
  locked: {
    icon: Lock,
    label: 'Locked',
    color: 'text-[hsl(var(--color-text-muted))]',
    bg: 'bg-[hsl(var(--color-border)/0.35)]',
    border: 'border-[hsl(var(--color-border))]'
  },
  available: {
    icon: Play,
    label: 'Available',
    color: 'text-[hsl(var(--color-primary))]',
    bg: 'bg-[hsl(var(--color-primary)/0.08)]',
    border: 'border-[hsl(var(--color-primary)/0.3)]'
  },
  in_progress: {
    icon: Play,
    label: 'In progress',
    color: 'text-[hsl(var(--color-growing))]',
    bg: 'bg-[hsl(var(--color-growing)/0.08)]',
    border: 'border-[hsl(var(--color-growing)/0.3)]'
  },
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    color: 'text-[hsl(var(--color-proficient))]',
    bg: 'bg-[hsl(var(--color-proficient)/0.08)]',
    border: 'border-[hsl(var(--color-proficient)/0.3)]'
  },
  mastered: {
    icon: CheckCircle,
    label: 'Mastered',
    color: 'text-[hsl(var(--color-mastered))]',
    bg: 'bg-[hsl(var(--color-mastered)/0.08)]',
    border: 'border-[hsl(var(--color-mastered)/0.3)]'
  }
}

export function PathPreview({ nodes, edges, annotations, className }: PathPreviewProps) {
  const annotationMap = new Map(annotations?.map((a) => [a.nodeId, a]) ?? [])

  // BFS to order nodes
  const incomingEdges = new Map<string, number>()
  for (const edge of edges) {
    incomingEdges.set(edge.targetNodeId, (incomingEdges.get(edge.targetNodeId) ?? 0) + 1)
  }

  const rootNodes = nodes.filter((n) => !incomingEdges.has(n.id))
  const visited = new Set<string>()
  const orderedNodes: PathNode[] = []
  const queue = [...rootNodes]
  for (const n of queue) visited.add(n.id)

  while (queue.length > 0) {
    const node = queue.shift()!
    orderedNodes.push(node)
    const outEdges = edges.filter((e) => e.sourceNodeId === node.id)
    for (const edge of outEdges) {
      if (!visited.has(edge.targetNodeId)) {
        visited.add(edge.targetNodeId)
        const target = nodes.find((n) => n.id === edge.targetNodeId)
        if (target) queue.push(target)
      }
    }
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-[hsl(var(--color-primary))]" />
          <h3 className="font-display text-sm font-semibold text-[hsl(var(--color-text))]">Student preview</h3>
        </div>
        <p className="mt-1 text-xs text-[hsl(var(--color-text-secondary))]">
          This is how the path appears to a student.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {nodes.length === 0 ? (
          <p className="py-8 text-center text-sm text-[hsl(var(--color-text-muted))]">
            No nodes in this path yet.
          </p>
        ) : (
          <div className="relative space-y-3">
            {/* Vertical connector line */}
            <div className="absolute left-[15px] top-3 h-[calc(100%-24px)] w-0.5 bg-[hsl(var(--color-border))]" />

            {orderedNodes.map((node, idx) => {
              const ann = annotationMap.get(node.id)
              const config = ann ? statusConfig[ann.status] : statusConfig.available
              const Icon = config.icon

              return (
                <div key={node.id} className="relative flex items-start gap-3">
                  {/* Status indicator */}
                  <div
                    className={cn(
                      'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                      config.border,
                      config.bg
                    )}
                  >
                    <Icon className={cn('h-4 w-4', config.color)} />
                  </div>

                  {/* Node card */}
                  <div
                    className={cn(
                      'flex-1 rounded-[var(--radius-lg)] border p-3',
                      config.border,
                      config.bg
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[hsl(var(--color-text))]">{node.label}</p>
                      <span className={cn('text-[10px] font-semibold uppercase', config.color)}>
                        {config.label}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-[hsl(var(--color-text-muted))]">
                      <span>Step {idx + 1}</span>
                      {ann?.studentScore != null && (
                        <>
                          <span>·</span>
                          <span>Score: {ann.studentScore}%</span>
                        </>
                      )}
                      {node.difficulty != null && (
                        <>
                          <span>·</span>
                          <span>Difficulty: {node.difficulty}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
