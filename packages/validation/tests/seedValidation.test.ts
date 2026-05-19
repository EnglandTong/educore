import { describe, it, expect } from 'vitest'
import { questionSchema } from '../src/questionSchema.js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedsDir = join(__dirname, '..', '..', '..', 'modules', 'english-grammar', 'seeds')

describe('Seed validation', () => {
  const files = readdirSync(seedsDir).filter((f) => f.endsWith('.json'))

  for (const file of files) {
    const filepath = join(seedsDir, file)
    const questions = JSON.parse(readFileSync(filepath, 'utf-8'))

    it(`validates all questions in ${file}`, () => {
      let errorCount = 0
      const errors: string[] = []

      for (const q of questions) {
        const result = questionSchema.safeParse(q)
        if (!result.success) {
          errorCount++
          errors.push(`[${q.id}] ${result.error.errors.map((e) => e.message).join(', ')}`)
        }
      }

      if (errors.length > 0) {
        console.error(errors.join('\n'))
      }

      expect(errorCount).toBe(0)
      expect(questions.length).toBeGreaterThan(0)
    })
  }
})
