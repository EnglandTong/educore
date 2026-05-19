import { api } from '@/api/client'
import { getDB } from './index'

export interface SyncOperation {
  id: string
  type: 'submit_answer' | 'end_session'
  payload: Record<string, unknown>
  createdAt: number
  retries: number
}

export async function enqueueOperation(
  operation: Omit<SyncOperation, 'id' | 'createdAt' | 'retries'>,
): Promise<void> {
  const db = await getDB()
  const id = `${operation.type}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  await db.add('syncQueue', {
    id,
    operation: operation.type,
    payload: operation.payload,
    createdAt: Date.now(),
    retries: 0,
  })
}

export async function getPendingOperations(): Promise<SyncOperation[]> {
  const db = await getDB()
  const all = await db.getAll('syncQueue')
  return all
    .filter((row) => row.retries < 5)
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((row) => ({
      id: row.id,
      type: row.operation as 'submit_answer' | 'end_session',
      payload: row.payload as Record<string, unknown>,
      createdAt: row.createdAt,
      retries: row.retries,
    }))
}

export async function removeOperation(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('syncQueue', id)
}

export async function incrementRetry(id: string): Promise<void> {
  const db = await getDB()
  const row = await db.get('syncQueue', id)
  if (!row) return
  row.retries += 1
  await db.put('syncQueue', row)
}

export async function processSyncQueue(): Promise<{
  synced: number
  failed: number
  errors: string[]
}> {
  const operations = await getPendingOperations()
  let synced = 0
  let failed = 0
  const errors: string[] = []

  for (const op of operations) {
    try {
      if (op.type === 'submit_answer') {
        await api.post('/learning/training/answer', op.payload)
      } else if (op.type === 'end_session') {
        await api.post('/learning/training/end', op.payload)
      }
      await removeOperation(op.id)
      synced++
    } catch (err) {
      await incrementRetry(op.id)
      failed++
      errors.push(`Operation ${op.id} (${op.type}): ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return { synced, failed, errors }
}

let syncListenerRegistered = false

export function registerSyncListener(): void {
  if (syncListenerRegistered) return
  syncListenerRegistered = true

  window.addEventListener('online', () => {
    processSyncQueue().catch(() => {
      // Silently handle sync errors
    })
  })
}
