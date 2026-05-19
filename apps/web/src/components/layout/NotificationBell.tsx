import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'

import { fetchNotifications, markNotificationRead } from '@/api/notifications'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

function formatWhen(iso?: string): string {
  if (!iso) return 'Just now'
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export function NotificationBell() {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: items = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 60_000,
  })

  const unread = items.filter((n) => !n.read).length
  const checking = isLoading || (isFetching && items.length === 0)

  const readOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="relative inline-flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full text-[hsl(var(--color-text-secondary))] transition-[background-color,transform] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-border)/0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.25)] active:scale-[0.98]"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        aria-busy={checking}
        title={checking ? 'Checking for updates…' : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5 shrink-0" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[hsl(var(--color-primary))] px-1.5 text-xs font-bold leading-none text-[hsl(var(--color-surface))]">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-[var(--transition-base)]"
        >
          <div className="border-b border-[hsl(var(--color-border))] px-4 py-3">
            <p className="font-display text-sm font-semibold text-[hsl(var(--color-text))]">Little nudges for you</p>
            <p className="text-sm text-[hsl(var(--color-text-muted))]">Nothing here is urgent shame — only kind check-ins.</p>
          </div>
          <div className="max-h-[min(20rem,70dvh)] overflow-y-auto">
            {checking ? (
              <p className="px-4 py-6 text-center text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
                Checking for updates…
              </p>
            ) : isError ? (
              <div className="space-y-3 px-4 py-6 text-center">
                <p className="text-sm font-semibold text-[hsl(var(--color-text))]">We could not reach your notices</p>
                <p className="text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
                  Something went wrong on our end — a gentle retry often reconnects the thread.
                </p>
                <Button type="button" variant="secondary" size="sm" className="min-h-[44px]" onClick={() => void refetch()}>
                  Try again
                </Button>
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
                You are all caught up — we will ping softly when something new drifts in.
              </p>
            ) : (
              <ul>
                {items.map((n) => (
                  <li key={n.id} className="border-b border-[hsl(var(--color-border)/0.5)] last:border-b-0">
                    <button
                      type="button"
                      className={cn(
                        'flex min-h-[44px] w-full flex-col gap-1 px-4 py-3 text-left text-sm transition-[background-color] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-primary)/0.06)]',
                        !n.read && 'bg-[hsl(var(--color-primary)/0.04)]',
                      )}
                      onClick={() => {
                        if (!n.read) readOne.mutate(n.id)
                      }}
                    >
                      <span className="font-semibold text-[hsl(var(--color-text))]">{n.title}</span>
                      {n.body ? <span className="text-[hsl(var(--color-text-secondary))]">{n.body}</span> : null}
                      <span className="text-sm text-[hsl(var(--color-text-muted))]">{formatWhen(n.createdAt)}</span>
                      {!n.read ? (
                        <span className="text-sm font-semibold text-[hsl(var(--color-primary))]">Tap to tuck away as read</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t border-[hsl(var(--color-border))] px-3 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-[44px] w-full"
              onClick={() => setOpen(false)}
            >
              Close softly
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
