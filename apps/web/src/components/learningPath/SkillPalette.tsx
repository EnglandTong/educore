import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, GripVertical, Search } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { fetchAvailableModules } from '@/api/modules'
import { cn } from '@/utils/cn'
import { Skeleton } from '@/components/ui/Skeleton'

export interface SkillItem {
  moduleId: string
  moduleName: string
  skillId: string
  skillName: string
  difficulty: number
}

export interface SkillPaletteProps {
  onSkillDragStart: (skill: SkillItem) => void
  onSkillDrop: (skill: SkillItem) => void
  className?: string
}

export function SkillPalette({ onSkillDragStart, onSkillDrop: _onSkillDrop, className }: SkillPaletteProps) {
  const [search, setSearch] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const { data: modules, isLoading } = useQuery({
    queryKey: ['available-modules'],
    queryFn: fetchAvailableModules
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const filteredModules = (modules ?? []).filter((m) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(q) ||
      (m.skills ?? []).some((s: { name: string }) => s.name.toLowerCase().includes(q))
    )
  })

  const handleDragStart = (e: React.DragEvent, skill: SkillItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(skill))
    e.dataTransfer.effectAllowed = 'copy'
    onSkillDragStart(skill)
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="px-4 pt-4">
        <h3 className="font-display text-sm font-semibold text-[hsl(var(--color-text))]">Skills palette</h3>
        <p className="mt-1 text-xs text-[hsl(var(--color-text-secondary))]">
          Drag a skill onto the canvas to add it as a node.
        </p>
      </div>

      <div className="px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] py-2 pl-9 pr-3 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-muted))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.25)]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <p className="py-8 text-center text-sm text-[hsl(var(--color-text-muted))]">
            {search ? 'No modules match your search.' : 'No modules available yet.'}
          </p>
        ) : (
          <div className="space-y-1">
            {filteredModules.map((mod) => {
              const skills = (mod.skills ?? []) as Array<{ id: string; name: string; description?: string; subSkills?: string[] }>
              const isExpanded = expandedModules.has(mod.id)
              return (
                <div key={mod.id}>
                  <button
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    className="flex w-full items-center gap-2 rounded-[var(--radius-lg)] px-3 py-2 text-left text-sm font-medium text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-border)/0.35)] transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--color-text-muted))]" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--color-text-muted))]" />
                    )}
                    <BookOpen className="h-4 w-4 shrink-0 text-[hsl(var(--color-primary))]" />
                    <span className="truncate">{mod.name}</span>
                    <span className="ml-auto text-xs text-[hsl(var(--color-text-muted))]">
                      {skills.length}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-[hsl(var(--color-border))] pl-2">
                      {skills.map((skill) => {
                        const sk: SkillItem = {
                          moduleId: mod.id,
                          moduleName: mod.name,
                          skillId: skill.id,
                          skillName: skill.name,
                          difficulty: 50
                        }
                        return (
                          <div
                            key={skill.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, sk)}
                            className="flex cursor-grab items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/0.35)] hover:text-[hsl(var(--color-text))] active:cursor-grabbing transition-colors"
                          >
                            <GripVertical className="h-3 w-3 shrink-0 text-[hsl(var(--color-text-muted))]" />
                            <span className="truncate">{skill.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
