import type { ReactNode } from 'react'

import { Outlet } from 'react-router-dom'

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/utils/cn'

function MobileDrawer({
  children,
  open,
  onClose,
}: {
  children: ReactNode
  open: boolean
  onClose: () => void
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 md:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      <button
        type="button"
        className={cn(
          'absolute inset-0 bg-[hsl(var(--color-text)/0.35)] transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-[min(18rem,88vw)] overflow-y-auto border-r border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4 shadow-[var(--shadow-lg)] transition-transform duration-[var(--transition-base)]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function RoleShell({ role }: { role: 'student' | 'parent' | 'teacher' | 'volunteer' | 'school-admin' }) {
  const open = useUiStore((s) => s.sidebarOpen)
  const setOpen = useUiStore((s) => s.setSidebarOpen)

  return (
    <div className="flex min-h-dvh bg-[hsl(var(--color-bg))]">
      <Sidebar role={role} variant="dock" />
      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <button
          type="button"
          className="mb-4 text-sm font-medium text-[hsl(var(--color-primary))]"
          onClick={() => setOpen(false)}
        >
          Close menu
        </button>
        <Sidebar role={role} variant="drawer" onNavigate={() => setOpen(false)} />
      </MobileDrawer>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function StudentLayout() {
  return <RoleShell role="student" />
}

export function ParentLayout() {
  return <RoleShell role="parent" />
}

export function TeacherLayout() {
  return <RoleShell role="teacher" />
}

export function VolunteerLayout() {
  return <RoleShell role="volunteer" />
}

export function SchoolAdminLayout() {
  return <RoleShell role="school-admin" />
}
