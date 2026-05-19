import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { hasAuthSessionPayload, isWarmStatusMessage, registerRequest } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { routes } from '@/router/routes'
import type { UserRole } from '@/types'
import { cn } from '@/utils/cn'

type RegisterRole = Extract<UserRole, 'student' | 'parent' | 'teacher'>

const roles: { value: RegisterRole; label: string; hint: string }[] = [
  { value: 'student', label: 'Student', hint: 'Learner accounts feel extra playful and supportive.' },
  { value: 'parent', label: 'Parent', hint: "Stay close to your child's growth story." },
  { value: 'teacher', label: 'Teacher', hint: 'Celebrate your class with calm, clear insights.' },
]

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const pushToast = useToastStore((s) => s.pushToast)
  const [name, setName] = useState('River')
  const [email, setEmail] = useState('river@student.edu')
  const [password, setPassword] = useState('password123')
  const [role, setRole] = useState<RegisterRole>('student')

  const register = useMutation({
    mutationFn: async () => {
      const res = await registerRequest({ name, email, password, role })
      if (!res.success) {
        throw new Error(res.error.message)
      }
      if (hasAuthSessionPayload(res.data)) {
        return res.data
      }
      if (isWarmStatusMessage(res.data)) {
        throw new Error(res.data.message)
      }
      throw new Error('Unexpected registration response — our team is on it.')
    },
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken)
      pushToast({
        variant: 'success',
        title: 'You are officially part of the family!',
        message: 'Take a deep breath — your space is ready whenever you are.',
      })
      if (data.user.role === 'student') navigate('/student/dashboard')
      else if (data.user.role === 'parent') navigate('/parent/dashboard')
      else navigate('/teacher/dashboard')
    },
    onError: (e) => {
      const msg =
        e instanceof Error
          ? e.message
          : 'Please check each field — we want to make sure we set things up just right for you.'
      pushToast({
        variant: 'error',
        title: 'Not quite — let me help!',
        message: msg,
      })
    },
  })

  return (
    <div className="min-h-dvh bg-[hsl(var(--color-bg))] px-4 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">
            Join gently
          </p>
          <h1 className="font-display text-4xl font-semibold text-[hsl(var(--color-text))]">Create your account</h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            We will guide you slowly — one cozy step at a time.
          </p>
          <Link className="text-sm font-semibold text-[hsl(var(--color-primary))]" to={routes.authLogin}>
            Already have an account? Sign in instead
          </Link>
        </div>

        <Card variant="elevated" className="space-y-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (password.length < 8) {
                pushToast({
                  variant: 'info',
                  title: 'Almost there',
                  message: 'Passwords need at least 8 characters so we can keep you extra safe.',
                })
                return
              }
              register.mutate()
            }}
          >
            <Input label="Full name" name="name" data-testid="input-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              label="Email"
              type="email"
              name="email"
              data-testid="input-email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Pick something you check often — we only send kind updates."
            />
            <Input
              label="Password"
              type="password"
              name="password"
              data-testid="input-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="At least 8 characters keeps your account extra cozy and secure."
            />

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-[hsl(var(--color-text-secondary))]">I am joining as</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className={cn(
                      'cursor-pointer rounded-[var(--radius-xl)] border p-3 text-sm shadow-[var(--shadow-sm)] transition',
                      role === r.value
                        ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.08)]'
                        : 'border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary)/0.35)]',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={role === r.value}
                        onChange={() => setRole(r.value)}
                      />
                      <span className="font-semibold text-[hsl(var(--color-text))]">{r.label}</span>
                    </div>
                    <p className="mt-2 text-xs text-[hsl(var(--color-text-muted))]">{r.hint}</p>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending ? 'Setting up your space…' : 'Create my account'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
