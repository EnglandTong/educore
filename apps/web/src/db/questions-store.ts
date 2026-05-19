import { getDB } from './index'

export interface CachedQuestion {
  id: string
  moduleId: string
  type: string
  content: unknown
  options?: unknown
  correctAnswer?: unknown
  hint?: string
  explanation?: string
}

export async function cacheQuestions(
  questions: CachedQuestion[],
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('questionsCache', 'readwrite')
  const now = Date.now()
  for (const question of questions) {
    await tx.store.put({
      id: question.id,
      data: question,
      cachedAt: now,
    })
  }
  await tx.done
}

export async function getCachedQuestion(
  id: string,
): Promise<CachedQuestion | undefined> {
  const db = await getDB()
  const row = await db.get('questionsCache', id)
  return row?.data as CachedQuestion | undefined
}

export async function getCachedQuestionsByModule(
  moduleId: string,
): Promise<CachedQuestion[]> {
  const db = await getDB()
  const all = await db.getAll('questionsCache')
  return all
    .map((row) => row.data as CachedQuestion)
    .filter((q) => q.moduleId === moduleId)
}

export async function getAllCachedQuestions(): Promise<CachedQuestion[]> {
  const db = await getDB()
  const all = await db.getAll('questionsCache')
  return all.map((row) => row.data as CachedQuestion)
}

export async function removeCachedQuestion(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('questionsCache', id)
}

export async function clearQuestionsCache(): Promise<void> {
  const db = await getDB()
  await db.clear('questionsCache')
}

export async function getQuestionsCacheSize(): Promise<number> {
  const db = await getDB()
  const all = await db.getAll('questionsCache')
  return all.length
}
