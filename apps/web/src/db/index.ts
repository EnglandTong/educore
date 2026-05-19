import { type DBSchema, type IDBPDatabase, openDB } from 'idb'

export interface QuestionCacheRow {
  id: string
  data: unknown
  cachedAt: number
}

export interface ProgressSnapshotRow {
  id: string
  data: unknown
  syncedAt: number
}

export interface SessionRow {
  id: string
  data: unknown
  createdAt: number
}

export interface SyncQueueRow {
  id: string
  operation: string
  payload: unknown
  createdAt: number
  retries: number
}

export interface EduCoreDB extends DBSchema {
  questionsCache: {
    key: string
    value: QuestionCacheRow
  }
  progressSnapshots: {
    key: string
    value: ProgressSnapshotRow
  }
  sessions: {
    key: string
    value: SessionRow
  }
  syncQueue: {
    key: string
    value: SyncQueueRow
    indexes: { 'by-created': number }
  }
}

const DB_NAME = 'educore-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<EduCoreDB>> | null = null

export function getDB(): Promise<IDBPDatabase<EduCoreDB>> {
  if (!dbPromise) {
    dbPromise = openDB<EduCoreDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains('questionsCache')) {
          database.createObjectStore('questionsCache')
        }
        if (!database.objectStoreNames.contains('progressSnapshots')) {
          database.createObjectStore('progressSnapshots')
        }
        if (!database.objectStoreNames.contains('sessions')) {
          database.createObjectStore('sessions')
        }
        if (!database.objectStoreNames.contains('syncQueue')) {
          const store = database.createObjectStore('syncQueue', {
            keyPath: 'id',
          })
          store.createIndex('by-created', 'createdAt')
        }
      },
    })
  }
  return dbPromise
}

export async function clearAllStores(): Promise<void> {
  const db = await getDB()
  await db.clear('questionsCache')
  await db.clear('progressSnapshots')
  await db.clear('sessions')
  await db.clear('syncQueue')
}
