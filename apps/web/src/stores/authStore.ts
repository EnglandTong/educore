import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { UserProfile } from '@/types'

interface AuthState {
  user: UserProfile | null
  accessToken: string | null
  refreshToken: string | null
  setSession: (user: UserProfile, accessToken: string, refreshToken: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'educore-auth' },
  ),
)
