import { Navigate, Outlet } from 'react-router-dom'

import { HydrationFallback } from '@/components/shared/HydrationFallback'
import { useAuthHydration } from '@/hooks/useAuthHydration'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types'

export function RequireAuth() {
  const hydrated = useAuthHydration()
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)

  if (!hydrated) return <HydrationFallback />
  if (!user || !accessToken) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}

export function RequireRole({ role }: { role: UserRole }) {
  const hydrated = useAuthHydration()
  const user = useAuthStore((s) => s.user)
  if (!hydrated) return <HydrationFallback />
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }
  if (user.role !== role) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}

export function GuestOnly() {
  const hydrated = useAuthHydration()
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  if (!hydrated) return <HydrationFallback />
  if (user && accessToken) {
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
    if (user.role === 'parent') return <Navigate to="/parent/dashboard" replace />
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}
