import { Skeleton } from '@/components/ui/Skeleton'

/** Shown while lazy route chunks load — warm, never abrupt. */
export function RouteFallback() {
  return (
    <div className="space-y-6 py-4" role="status" aria-live="polite" aria-busy="true">
      <p className="text-center text-sm text-[hsl(var(--color-text-secondary))]">Gathering this page with a little extra care…</p>
      <div className="space-y-3">
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
