import { Trash2, Plus, X } from 'lucide-react'

import type { PathNode, PathEdge } from '@/api/learningPath'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export interface NodeInspectorProps {
  node: PathNode
  nodes: PathNode[]
  edges: PathEdge[]
  onUpdateNode: (nodeId: string, partial: Partial<PathNode>) => void
  onRemoveNode: (nodeId: string) => void
  onRemoveEdge: (edgeId: string) => void
  className?: string
}

const nodeTypes: Array<{ value: PathNode['type']; label: string }> = [
  { value: 'skill', label: 'Skill' },
  { value: 'module', label: 'Module' },
  { value: 'condition', label: 'Condition' },
  { value: 'review', label: 'Review' },
  { value: 'challenge', label: 'Challenge' }
]

export function NodeInspector({
  node,
  nodes,
  edges,
  onUpdateNode,
  onRemoveNode,
  onRemoveEdge,
  className
}: NodeInspectorProps) {
  const incomingEdges = edges.filter((e) => e.targetNodeId === node.id)
  const outgoingEdges = edges.filter((e) => e.sourceNodeId === node.id)

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="px-4 pt-4">
        <h3 className="font-display text-sm font-semibold text-[hsl(var(--color-text))]">Node settings</h3>
      </div>

      <div className="space-y-4 px-4 pb-4">
        {/* Label */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[hsl(var(--color-text-secondary))]">Label</label>
          <input
            type="text"
            value={node.label}
            onChange={(e) => onUpdateNode(node.id, { label: e.target.value })}
            className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-text))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.25)]"
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[hsl(var(--color-text-secondary))]">Type</label>
          <select
            value={node.type}
            onChange={(e) => onUpdateNode(node.id, { type: e.target.value as PathNode['type'] })}
            className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-text))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.25)]"
          >
            {nodeTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[hsl(var(--color-text-secondary))]">
            Difficulty: <span className="font-semibold text-[hsl(var(--color-primary))]">{node.difficulty ?? 50}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={node.difficulty ?? 50}
            onChange={(e) => onUpdateNode(node.id, { difficulty: Number(e.target.value) })}
            className="w-full accent-[hsl(var(--color-primary))]"
          />
          <div className="flex justify-between text-[10px] text-[hsl(var(--color-text-muted))]">
            <span>Easy</span>
            <span>Hard</span>
          </div>
        </div>

        {/* Incoming connections */}
        {incomingEdges.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[hsl(var(--color-text-secondary))]">
              Incoming connections ({incomingEdges.length})
            </label>
            <div className="space-y-1">
              {incomingEdges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.sourceNodeId)
                return (
                  <div
                    key={edge.id}
                    className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--color-border)/0.25)] px-3 py-1.5 text-xs"
                  >
                    <span className="text-[hsl(var(--color-text-secondary))]">
                      From: <span className="font-medium text-[hsl(var(--color-text))]">{sourceNode?.label ?? 'Unknown'}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Outgoing connections */}
        {outgoingEdges.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[hsl(var(--color-text-secondary))]">
              Outgoing connections ({outgoingEdges.length})
            </label>
            <div className="space-y-1">
              {outgoingEdges.map((edge) => {
                const targetNode = nodes.find((n) => n.id === edge.targetNodeId)
                return (
                  <div
                    key={edge.id}
                    className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--color-border)/0.25)] px-3 py-1.5 text-xs"
                  >
                    <span className="text-[hsl(var(--color-text-secondary))]">
                      To: <span className="font-medium text-[hsl(var(--color-text))]">{targetNode?.label ?? 'Unknown'}</span>
                      {edge.condition && edge.condition.type !== 'always' && (
                        <span className="ml-1 text-[hsl(var(--color-growing))]">
                          ({edge.condition.type === 'score_above' ? '≥' : '<'}{edge.condition.threshold})
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveEdge(edge.id)}
                      className="rounded p-0.5 text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-error))] transition-colors"
                      aria-label="Remove connection"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Branching rules */}
        {node.branches.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[hsl(var(--color-text-secondary))]">
              Branching rules ({node.branches.length})
            </label>
            <div className="space-y-1">
              {node.branches.map((branch, idx) => (
                <div
                  key={idx}
                  className="rounded-[var(--radius-md)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[hsl(var(--color-text))]">
                      {branch.operator === 'gte' ? '≥' : branch.operator === 'lt' ? '<' : '='}{branch.thresholdScore} → {branch.targetNodeId.slice(0, 8)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateNode(node.id, {
                          branches: node.branches.filter((_, i) => i !== idx)
                        })
                      }}
                      className="rounded p-0.5 text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-error))]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              /* Branch form would open here */
            }}
            className="flex-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add branch
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onRemoveNode(node.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
