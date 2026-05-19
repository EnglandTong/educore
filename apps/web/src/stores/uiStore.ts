import { create } from 'zustand'

export type ThemePreference = 'light' | 'dark' | 'auto'

interface UiState {
  sidebarOpen: boolean
  theme: ThemePreference
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (t: ThemePreference) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: true,
  theme: 'auto',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  setTheme: (theme) => {
    document.documentElement.dataset.theme = theme
    set({ theme })
  },
}))
