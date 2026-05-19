import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  message?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastItem[]
  pushToast: (t: Omit<ToastItem, 'id'> & { id?: string }) => void
  dismissToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (t) => {
    const id = t.id ?? crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    const duration = t.variant === 'error' ? 6000 : 4000
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
    }, duration)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))
