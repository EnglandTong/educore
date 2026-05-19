import { getDB } from './index'

export interface OfflineAnswer {
  sessionId: string
  questionId: string
  answer: string | string[]
  timeSpent?: number
  hintsUsed?: number
  submittedAt: number
  synced: boolean
}

export interface OfflineSession {
  id: string
  userId: string
  type: 'diagnostic' | 'training' | 'review' | 'challenge'
  moduleId?: string
  startedAt: number
  endedAt?: number
  answers: OfflineAnswer[]
  synced: boolean
}

export async function saveOfflineSession(
  session: OfflineSession,
): Promise<void> {
  const db = await getDB()
  await db.put('sessions', {
    id: session.id,
    data: session,
    createdAt: session.startedAt,
  })
}

export async function getOfflineSession(
  id: string,
): Promise<OfflineSession | undefined> {
  const db = await getDB()
  const row = await db.get('sessions', id)
  return row?.data as OfflineSession | undefined
}

export async function addOfflineAnswer(
  sessionId: string,
  answer: Omit<OfflineAnswer, 'submittedAt' | 'synced'>,
): Promise<void> {
  const db = await getDB()
  const row = await db.get('sessions', sessionId)
  if (!row) return
  const session = row.data as OfflineSession
  session.answers.push({
    ...answer,
    submittedAt: Date.now(),
    synced: false,
  })
  await db.put('sessions', { id: sessionId, data: session, createdAt: session.startedAt })
}

export async function getAllUnsyncedSessions(): Promise<OfflineSession[]> {
  const db = await getDB()
  const all = await db.getAll('sessions')
  return all
    .map((row) => row.data as OfflineSession)
    .filter((s) => !s.synced)
}

export async function markSessionSynced(id: string): Promise<void> {
  const db = await getDB()
  const row = await db.get('sessions', id)
  if (!row) return
  const session = row.data as OfflineSession
  session.synced = true
  session.answers = session.answers.map((a) => ({ ...a, synced: true }))
  await db.put('sessions', { id, data: session, createdAt: session.startedAt })
}

export async function removeSession(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('sessions', id)
}

export async function getUnsyncedCount(): Promise<number> {
  const sessions = await getAllUnsyncedSessions()
  return sessions.reduce((count, s) => count + s.answers.filter((a) => !a.synced).length, 0)
}
