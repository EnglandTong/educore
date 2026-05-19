import type { ApiResponse, UserProfile, UserRole } from '@educore/types'

import { api } from './client'

export function hasAuthSessionPayload(
  data: unknown,
): data is { user: UserProfile; accessToken: string; refreshToken: string } {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  if (typeof d.accessToken !== 'string' || typeof d.refreshToken !== 'string') return false
  if (!d.user || typeof d.user !== 'object') return false
  return typeof (d.user as UserProfile).id === 'string' && typeof (d.user as UserProfile).role === 'string'
}

export function isWarmStatusMessage(data: unknown): data is { message: string } {
  if (!data || typeof data !== 'object') return false
  if (!('message' in data)) return false
  return typeof (data as { message: unknown }).message === 'string' && !hasAuthSessionPayload(data)
}

export async function loginRequest(email: string, password: string): Promise<ApiResponse<unknown>> {
  const res = await api.post<ApiResponse<unknown>>('/auth/login', { email, password })
  return res.data
}

export async function registerRequest(payload: {
  name: string
  email: string
  password: string
  role: UserRole
}): Promise<ApiResponse<unknown>> {
  const res = await api.post<ApiResponse<unknown>>('/auth/register', payload)
  return res.data
}
