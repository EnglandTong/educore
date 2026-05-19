import { BookOpen, PlusCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Map manifest icon names to lucide-react components.
 * Add new entries when modules use different icons.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'plus-circle': PlusCircle,
}

export interface ModuleOption {
  id: string
  name: string
  icon: string
  color: string
}

export interface ModulePickerProps {
  modules: ModuleOption[]
  activeId: string
  onChange: (moduleId: string) => void
}

function resolveIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? BookOpen
}

export function ModulePicker({ modules, activeId, onChange }: ModulePickerProps) {
  if (modules.length <= 1) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--color-text-muted))]">
        Your subjects
      </p>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Choose a subject to practice"
      >
        {modules.map((mod) => {
          const Icon = resolveIcon(mod.icon)
          const isActive = mod.id === activeId
          return (
            <button
              key={mod.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(mod.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-[var(--radius-xl)] border-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-[var(--transition-fast)] ease-[cubic-bezier(0.4,0,0.2,1)]',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.35)]',
                isActive
                  ? 'border-[hsl(var(--color-border))] shadow-[var(--shadow-md)] scale-[1.02]'
                  : 'border-transparent text-[hsl(var(--color-text-secondary))] hover:border-[hsl(var(--color-border))] hover:bg-[hsl(var(--color-surface))] hover:text-[hsl(var(--color-text))]',
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `${mod.color}14`,
                      borderColor: `${mod.color}40`,
                      color: mod.color,
                    }
                  : undefined
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span>{mod.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
