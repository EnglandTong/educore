import { useCallback, useRef, useState } from 'react'
import { Layers } from 'lucide-react'

import type { PathNode, PathEdge } from '@/api/learningPath'
import { PathNodeCard } from './PathNodeCard'
import { cn } from '@/utils/cn'

export interface PathCanvasProps {
  nodes: PathNode[]
  edges: PathEdge[]
  selectedNodeId: string | null
  isPreviewMode: boolean
  onSelectNode: (nodeId: string | null) => void
  onUpdateNodePosition: (nodeId: string, x: number, y: number) => void
  onDeleteNode: (nodeId: string) => void
  onDeleteEdge: (edgeId: string) => void
  onCreateEdge: (sourceNodeId: string, targetNodeId: string) => void
  onCanvasDrop: (x: number, y: number, data: string) => void
  className?: string
}

export function PathCanvas({
  nodes,
  edges,
  selectedNodeId,
  isPreviewMode,
  onSelectNode,
  onUpdateNodePosition,
  onDeleteNode,
  onDeleteEdge: _onDeleteEdge,
  onCreateEdge,
  onCanvasDrop,
  className
}: PathCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (!data || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 104 // center of 208px wide card
    const y = e.clientY - rect.top - 40 // center of ~80px tall card
    onCanvasDrop(Math.max(0, x), Math.max(0, y), data)
  }, [onCanvasDrop])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset?.canvas === 'true') {
      onSelectNode(null)
    }
  }, [onSelectNode])

  const handleStartConnect = useCallback((nodeId: string) => {
    setConnectingFrom(nodeId)
  }, [])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (connectingFrom && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }, [connectingFrom])

  const handleCanvasClickForConnect = useCallback((e: React.MouseEvent) => {
    if (!connectingFrom) return
    // Check if clicking on a node to connect to
    const target = (e.target as HTMLElement).closest('[data-node-id]')
    if (target) {
      const targetId = target.getAttribute('data-node-id')
      if (targetId && targetId !== connectingFrom) {
        onCreateEdge(connectingFrom, targetId)
      }
    }
    setConnectingFrom(null)
  }, [connectingFrom, onCreateEdge])

  const handleNodeClick = useCallback((nodeId: string) => {
    if (connectingFrom && nodeId !== connectingFrom) {
      onCreateEdge(connectingFrom, nodeId)
      setConnectingFrom(null)
    } else {
      onSelectNode(nodeId)
    }
  }, [connectingFrom, onCreateEdge, onSelectNode])

  // Calculate edge paths (simple straight lines between node centers)
  const getEdgePath = (edge: PathEdge) => {
    const source = nodes.find((n) => n.id === edge.sourceNodeId)
    const target = nodes.find((n) => n.id === edge.targetNodeId)
    if (!source || !target) return null

    const x1 = source.positionX + 104
    const y1 = source.positionY + 48
    const x2 = target.positionX + 104
    const y2 = target.positionY

    return `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
  }

  const canvasWidth = Math.max(1200, ...nodes.map((n) => n.positionX + 300))
  const canvasHeight = Math.max(800, ...nodes.map((n) => n.positionY + 200))

  return (
    <div
      ref={canvasRef}
      data-canvas="true"
      className={cn(
        'relative overflow-auto rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))]',
        isPreviewMode && 'cursor-default',
        !isPreviewMode && connectingFrom && 'cursor-crosshair',
        className
      )}
      style={{ minHeight: 400 }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={(e) => {
        handleCanvasClick(e)
        handleCanvasClickForConnect(e)
      }}
      onMouseMove={handleCanvasMouseMove}
    >
      {nodes.length === 0 && !connectingFrom ? (
        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 p-10 text-center">
          <Layers className="h-10 w-10 text-[hsl(var(--color-text-muted))]" />
          <div>
            <p className="text-sm font-medium text-[hsl(var(--color-text))]">Your canvas is empty</p>
            <p className="mt-1 text-xs text-[hsl(var(--color-text-secondary))]">
              Drag skills from the palette onto this canvas to build your learning path.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ width: canvasWidth, height: canvasHeight, position: 'relative' }}>
          {/* SVG layer for edges */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ overflow: 'visible' }}
          >
            {edges.map((edge) => {
              const path = getEdgePath(edge)
              if (!path) return null
              const isHighlighted = selectedNodeId && (edge.sourceNodeId === selectedNodeId || edge.targetNodeId === selectedNodeId)
              return (
                <path
                  key={edge.id}
                  d={path}
                  fill="none"
                  stroke={isHighlighted ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={edge.condition?.type !== 'always' ? '6 3' : undefined}
                  className="transition-colors"
                />
              )
            })}
            {/* Temporary connection line */}
            {connectingFrom && (
              <line
                x1={nodes.find((n) => n.id === connectingFrom)!.positionX + 104}
                y1={nodes.find((n) => n.id === connectingFrom)!.positionY + 48}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="hsl(var(--color-primary))"
                strokeWidth={2}
                strokeDasharray="6 3"
                opacity={0.6}
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div key={node.id} data-node-id={node.id}>
              <PathNodeCard
                node={node}
                isSelected={selectedNodeId === node.id}
                isPreviewMode={isPreviewMode}
                onSelect={handleNodeClick}
                onDelete={onDeleteNode}
                onStartConnect={handleStartConnect}
                onDragEnd={!isPreviewMode ? onUpdateNodePosition : undefined}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
