import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchSubjectGuide } from '@/api/parent'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { routes } from '@/router/routes'

function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="space-y-2">
      <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">{title}</h2>
      <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

export function ParentSubjectGuidePage() {
  const { moduleId, skillId } = useParams<{ moduleId: string; skillId: string }>()
  const navigate = useNavigate()
  const mid = moduleId ? decodeURIComponent(moduleId) : ''
  const sid = skillId ? decodeURIComponent(skillId) : ''

  const guideQuery = useQuery({
    queryKey: ['parent-subject-guide', mid, sid],
    queryFn: () => fetchSubjectGuide(mid, sid),
    enabled: Boolean(mid && sid),
  })

  if (!mid || !sid) {
    return (
      <EmptyState
        title="This guide path looks incomplete"
        description="Return to your child’s progress and open a guide from there — we will meet you with the right words."
        action={
          <Button type="button" variant="primary" onClick={() => navigate(routes.parentDashboard)}>
            Back to family hub
          </Button>
        }
      />
    )
  }

  const g = guideQuery.data

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">Subject guide</p>
          <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
            {g?.title ?? 'Supporting your learner at home'}
          </h1>
          <p className="max-w-2xl text-lg text-[hsl(var(--color-text-secondary))]">
            You do not need to be an expert — curiosity, patience, and these gentle prompts are more than enough.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Go back softly
        </Button>
      </div>

      {guideQuery.isError ? (
        <WarmQueryError
          title="This guide could not load"
          description="Something went wrong on our end — the skill path may need a different spelling, or the server needs a gentle retry."
          onRetry={() => void guideQuery.refetch()}
        />
      ) : guideQuery.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !g ? (
        <EmptyState
          title="This guide is not blooming here yet"
          description="When your school shares tailored tips for this skill, they will appear like a folded note in your pocket."
        />
      ) : (
        <div className="space-y-8">
          <Card className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-text-muted))]">
              {g.skillName}
            </p>
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-text))]">What it is</h2>
            <p className="text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">{g.whatIsIt}</p>
          </Card>
          <Card className="space-y-6">
            <BulletList title="How you can help tonight" items={g.howToHelp} />
            <BulletList title="Common bumps (no blame, just patterns)" items={g.commonMistakes} />
            <BulletList title="Signs they are blossoming" items={g.signsOfProgress} />
            <BulletList title="If it feels heavy, try this" items={g.ifStruggling} />
          </Card>
        </div>
      )}
    </div>
  )
}
