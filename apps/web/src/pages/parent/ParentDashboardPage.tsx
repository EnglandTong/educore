import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users } from 'lucide-react'

import { fetchParentChildren, postParentLink, putParentChildConsent, type LinkedChild } from '@/api/parent'
import { DEFAULT_GUIDE_SKILL_ID, DEFAULT_MODULE_ID } from '@/api/progress'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { WarmQueryError } from '@/components/shared/WarmQueryError'
import { parentChildProgressPath, parentSubjectGuidePath, routes } from '@/router/routes'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { formatDisplayName } from '@/utils/formatters'

export function ParentDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const pushToast = useToastStore((s) => s.pushToast)
  const [inviteCode, setInviteCode] = useState('')
  const [relationship, setRelationship] = useState('parent')

  const childrenQuery = useQuery({
    queryKey: ['parent-children'],
    queryFn: fetchParentChildren,
  })

  const linkMutation = useMutation({
    mutationFn: () => postParentLink(inviteCode.trim(), relationship),
    onSuccess: () => {
      setInviteCode('')
      void queryClient.invalidateQueries({ queryKey: ['parent-children'] })
      pushToast({
        variant: 'success',
        title: 'Linked with care',
        message: 'If consent is still needed, you will see a gentle button below — take it one calm step at a time.',
      })
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'That link did not settle',
        message: 'Double-check the invite code together — we will wait right here while you try again.',
      })
    },
  })

  const consentMutation = useMutation({
    mutationFn: (childId: string) => putParentChildConsent(childId, true),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['parent-children'] })
      pushToast({
        variant: 'success',
        title: 'Consent recorded warmly',
        message: 'You can now see progress snapshots for this learner — celebrate gently, always.',
      })
    },
    onError: () => {
      pushToast({
        variant: 'error',
        title: 'Consent did not save yet',
        message: 'The server hiccuped — a soft retry in a moment usually does the trick.',
      })
    },
  })

  const guideHref = parentSubjectGuidePath(DEFAULT_MODULE_ID, DEFAULT_GUIDE_SKILL_ID)

  if (childrenQuery.isError) {
    return (
      <WarmQueryError
        title="We could not load your family list"
        description="Something went wrong on our end while fetching linked learners — your care still counts; please try again."
        onRetry={() => void childrenQuery.refetch()}
      />
    )
  }

  const children = childrenQuery.data ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[hsl(var(--color-text))] md:text-4xl">
          {formatDisplayName(user?.name ?? 'Friend')}, your family hub is blooming.
        </h1>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-[hsl(var(--color-text-secondary))]">
          We will always frame growth as a story of care — never a cold scoreboard. Link a learner with their invite
          code, confirm consent when asked, then open their gentle progress garden.
        </p>
      </div>

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-text))]">Link a learner</h2>
        <p className="text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
          Ask your child or their teacher for the invite code — it is a little bridge, not a hurdle.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Paste the cozy code here"
            autoComplete="off"
            helperText="Spaces are fine — we will trim them with kindness."
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="relationship" className="text-sm font-medium text-[hsl(var(--color-text-secondary))]">
              How you show up for them
            </label>
            <select
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="min-h-[44px] w-full rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3 text-sm text-[hsl(var(--color-text))] shadow-inner transition-[border-color,box-shadow] duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-primary)/0.25)]"
            >
              <option value="parent">Parent / caregiver</option>
              <option value="guardian">Guardian</option>
              <option value="grandparent">Grandparent</option>
              <option value="other">Someone else who loves them</option>
            </select>
          </div>
        </div>
        <Button
          type="button"
          variant="primary"
          className="min-h-[44px] w-full sm:w-auto"
          disabled={!inviteCode.trim() || linkMutation.isPending}
          onClick={() => linkMutation.mutate()}
        >
          {linkMutation.isPending ? 'Linking with care…' : 'Send the gentle link request'}
        </Button>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-primary)/0.12)] text-[hsl(var(--color-primary))]">
            <Users className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-text))]">Your children on EduCore</h2>
            <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
              Each card opens a warm snapshot — celebrate effort before outcomes. Consent keeps everyone emotionally
              safe.
            </p>
          </div>
        </div>

        {childrenQuery.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : children.length === 0 ? (
          <EmptyState
            title="No linked learners yet"
            description="Use the invite form above — when the link settles, their name will appear here like a sticker on the fridge."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {children.map((child: LinkedChild) => (
              <li key={child.id}>
                <Card className="h-full space-y-3 border-[hsl(var(--color-border))] p-5 shadow-[var(--shadow-sm)] transition-[box-shadow,border-color] duration-[var(--transition-base)] hover:border-[hsl(var(--color-primary)/0.35)]">
                  <p className="font-display text-lg font-semibold text-[hsl(var(--color-text))]">
                    {formatDisplayName(child.name)}
                  </p>
                  <p className="text-sm text-[hsl(var(--color-text-muted))]">Relationship: {child.relationship}</p>
                  {!child.consentGiven ? (
                    <div className="space-y-2 rounded-[var(--radius-lg)] bg-[hsl(var(--color-warning)/0.12)] p-3 text-sm text-[hsl(var(--color-text-secondary))]">
                      <p>
                        A tiny consent step is waiting — when you feel ready, confirm below so progress can bloom only
                        with everyone aligned.
                      </p>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        className="min-h-[44px] w-full"
                        disabled={consentMutation.isPending && consentMutation.variables === child.id}
                        onClick={() => consentMutation.mutate(child.id)}
                      >
                        {consentMutation.isPending ? 'Saving…' : 'We are ready — record my consent'}
                      </Button>
                    </div>
                  ) : (
                    <Link
                      to={parentChildProgressPath(child.id)}
                      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-primary)/0.08)] px-4 py-3 text-center text-sm font-semibold text-[hsl(var(--color-primary-dark))] transition-[background-color] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-primary)/0.14)]"
                    >
                      Open their progress garden →
                    </Link>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-secondary-light))] text-[hsl(var(--color-primary))]">
            <Heart className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-text))]">Subject guides</h2>
            <p className="text-sm leading-relaxed text-[hsl(var(--color-text-secondary))]">
              Short, parent-friendly explainers for supporting homework without becoming the teacher.
            </p>
          </div>
        </div>
        <Link
          to={guideHref}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[var(--radius-xl)] bg-[hsl(var(--color-primary))] px-4 py-3 text-center text-sm font-semibold text-[hsl(var(--color-surface))] shadow-[var(--shadow-md)] transition-[background-color,transform] duration-[var(--transition-base)] hover:bg-[hsl(var(--color-primary-dark))] active:scale-[0.99]"
        >
          Browse a cozy starter guide
        </Link>
        <p className="text-sm text-[hsl(var(--color-text-muted))]">
          School threads live under{' '}
          <Link className="font-semibold text-[hsl(var(--color-primary))] hover:underline" to={routes.parentMessages}>
            Notes from school
          </Link>{' '}
          and the{' '}
          <Link className="font-semibold text-[hsl(var(--color-primary))] hover:underline" to={routes.parentAnnouncements}>
            bulletin board
          </Link>
          .
        </p>
      </Card>
    </div>
  )
}
