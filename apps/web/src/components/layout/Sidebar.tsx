import { BookMarked, CloudSun, Dumbbell, Home, LineChart, Megaphone, MessageCircle, Sparkles, Heart, Bot, Users, GraduationCap, GitBranch } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import type { UserRole } from '@/types'
import { cn } from '@/utils/cn'

const studentLinks = [
  { to: '/student/dashboard', label: 'Home', icon: Home },
  { to: '/student/checkin', label: 'Daily weather', icon: CloudSun },
  { to: '/student/diagnostic', label: 'Discovery', icon: Sparkles },
  { to: '/student/training', label: 'Practice', icon: Dumbbell },
  { to: '/student/progress', label: 'Progress', icon: LineChart },
  { to: '/student/wrong-answers', label: 'Review notes', icon: BookMarked },
  { to: '/student/heart', label: 'Heart space', icon: Heart },
  { to: '/student/ai-tutor', label: 'AI Tutor', icon: Bot },
]

const parentLinks = [
  { to: '/parent/dashboard', label: 'Home', icon: Home },
  { to: '/parent/announcements', label: 'Bulletin', icon: Megaphone },
  { to: '/parent/messages', label: 'Notes from school', icon: MessageCircle },
]

const teacherLinks = [
  { to: '/teacher/dashboard', label: 'Home', icon: Home },
  { to: '/teacher/class', label: 'Class insights', icon: LineChart },
  { to: '/teacher/announcements', label: 'Bulletin', icon: Megaphone },
  { to: '/teacher/conversations', label: 'Conversations', icon: MessageCircle },
  { to: '/teacher/learning-paths', label: 'Learning paths', icon: GitBranch },
]

const volunteerLinks = [
  { to: '/volunteer/dashboard', label: 'Dashboard', icon: Home },
  { to: '/volunteer/qa', label: 'Q&A Board', icon: MessageCircle },
  { to: '/volunteer/profile', label: 'My Profile', icon: Users },
]

const adminLinks = [
  { to: '/admin/school', label: 'School', icon: GraduationCap },
  { to: '/admin/school/students', label: 'Students', icon: Users },
  { to: '/admin/school/teachers', label: 'Teachers', icon: Users },
]

function linksForRole(role: UserRole) {
  if (role === 'student') return studentLinks
  if (role === 'parent') return parentLinks
  if (role === 'teacher') return teacherLinks
  if (role === 'volunteer') return volunteerLinks
  if (role === 'school-admin') return adminLinks
  return studentLinks
}

export interface SidebarProps {
  role: UserRole
  onNavigate?: () => void
  /** `dock` hides on small screens; `drawer` shows for the mobile drawer */
  variant?: 'dock' | 'drawer'
}

export function Sidebar({ role, onNavigate, variant = 'dock' }: SidebarProps) {
  const items = linksForRole(role)
  return (
    <aside
      className={cn(
        'w-64 shrink-0 bg-[hsl(var(--color-surface))] p-4',
        variant === 'dock' && 'hidden border-r border-[hsl(var(--color-border))] md:block',
        variant === 'drawer' && 'block border-0 md:hidden',
      )}
    >
      <div className="mb-6 rounded-[var(--radius-xl)] bg-[hsl(var(--color-primary)/0.08)] p-4 text-sm text-[hsl(var(--color-text-secondary))]">
        <p className="font-display font-semibold text-[hsl(var(--color-text))]">Your cozy corner</p>
        <p className="mt-1">Everything you need, gently organized.</p>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[hsl(var(--color-primary)/0.12)] text-[hsl(var(--color-primary-dark))]'
                  : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/0.35)]',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
