import { BookOpen, MessageSquare, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { routes } from '@/router/routes'

export function VolunteerDashboardPage() {
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Q&A Board',
      description: 'Help students by answering their questions',
      icon: MessageSquare,
      path: routes.volunteerQa,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'My Profile',
      description: 'Manage your volunteer profile and expertise',
      icon: User,
      path: routes.volunteerProfile,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Learning Resources',
      description: 'Browse materials to help students',
      icon: BookOpen,
      path: routes.studentDashboard,
      color: 'from-purple-500 to-violet-600'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[hsl(var(--color-text))]">Volunteer Dashboard</h1>
        <p className="mt-1 text-[hsl(var(--color-text-secondary))]">Welcome! Your contributions make a difference.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => navigate(card.path)}
            className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6 text-left transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.color} opacity-10 transition-opacity group-hover:opacity-20`} />
            <card.icon className="mb-4 h-8 w-8 text-[hsl(var(--color-primary))]" />
            <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">{card.title}</h3>
            <p className="mt-1 text-sm text-[hsl(var(--color-text-secondary))]">{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
