import { LogOut, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { formatDisplayName } from '@/utils/formatters'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const clear = useAuthStore((s) => s.clearSession)
  const toggle = useUiStore((s) => s.toggleSidebar)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface)/0.9)] px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-h-[44px] min-w-[44px] md:hidden"
          aria-label="Open navigation"
          onClick={() => toggle()}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">
          EduCore
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <LanguageSwitcher />
            <NotificationBell />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[hsl(var(--color-text))]">
                {formatDisplayName(user.name)}
              </p>
              <p className="text-sm text-[hsl(var(--color-text-muted))]">Glad you are here today</p>
            </div>
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-[44px] gap-2"
              aria-label="Sign out"
              onClick={() => {
                clear()
                navigate('/auth/login')
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </>
        ) : null}
      </div>
    </header>
  )
}
