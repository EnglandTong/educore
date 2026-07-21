import type { Page, Route } from '@playwright/test'

import { mockAuth } from './mocks/auth'
import { mockDonation } from './mocks/donation'
import { mockFamily } from './mocks/family'
import { failUnmocked, okEnvelope } from './mocks/shared'
import { mockStudent } from './mocks/student'
import { mockTeacher } from './mocks/teacher'

type DomainMock = (
  pathname: string,
  method: string,
  body: Record<string, unknown>,
) => { handled: true; status: number; body: unknown } | { handled: false }

const domainMocks: DomainMock[] = [mockAuth, mockDonation, mockTeacher, mockStudent, mockFamily]

function resolveMock(pathname: string, method: string, body: Record<string, unknown>) {
  for (const mock of domainMocks) {
    const result = mock(pathname, method, body)
    if (result.handled) return result
  }

  // Mutating methods: keep empty success for sparse write coverage, but never for undeclared GET.
  if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
    return { handled: true as const, status: 200, body: okEnvelope({}) }
  }

  return { handled: true as const, status: 404, body: failUnmocked(pathname, method) }
}

async function readBody(route: Route): Promise<Record<string, unknown>> {
  const postData = route.request().postData()
  if (!postData) return {}
  try {
    return JSON.parse(postData) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function installE2eApiMocks(page: Page): Promise<void> {
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request()
    const method = request.method().toUpperCase()
    const pathname = new URL(request.url()).pathname
    const body = await readBody(route)
    const resolved = resolveMock(pathname, method, body)
    await route.fulfill({
      status: resolved.status,
      contentType: 'application/json',
      body: JSON.stringify(resolved.body),
    })
  })
}
