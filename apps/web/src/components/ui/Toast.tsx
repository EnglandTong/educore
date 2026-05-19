import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react'

import { useToastStore } from '@/stores/toastStore'
import { cn } from '@/utils/cn'

const icons = {
  success: Sparkles,
  error: Info,
  info: Info,
}

const styles = {
  success: 'border-[hsl(var(--color-success)/0.35)] bg-[hsl(var(--color-success-light))] text-[hsl(var(--color-success))]',
  error: 'border-[hsl(var(--color-error)/0.35)] bg-[hsl(var(--color-error-light))] text-[hsl(var(--color-error))]',
  info: 'border-[hsl(var(--color-primary)/0.25)] bg-[hsl(var(--color-surface))] text-[hsl(var(--color-primary))]',
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismissToast)

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = t.variant === 'success' ? CheckCircle2 : icons[t.variant]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className={cn(
                'pointer-events-auto flex gap-3 rounded-[var(--radius-xl)] border p-4 shadow-[var(--shadow-lg)]',
                styles[t.variant],
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div className="flex-1 text-left">
                <p className="font-semibold">{t.title}</p>
                {t.message ? <p className="mt-1 text-sm opacity-90">{t.message}</p> : null}
              </div>
              <button
                type="button"
                className="rounded-full p-1 transition hover:bg-black/5"
                aria-label="Dismiss message"
                onClick={() => dismiss(t.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
