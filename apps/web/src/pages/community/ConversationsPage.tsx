import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

import { fetchConversations } from '@/api/community'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import type { Conversation } from '@/types'
import { cn } from '@/utils/cn'

export type ConversationsVariant = 'parent' | 'teacher'

function threadPath(variant: ConversationsVariant, id: string): string {
  return variant === 'parent'
    ? `/parent/messages/${encodeURIComponent(id)}`
    : `/teacher/conversations/${encodeURIComponent(id)}`
}

export interface ConversationsPageProps {
  variant: ConversationsVariant
}

export function ConversationsPage({ variant }: ConversationsPageProps) {
  const { data: rows = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['community-conversations', variant],
    queryFn: fetchConversations,
  })

  const title = variant === 'parent' ? 'Notes from school' : 'Family conversations'
  const subtitle =
    variant === 'parent'
      ? 'Teachers reach out here with encouragement first — never surprises hidden in fine print.'
      : 'Keep every family loop kind, clear, and unhurried — one thread at a time.'

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Community</p>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">{title}</h1>
        <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">{subtitle}</p>
      </div>

      {isError ? (
        <WarmQueryError
          title="We could not load conversations"
          description="Something went wrong on our end — your threads are still safe; a retry usually reconnects."
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No conversations yet — and that is okay"
          description="When someone sends the first warm note, it will land here with space to breathe and reply in your own time."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((c: Conversation) => (
            <li key={c.id}>
              <Link to={threadPath(variant, c.id)} className="block">
                <Card
                  variant="interactive"
                  className={cn(
                    'flex items-start gap-3',
                    c.unreadCount > 0 && 'border-[hsl(var(--color-primary)/0.35)] bg-[hsl(var(--color-primary)/0.04)]',
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-secondary-light))] text-[hsl(var(--color-primary))]">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[hsl(var(--color-text))]">{c.studentName}</p>
                      {c.unreadCount > 0 ? (
                        <span className="rounded-full bg-[hsl(var(--color-primary))] px-2 py-1 text-sm font-semibold text-[hsl(var(--color-surface))]">
                          {c.unreadCount} new
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-[hsl(var(--color-text-muted))]">
                      {variant === 'parent' ? `With ${c.teacherName}` : `With ${c.parentName}`}
                    </p>
                    {c.lastMessage ? (
                      <p className="mt-2 line-clamp-2 text-sm text-[hsl(var(--color-text-secondary))]">{c.lastMessage}</p>
                    ) : (
                      <p className="mt-2 text-sm italic text-[hsl(var(--color-text-muted))]">A fresh thread — say hello when you are ready.</p>
                    )}
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
