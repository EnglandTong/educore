import { handledOk, notHandled, okEnvelope, type MockResult } from './shared'

type Role = 'student' | 'parent' | 'teacher' | 'admin' | 'volunteer' | 'school-admin'

function roleFromEmail(email: string): Role {
  if (email.includes('parent')) return 'parent'
  if (email.includes('teacher')) return 'teacher'
  if (email.includes('admin')) return 'admin'
  if (email.includes('volunteer')) return 'volunteer'
  return 'student'
}

function authSuccess(role: Role, body: Record<string, unknown>) {
  const name = typeof body.name === 'string' && body.name.trim() ? body.name : `${role} user`
  const email =
    typeof body.email === 'string' && body.email.trim()
      ? body.email
      : `${role}-${Date.now()}@example.com`

  return okEnvelope({
    user: {
      id: `${role}-seed-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      preferences: {
        language: 'en',
        theme: 'light',
      },
    },
    accessToken: `e2e-${role}-access`,
    refreshToken: `e2e-${role}-refresh`,
  })
}

export function mockAuth(pathname: string, method: string, body: Record<string, unknown>): MockResult {
  if (pathname === '/api/v1/auth/register' && method === 'POST') {
    const role =
      body.role === 'parent' || body.role === 'teacher' || body.role === 'student'
        ? body.role
        : 'student'
    return { handled: true, status: 200, body: authSuccess(role, body) }
  }

  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    const email = typeof body.email === 'string' ? body.email : ''
    return { handled: true, status: 200, body: authSuccess(roleFromEmail(email), body) }
  }

  return notHandled()
}
