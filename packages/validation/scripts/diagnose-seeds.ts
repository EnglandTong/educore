import { questionSchema } from '../src/questionSchema.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const a1 = JSON.parse(readFileSync(join(__dirname, '../../../modules/english-grammar/seeds/A1.json'), 'utf8'))
const b1 = JSON.parse(readFileSync(join(__dirname, '../../../modules/english-grammar/seeds/B1.json'), 'utf8'))

console.log('=== A1 ERRORS ===')
a1.forEach(q => {
  const r = questionSchema.safeParse(q)
  if (!r.success) {
    console.log(`[${q.id}]`, r.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(' | '))
  }
})

console.log('\n=== B1 ERRORS ===')
b1.forEach(q => {
  const r = questionSchema.safeParse(q)
  if (!r.success) {
    console.log(`[${q.id}]`, r.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(' | '))
  }
})
