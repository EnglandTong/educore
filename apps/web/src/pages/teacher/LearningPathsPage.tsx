import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Archive, Globe, FileEdit } from 'lucide-react'

import { fetchLearningPaths, createLearningPath, deleteLearningPath, archiveLearningPath, publishLearningPath } from '@/api/learningPath'
import type { LearningPath } from '@/api/learningPath'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Input } from '@/components/ui/Input'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { teacherLearningPathEditorPath } from '@/router/routes'
import { cn } from '@/utils/cn'

const statusColors: Record<string, string> = {
  draft: 'bg-[hsl(var(--color-border)/0.45)] text-[hsl(var(--color-text-secondary))]',
  published: 'bg-[hsl(var(--color-proficient)/0.15)] text-[hsl(var(--color-proficient))]',
  archived: 'bg-[hsl(var(--color-text-muted)/0.15)] text-[hsl(var(--color-text-muted))]'
}

function PathCard({
  path,
  onEdit,
  onPublish,
  onArchive,
  onDelete
}: {
  path: LearningPath
  onEdit: () => void
  onPublish: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  return (
    <Card variant="interactive" className="group flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))] truncate">
              {path.title}
            </h3>
            <span className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase',
              statusColors[path.status]
            )}>
              {path.status}
            </span>
          </div>
          {path.description ? (
            <p className="mt-1 text-sm text-[hsl(var(--color-text-secondary))] line-clamp-2">
              {path.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-[hsl(var(--color-text-muted))]">
        <span>{path.nodeCount ?? 0} nodes</span>
        <span>·</span>
        <span>{path.edgeCount ?? 0} connections</span>
        {path.assignedClassIds.length > 0 && (
          <>
            <span>·</span>
            <span>{path.assignedClassIds.length} class(es)</span>
          </>
        )}
        {path.updatedAt && (
          <>
            <span>·</span>
            <span>Updated {new Date(path.updatedAt).toLocaleDateString()}</span>
          </>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
          <FileEdit className="h-3.5 w-3.5" />
          Edit
        </Button>
        {path.status === 'draft' ? (
          <Button type="button" variant="primary" size="sm" onClick={onPublish}>
            <Globe className="h-3.5 w-3.5" />
            Publish
          </Button>
        ) : path.status === 'published' ? (
          <Button type="button" variant="secondary" size="sm" onClick={onArchive}>
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
        ) : null}
        <Button type="button" variant="ghost" size="sm" onClick={onDelete} className="ml-auto">
          <Trash2 className="h-3.5 w-3.5 text-[hsl(var(--color-error))]" />
        </Button>
      </div>
    </Card>
  )
}

export function LearningPathsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<LearningPath | null>(null)

  const { data: paths, isLoading, isError, refetch } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: fetchLearningPaths
  })

  const createMutation = useMutation({
    mutationFn: () => createLearningPath({ title: newTitle, description: newDescription || undefined }),
    onSuccess: (result) => {
      setShowCreateModal(false)
      setNewTitle('')
      setNewDescription('')
      void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
      if (result) {
        navigate(teacherLearningPathEditorPath(result.id))
      }
    }
  })

  const publishMutation = useMutation({
    mutationFn: (path: LearningPath) => publishLearningPath(path.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
  })

  const archiveMutation = useMutation({
    mutationFn: (path: LearningPath) => archiveLearningPath(path.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
  })

  const deleteMutation = useMutation({
    mutationFn: (path: LearningPath) => deleteLearningPath(path.id),
    onSuccess: () => {
      setDeleteTarget(null)
      void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
            Learning paths
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
            Design custom learning journeys for your students — drag, connect, and publish your own curriculum paths.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => setShowCreateModal(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          New path
        </Button>
      </div>

      {isError ? (
        <WarmQueryError
          title="Learning paths could not load"
          description="Something went wrong on our end while fetching your paths — your drafts are safe."
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : !paths || paths.length === 0 ? (
        <EmptyState
          title="No learning paths yet"
          description="Start designing your first custom learning journey — it's as simple as dragging a skill onto a canvas."
          action={
            <Button type="button" variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Create your first path
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {paths.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              onEdit={() => navigate(teacherLearningPathEditorPath(path.id))}
              onPublish={() => publishMutation.mutate(path)}
              onArchive={() => archiveMutation.mutate(path)}
              onDelete={() => setDeleteTarget(path)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        open={showCreateModal}
        title="New learning path"
        description="Give your path a name and optional description to get started."
        onClose={() => { setShowCreateModal(false); setNewTitle(''); setNewDescription('') }}
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setShowCreateModal(false); setNewTitle(''); setNewDescription('') }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!newTitle.trim() || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending ? 'Creating...' : 'Create path'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Path title"
            placeholder="e.g., Grade 5 Algebra Foundations"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[hsl(var(--color-text-secondary))]">
              Description (optional)
            </label>
            <textarea
              placeholder="A short description of what this path covers..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3 text-[hsl(var(--color-text))] shadow-inner transition-[border-color,box-shadow] duration-[var(--transition-fast)] placeholder:text-[hsl(var(--color-text-muted))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.25)]"
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={deleteTarget != null}
        title="Delete learning path?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget) }}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete permanently'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">
          This will permanently remove this learning path and all its nodes and connections.
        </p>
      </Modal>
    </div>
  )
}
