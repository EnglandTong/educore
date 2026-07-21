export type MockResult =
  | { handled: true; status: number; body: unknown }
  | { handled: false }

export function nextMeta() {
  return {
    timestamp: new Date().toISOString(),
    requestId: `e2e-${Math.random().toString(36).slice(2, 10)}`,
  }
}

export function okEnvelope(data: unknown) {
  return {
    success: true,
    data,
    meta: nextMeta(),
  }
}

export function failUnmocked(pathname: string, method: string) {
  return {
    success: false,
    error: {
      code: 'E2E_UNMOCKED',
      message: `No e2e mock for ${method} ${pathname}. Add an explicit handler; silent success is disabled for undeclared GET.`,
    },
    meta: nextMeta(),
  }
}

export function handledOk(data: unknown): MockResult {
  return { handled: true, status: 200, body: okEnvelope(data) }
}

export function notHandled(): MockResult {
  return { handled: false }
}
