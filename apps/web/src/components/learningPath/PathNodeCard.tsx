import { GripVertical, Trash2 } from 'lucide-react'
import type { PathNode } from '@/api/learningPath'
import { cn } from '@/utils/cn'

export interface PathNodeCardProps {
  node: PathNode
  isSelected: boolean
  isPreviewMode: boolean
  previewStatus?: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
  onSelect: (nodeId: string) => void
  onDelete: (nodeId: string) => void
  onStartConnect: (nodeId: string) => void
  onDragEnd?: (nodeId: string, x: number, y: number) => void
}

const typeIcons: Record<string, string> = {
  skill: '◈',
  module: '◉',
  condition: '◇',
  review: '◎',
  challenge: '★'
}

const typeColors: Record<string, string> = {
  skill: 'border-l-[hsl(var(--color-primary))]',
  module: 'border-l-[hsl(var(--color-proficient))]',
  condition: 'border-l-[hsl(var(--color-growing))]',
  review: 'border-l-[hsl(var(--color-secondary))]',
  challenge: 'border-l-[hsl(var(--color-error))]'
}

const previewColors: Record<string, string> = {
  locked: 'opacity-50 bg-[hsl(var(--color-border)/0.35)]',
  available: 'ring-2 ring-[hsl(var(--color-primary)/0.35)]',
  in_progress: 'ring-2 ring-[hsl(var(--color-growing))]',
  completed: 'ring-2 ring-[hsl(var(--color-proficient))]',
  mastered: 'ring-2 ring-[hsl(var(--color-mastered))]'
}

export function PathNodeCard({
  node,
  isSelected,
  isPreviewMode,
  previewStatus,
  onSelect,
  onDelete,
  onStartConnect,
  onDragEnd
}: PathNodeCardProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const startX = e.clientX
    const startY = e.clientY
    const nodeStartX = node.positionX
    const nodeStartY = node.positionY

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      if (onDragEnd) {
        onDragEnd(node.id, nodeStartX + dx, nodeStartY + dy)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className={cn(
        'absolute flex w-52 cursor-pointer flex-col rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-3 shadow-[var(--shadow-md)] transition-shadow hover:shadow-[var(--shadow-lg)]',
        'border-l-4',
        typeColors[node.type] ?? typeColors.skill,
        isSelected && 'ring-2 ring-[hsl(var(--color-primary))]',
        isPreviewMode && previewStatus && previewColors[previewStatus],
        isPreviewMode && previewStatus === 'locked' && 'cursor-not-allowed'
      )}
      style={{ left: node.positionX, top: node.positionY }}
      onClick={() => onSelect(node.id)}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2"
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-[hsl(var(--color-text-muted))] active:cursor-grabbing" />
          <span className="text-sm font-medium text-[hsl(var(--color-text))] truncate">
            {node.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {node.difficulty != null && (
            <span className="inline-flex items-center rounded-full bg-[hsl(var(--color-primary)/0.1)] px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--color-primary))]">
              {node.difficulty}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(node.id) }}
            className="rounded-full p-1 text-[hsl(var(--color-text-muted))] hover:bg-[hsl(var(--color-error)/0.1)] hover:text-[hsl(var(--color-error))] transition-colors"
            aria-label={`Delete ${node.label}`}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-[hsl(var(--color-text-muted))]">
        <span>{typeIcons[node.type] ?? '●'} {node.type}</span>
        {node.skillId && (
          <>
            <span className="text-[hsl(var(--color-border))]">|</span>
            <span className="truncate">{node.skillId}</span>
          </>
        )}
      </div>

      {/* Connection port */}
      <button
        type="button"
        className={cn(
          'absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] text-[hsl(var(--color-text-muted))]',
          'hover:border-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary))] transition-colors'
        )}
        onClick={(e) => { e.stopPropagation(); onStartConnect(node.id) }}
        title="Connect to another node"
        aria-label={`Connect ${node.label}`}
      >
        <span className="flex h-full items-center justify-center text-[10px] font-bold">+</span>
      </button>
    </div>
  )
}
