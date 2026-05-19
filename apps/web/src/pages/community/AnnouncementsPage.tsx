import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Megaphone } from 'lucide-react'

import { fetchAnnouncements, markAnnouncementRead } from '@/api/community'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { useToastStore } from '@/stores/toastStore'
import type { Announcement } from '@/types'
import { cn } from '@/utils/cn'

export type AnnouncementsVariant = 'parent' | 'teacher'

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export interface AnnouncementsPageProps {
  variant: AnnouncementsVariant
}

export function AnnouncementsPage({ variant }: AnnouncementsPageProps) {
  const queryClient = useQueryClient()
  const pushToast = useToastStore((s) => s.pushToast)

  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['community-announcements', variant],
    queryFn: fetchAnnouncements,
  })

  const readMutation = useMutation({
    mutationFn: markAnnouncementRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['community-announcements'] })
      pushToast({
        variant: 'success',
        title: 'Marked as read',
        message: 'We tucked that update away so it does not nudge you twice.',
      })
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'That did not quite land',
        message: 'The bulletin board hiccuped — a gentle retry usually does the trick.',
      })
    },
  })

  const headline =
    variant === 'parent'
      ? 'School news, wrapped in warmth'
      : 'Announcements your families will feel good reading'

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Bulletin</p>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">{headline}</h1>
        <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
          Every note here is meant to inform without alarming — celebrations first, logistics with a soft voice.
        </p>
      </div>

      {isError ? (
        <WarmQueryError
          title="The bulletin board wobbled"
          description="Something went wrong on our end while loading announcements — a retry often steadies things."
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="The board is peacefully quiet"
          description="When your school shares news, celebrations, or gentle reminders, they will appear here like postcards on the fridge."
        />
      ) : (
        <ul className="space-y-4">
          {items.map((a: Announcement) => (
            <li key={a.id}>
              <Card
                className={cn(
                  'space-y-3',
                  a.isRead !== true && 'border-[hsl(var(--color-primary)/0.35)] bg-[hsl(var(--color-primary)/0.04)]',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-primary)/0.12)] text-[hsl(var(--color-primary))]">
                      <Megaphone className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-text-muted))]">
                        {a.authorName} · {formatWhen(a.publishedAt)}
                      </p>
                      <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-text))]">{a.title}</h2>
                    </div>
                  </div>
                  {a.isRead !== true ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={readMutation.isPending && readMutation.variables === a.id}
                      onClick={() => readMutation.mutate(a.id)}
                    >
                      {readMutation.isPending && readMutation.variables === a.id ? 'Saving…' : 'Mark as read'}
                    </Button>
                  ) : null}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
                  {a.content}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
