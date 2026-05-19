import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Skeleton } from '@/components/ui/Skeleton'
import { routes } from '@/router/routes'

export function DesignSystemPage() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-dvh bg-[hsl(var(--color-bg))] px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">
            Sprint 0
          </p>
          <h1 className="font-display text-4xl font-semibold text-[hsl(var(--color-text))]">Warm design system</h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            Every control here is meant to feel calm, friendly, and human.
          </p>
          <Link className="text-sm font-semibold text-[hsl(var(--color-primary))]" to={routes.authLogin}>
            Back to sign in
          </Link>
        </div>

        <Card className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Gentle alert</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="interactive">
            <h3 className="font-display text-lg font-semibold">Interactive card</h3>
            <p className="mt-2 text-sm text-[hsl(var(--color-text-secondary))]">Hover for a soft lift.</p>
          </Card>
          <Card variant="default">
            <h3 className="font-display text-lg font-semibold">Default card</h3>
            <p className="mt-2 text-sm text-[hsl(var(--color-text-secondary))]">Quiet, supportive surface.</p>
          </Card>
        </div>

        <Card className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Inputs</h2>
          <Input label="Email" placeholder="you@example.com" helperText="We read every message with care." />
          <Input
            label="Nickname"
            placeholder="River"
            error="Not quite — let me help! Try at least two characters."
          />
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="flex flex-col items-center gap-3">
            <Avatar name="Alex Johnson" size="lg" />
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">Avatar with initials</p>
          </Card>
          <Card className="flex flex-col items-center gap-3">
            <ProgressRing value={72} label="Mastery snapshot" />
          </Card>
          <Card className="flex flex-col items-center gap-3">
            <Badge level="developing" />
            <Badge level="mastered" />
          </Card>
        </div>

        <Card className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Loading & empty</h2>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <EmptyState
            title="Nothing here yet — and that is okay!"
            description="Every garden starts as open soil. When you are ready, we will plant the first seed together."
            action={<Button size="sm">Show me how</Button>}
          />
        </Card>

        <Card className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Modal</h2>
          <Button type="button" onClick={() => setOpen(true)}>
            Open gentle dialog
          </Button>
          <Modal
            open={open}
            title="You are doing great"
            description="Modals should feel like a caring pause, not a scolding stop sign."
            onClose={() => setOpen(false)}
            footer={
              <>
                <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                  Maybe later
                </Button>
                <Button type="button" onClick={() => setOpen(false)}>
                  Lovely — thanks!
                </Button>
              </>
            }
          >
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              Focus stays inside while open, and Escape closes with a soft goodbye.
            </p>
          </Modal>
        </Card>
      </div>
    </div>
  )
}
