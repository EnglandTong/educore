import type { ApiFailure, ApiSuccess } from '@educore/types'

export function createMeta(): ApiSuccess<unknown>['meta'] {
  return {
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
  }
}

export function isApiFailure(x: unknown): x is ApiFailure {
  return (
    typeof x === 'object' &&
    x !== null &&
    'success' in x &&
    (x as ApiFailure).success === false &&
    'error' in x
  )
}

export function isApiSuccess<T>(x: unknown): x is ApiSuccess<T> {
  return typeof x === 'object' && x !== null && 'success' in x && (x as ApiSuccess<T>).success === true
}
