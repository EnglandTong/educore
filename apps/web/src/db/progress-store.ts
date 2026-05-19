import { getDB } from './index'

export interface ProgressSnapshot {
  userId: string
  moduleId: string
  completedItems: number
  totalItems: number
  score: number
  lastActivityAt: number
  metadata?: Record<string, unknown>
}

export async function saveProgressSnapshot(
  snapshot: ProgressSnapshot,
): Promise<void> {
  const db = await getDB()
  const compositeKey = `${snapshot.userId}:${snapshot.moduleId}`
  await db.put('progressSnapshots', {
    id: compositeKey,
    data: snapshot,
    syncedAt: Date.now(),
  })
}

export async function getProgressSnapshot(
  userId: string,
  moduleId: string,
): Promise<ProgressSnapshot | undefined> {
  const db = await getDB()
  const compositeKey = `${userId}:${moduleId}`
  const row = await db.get('progressSnapshots', compositeKey)
  return row?.data as ProgressSnapshot | undefined
}

export async function getAllProgressSnapshots(
  userId: string,
): Promise<ProgressSnapshot[]> {
  const db = await getDB()
  const all = await db.getAll('progressSnapshots')
  return all
    .map((row) => row.data as ProgressSnapshot)
    .filter((s) => s.userId === userId)
}

export async function removeProgressSnapshot(
  userId: string,
  moduleId: string,
): Promise<void> {
  const db = await getDB()
  const compositeKey = `${userId}:${moduleId}`
  await db.delete('progressSnapshots', compositeKey)
}

export async function clearProgressSnapshots(): Promise<void> {
  const db = await getDB()
  await db.clear('progressSnapshots')
}
