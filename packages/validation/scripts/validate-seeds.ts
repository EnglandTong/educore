import { questionSchema } from '../src/questionSchema.js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedsDir = join(__dirname, '..', '..', '..', 'modules', 'english-grammar', 'seeds')

let totalQuestions = 0
const errors: string[] = []

const files = readdirSync(seedsDir).filter((f) => f.endsWith('.json'))

for (const file of files) {
  const filepath = join(seedsDir, file)
  const questions = JSON.parse(readFileSync(filepath, 'utf-8'))

  for (const q of questions) {
    totalQuestions++
    const result = questionSchema.safeParse(q)
    if (!result.success) {
      errors.push(`[${file}] ${q.id}: ${result.error.errors.map((e) => e.message).join(', ')}`)
    }
  }
}

if (errors.length > 0) {
  console.error('Validation errors:')
  errors.forEach((e) => console.error(e))
  process.exit(1)
} else {
  console.log(`All ${totalQuestions} questions validated ✓`)
  process.exit(0)
}
