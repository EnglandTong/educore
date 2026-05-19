import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { hasAuthSessionPayload, isWarmStatusMessage, loginRequest } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { routes } from '@/router/routes'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const pushToast = useToastStore((s) => s.pushToast)
  const [email, setEmail] = useState('hello@student.edu')
  const [password, setPassword] = useState('password123')

  const login = useMutation({
    mutationFn: async () => {
      const res = await loginRequest(email, password)
      if (!res.success) {
        throw new Error(res.error.message)
      }
      if (hasAuthSessionPayload(res.data)) {
        return res.data
      }
      if (isWarmStatusMessage(res.data)) {
        throw new Error(res.data.message)
      }
      throw new Error(t('warm.unexpected'))
    },
    onSuccess: (data) => {
      setSession(data.user, data.accessToken, data.refreshToken)
      pushToast({
        variant: 'success',
        title: t('auth.welcomeBack'),
        message: t('auth.welcomeMessage'),
      })
      if (data.user.role === 'student') navigate('/student/dashboard')
      else if (data.user.role === 'parent') navigate('/parent/dashboard')
      else if (data.user.role === 'teacher') navigate('/teacher/dashboard')
      else navigate('/')
    },
    onError: (e) => {
      const msg =
        e instanceof Error
          ? e.message
          : t('auth.loginError')
      pushToast({
        variant: 'error',
        title: t('auth.loginErrorTitle'),
        message: msg,
      })
    },
  })

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-[hsl(var(--color-bg))] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--color-primary)/0.12),transparent_55%)]" />
      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">
            {t('app.name')}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-[hsl(var(--color-text))] md:text-5xl">
            {t('app.tagline')}
          </h1>
          <p className="text-lg text-[hsl(var(--color-text-secondary))]">
            {t('app.description')}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-[hsl(var(--color-text-muted))]">
            <Link className="font-semibold text-[hsl(var(--color-primary))]" to={routes.authRegister}>
              {t('auth.newHere')}
            </Link>
            <span aria-hidden>•</span>
            <Link className="font-semibold text-[hsl(var(--color-primary))]" to={routes.authDesign}>
              {t('auth.peekDesign')}
            </Link>
          </div>
        </div>

        <Card variant="elevated" className="relative space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[hsl(var(--color-text))]">{t('auth.signIn')}</h2>
            <p className="mt-2 text-sm text-[hsl(var(--color-text-secondary))]">
              {t('auth.signInSubtitle')}
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              login.mutate()
            }}
          >
            <Input
              label={t('auth.emailLabel')}
              type="email"
              name="email"
              data-testid="input-email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={t('auth.emailHelper')}
            />
            <Input
              label={t('auth.passwordLabel')}
              type="password"
              name="password"
              data-testid="input-password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={t('auth.passwordHelper')}
            />
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? t('auth.signInPending') : t('auth.signInButton')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
