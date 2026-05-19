import type { Announcement, ApiResponse, ApiSuccess, Conversation, Message } from '@educore/types'

import { api } from './client'

const announcementTypes: Announcement['type'][] = ['news', 'event', 'curriculum', 'celebration']
const announcementAudiences: Announcement['targetAudience'][] = ['all', 'class', 'grade']

function parseAnnouncementType(v: unknown): Announcement['type'] {
  return announcementTypes.includes(v as Announcement['type']) ? (v as Announcement['type']) : 'news'
}

function parseAnnouncementAudience(v: unknown): Announcement['targetAudience'] {
  return announcementAudiences.includes(v as Announcement['targetAudience'])
    ? (v as Announcement['targetAudience'])
    : 'all'
}

export function normalizeAnnouncement(raw: unknown): Announcement | null {
  if (!raw || typeof raw !== 'object') return null
  const a = raw as Record<string, unknown>
  const id = typeof a.id === 'string' ? a.id : ''
  if (!id) return null
  return {
    id,
    schoolId: typeof a.schoolId === 'string' ? a.schoolId : '',
    authorId: typeof a.authorId === 'string' ? a.authorId : '',
    authorName: typeof a.authorName === 'string' ? a.authorName : 'Someone who cares',
    title: typeof a.title === 'string' ? a.title : 'School note',
    content: typeof a.content === 'string' ? a.content : '',
    type: parseAnnouncementType(a.type),
    targetAudience: parseAnnouncementAudience(a.targetAudience),
    classIds: Array.isArray(a.classIds) ? a.classIds.filter((x): x is string => typeof x === 'string') : undefined,
    publishedAt: typeof a.publishedAt === 'string' ? a.publishedAt : new Date(0).toISOString(),
    isRead: typeof a.isRead === 'boolean' ? a.isRead : undefined,
  }
}

export function normalizeConversation(raw: unknown): Conversation | null {
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Record<string, unknown>
  const id = typeof c.id === 'string' ? c.id : ''
  if (!id) return null
  return {
    id,
    teacherId: typeof c.teacherId === 'string' ? c.teacherId : '',
    teacherName: typeof c.teacherName === 'string' ? c.teacherName : 'Teacher',
    parentId: typeof c.parentId === 'string' ? c.parentId : '',
    parentName: typeof c.parentName === 'string' ? c.parentName : 'Parent',
    studentId: typeof c.studentId === 'string' ? c.studentId : '',
    studentName: typeof c.studentName === 'string' ? c.studentName : 'Student',
    lastMessage: typeof c.lastMessage === 'string' ? c.lastMessage : undefined,
    lastMessageAt: typeof c.lastMessageAt === 'string' ? c.lastMessageAt : undefined,
    unreadCount: typeof c.unreadCount === 'number' ? c.unreadCount : 0,
  }
}

export function normalizeMessage(raw: unknown): Message | null {
  if (!raw || typeof raw !== 'object') return null
  const m = raw as Record<string, unknown>
  const id = typeof m.id === 'string' ? m.id : ''
  if (!id) return null
  const role = m.senderRole === 'teacher' || m.senderRole === 'parent' ? m.senderRole : 'teacher'
  return {
    id,
    conversationId: typeof m.conversationId === 'string' ? m.conversationId : '',
    senderId: typeof m.senderId === 'string' ? m.senderId : '',
    senderName: typeof m.senderName === 'string' ? m.senderName : 'Friend',
    senderRole: role,
    content: typeof m.content === 'string' ? m.content : '',
    sentAt: typeof m.sentAt === 'string' ? m.sentAt : new Date(0).toISOString(),
    readAt: typeof m.readAt === 'string' ? m.readAt : undefined,
  }
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const res = await api.get<ApiSuccess<unknown>>('/community/announcements')
  if (!res.data.success) return []
  const data = res.data.data as { announcements?: unknown }
  if (!Array.isArray(data.announcements)) return []
  return data.announcements.map(normalizeAnnouncement).filter((x): x is Announcement => x !== null)
}

export async function markAnnouncementRead(id: string): Promise<void> {
  const res = await api.put<ApiResponse<unknown>>(`/community/announcements/${encodeURIComponent(id)}/read`)
  if (!res.data.success) throw new Error('Could not mark announcement as read')
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await api.get<ApiSuccess<unknown>>('/community/conversations')
  if (!res.data.success) return []
  const data = res.data.data as { conversations?: unknown }
  if (!Array.isArray(data.conversations)) return []
  return data.conversations.map(normalizeConversation).filter((x): x is Conversation => x !== null)
}

export async function fetchConversationMessages(conversationId: string): Promise<Message[]> {
  const res = await api.get<ApiSuccess<unknown>>(`/community/conversations/${encodeURIComponent(conversationId)}/messages`)
  if (!res.data.success) return []
  const data = res.data.data as { messages?: unknown }
  if (!Array.isArray(data.messages)) return []
  return data.messages.map(normalizeMessage).filter((x): x is Message => x !== null)
}

export async function postConversationMessage(conversationId: string, content: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(
    `/community/conversations/${encodeURIComponent(conversationId)}/messages`,
    { content },
  )
  if (!res.data.success) throw new Error('Could not send message')
}
