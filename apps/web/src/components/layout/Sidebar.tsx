import { BookMarked, CloudSun, Dumbbell, Home, LineChart, Megaphone, MessageCircle, Sparkles, Heart, Bot, Users, GraduationCap, GitBranch } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { UserRole } from '@/types'
import { cn } from '@/utils/cn'

const studentLinks = [
  { to: '/student/dashboard', labelKey: 'home', icon: Home },
  { to: '/student/checkin', labelKey: 'dailyWeather', icon: CloudSun },
  { to: '/student/diagnostic', labelKey: 'discovery', icon: Sparkles },
  { to: '/student/training', labelKey: 'practice', icon: Dumbbell },
  { to: '/student/progress', labelKey: 'progress', icon: LineChart },
  { to: '/student/wrong-answers', labelKey: 'reviewNotes', icon: BookMarked },
  { to: '/student/heart', labelKey: 'heartSpace', icon: Heart },
  { to: '/student/ai-tutor', labelKey: 'aiTutor', icon: Bot },
]

const parentLinks = [
  { to: '/parent/dashboard', labelKey: 'home', icon: Home },
  { to: '/parent/announcements', labelKey: 'bulletin', icon: Megaphone },
  { to: '/parent/messages', labelKey: 'schoolNotes', icon: MessageCircle },
]

const teacherLinks = [
  { to: '/teacher/dashboard', labelKey: 'home', icon: Home },
  { to: '/teacher/class', labelKey: 'classInsights', icon: LineChart },
  { to: '/teacher/assignments', labelKey: 'assignments', icon: BookMarked },
  { to: '/teacher/announcements', labelKey: 'bulletin', icon: Megaphone },
  { to: '/teacher/conversations', labelKey: 'conversations', icon: MessageCircle },
  { to: '/teacher/learning-paths', labelKey: 'learningPaths', icon: GitBranch },
]

const volunteerLinks = [
  { to: '/volunteer/dashboard', labelKey: 'dashboard', icon: Home },
  { to: '/volunteer/qa', labelKey: 'qaBoard', icon: MessageCircle },
  { to: '/volunteer/profile', labelKey: 'myProfile', icon: Users },
]

const adminLinks = [
  { to: '/admin/school', labelKey: 'school', icon: GraduationCap },
  { to: '/admin/school/students', labelKey: 'students', icon: Users },
  { to: '/admin/school/teachers', labelKey: 'teachers', icon: Users },
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
  const { t } = useTranslation()
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
        <p className="font-display font-semibold text-[hsl(var(--color-text))]">{t('layout.cozyCorner')}</p>
        <p className="mt-1">{t('layout.cozyCornerDescription')}</p>
      </div>
      <nav className="flex flex-col gap-1" aria-label={t('layout.primaryNavigation')}>
        {items.map(({ to, labelKey, icon: Icon }) => (
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
            {t(`layout.navigation.${labelKey}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
