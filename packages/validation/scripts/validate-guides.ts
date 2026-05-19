import { guideSchema } from '../src/guideSchema.js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const enDir = join(__dirname, '../../../modules/english-grammar/guides/en')
const zhDir = join(__dirname, '../../../modules/english-grammar/guides/zh')

let errors = 0

for (const dir of [enDir, zhDir]) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  for (const file of files) {
    const guide = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    const result = guideSchema.safeParse(guide)
    if (!result.success) {
      errors++
      console.log(`[${dir.split('/').pop()}/${file}]`, result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(' | '))
    }
  }
}

if (errors === 0) {
  console.log('All guides validated ✓')
} else {
  console.log(`${errors} guide(s) failed validation`)
  process.exit(1)
}
