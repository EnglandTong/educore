import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import { ToastViewport } from '@/components/ui/Toast'
import { AppRouter } from '@/router'
import { useUiStore } from '@/stores/uiStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function ThemeBootstrap() {
  const theme = useUiStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeBootstrap />
        <AppRouter />
        <ToastViewport />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
