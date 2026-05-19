import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { fetchConversationMessages, postConversationMessage } from '@/api/community'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { useToastStore } from '@/stores/toastStore'
import type { Message } from '@/types'
import { cn } from '@/utils/cn'

export type ConversationThreadVariant = 'parent' | 'teacher'

function listHref(variant: ConversationThreadVariant): string {
  return variant === 'parent' ? '/parent/messages' : '/teacher/conversations'
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export interface ConversationThreadPageProps {
  variant: ConversationThreadVariant
}

export function ConversationThreadPage({ variant }: ConversationThreadPageProps) {
  const { conversationId } = useParams<{ conversationId: string }>()
  const id = conversationId ?? ''
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pushToast = useToastStore((s) => s.pushToast)
  const [draft, setDraft] = useState('')

  const messagesQuery = useQuery({
    queryKey: ['community-messages', id],
    queryFn: () => fetchConversationMessages(id),
    enabled: Boolean(id),
  })

  const send = useMutation({
    mutationFn: (content: string) => postConversationMessage(id, content),
    onSuccess: () => {
      setDraft('')
      void queryClient.invalidateQueries({ queryKey: ['community-messages', id] })
      void queryClient.invalidateQueries({ queryKey: ['community-conversations'] })
      pushToast({
        variant: 'success',
        title: 'Sent with care',
        message: 'Your words are on their way — thank you for staying in the loop so kindly.',
      })
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'Not sent just yet',
        message: 'The line flickered — try again in a moment, or rest if you need to.',
      })
    },
  })

  if (!id) {
    return (
      <EmptyState
        title="We could not find that thread"
        description="Head back to your messages and choose a conversation — we will be right here."
        action={
          <Button type="button" variant="primary" onClick={() => navigate(listHref(variant))}>
            Back to messages
          </Button>
        }
      />
    )
  }

  const rows = messagesQuery.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={listHref(variant)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--color-primary))] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all threads
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-[hsl(var(--color-text))]">Conversation</h1>
        <p className="mt-2 text-[hsl(var(--color-text-secondary))]">
          Speak plainly, lead with warmth, and give everyone room to reply without rush.
        </p>
      </div>

      {messagesQuery.isError ? (
        <WarmQueryError
          title="Messages could not load"
          description="Something went wrong on our end — your thread is still there; a retry usually reconnects the words."
          onRetry={() => void messagesQuery.refetch()}
        />
      ) : messagesQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="This thread is still waking up"
          description="Say hello below — the first gentle message often makes the whole conversation feel safer."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((m: Message) => (
            <li key={m.id}>
              <Card className={cn(m.senderRole === 'teacher' ? 'border-l-4 border-l-[hsl(var(--color-primary))]' : 'border-l-4 border-l-[hsl(var(--color-secondary))]')}>
                <p className="text-xs font-semibold text-[hsl(var(--color-text-muted))]">
                  {m.senderName} · {formatWhen(m.sentAt)}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[hsl(var(--color-text))]">{m.content}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Card className="space-y-3">
        <label className="block text-sm font-semibold text-[hsl(var(--color-text))]" htmlFor="reply-draft">
          Your reply
        </label>
        <textarea
          id="reply-draft"
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share an update, a question, or a little encouragement…"
          className="w-full min-h-[120px] rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-3 py-3 text-sm leading-relaxed text-[hsl(var(--color-text))] shadow-[var(--shadow-sm)] outline-none ring-[hsl(var(--color-primary)/0.35)] transition-[box-shadow] duration-[var(--transition-fast)] focus-visible:ring-4"
        />
        <Button
          type="button"
          variant="primary"
          className="min-h-[44px]"
          disabled={!draft.trim() || send.isPending}
          onClick={() => send.mutate(draft.trim())}
        >
          {send.isPending ? 'Sending…' : 'Send with kindness'}
        </Button>
        <p className="text-xs text-[hsl(var(--color-text-muted))]">
          If the server is still learning this path, your note might bounce — we will toast either way so you are never guessing.
        </p>
      </Card>
    </div>
  )
}
