import type { ApiResponse, ApiSuccess } from '@educore/types'

import { api } from './client'

export interface AppNotification {
  id: string
  title: string
  body: string
  type: string
  read: boolean
  createdAt?: string
}

function normalizeNotification(raw: unknown): AppNotification | null {
  if (!raw || typeof raw !== 'object') return null
  const n = raw as Record<string, unknown>
  const id = typeof n.id === 'string' ? n.id : typeof n._id === 'string' ? n._id : ''
  if (!id) return null
  const title = typeof n.title === 'string' ? n.title : 'A little hello from EduCore'
  const body = typeof n.body === 'string' ? n.body : typeof n.message === 'string' ? n.message : ''
  const readAt = n.readAt
  const read = readAt != null && readAt !== '' ? true : typeof n.read === 'boolean' ? n.read : false
  const createdAt =
    typeof n.createdAt === 'string'
      ? n.createdAt
      : typeof n.created_at === 'string'
        ? n.created_at
        : typeof n.sentAt === 'string'
          ? n.sentAt
          : undefined
  const type = typeof n.type === 'string' ? n.type : 'general'
  return { id, title, body, type, read, createdAt }
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const res = await api.get<ApiSuccess<unknown>>('/notifications')
  if (!res.data.success) return []
  const data = res.data.data as { notifications?: unknown }
  if (!Array.isArray(data.notifications)) return []
  return data.notifications.map(normalizeNotification).filter((x): x is AppNotification => x !== null)
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(`/notifications/${encodeURIComponent(id)}/read`)
  if (!res.data.success) throw new Error('Could not mark notification as read')
}
