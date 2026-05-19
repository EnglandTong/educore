import { describe, it, expect } from 'vitest'
import { feedbackSchema } from '../src/feedbackSchema.js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const feedbackDir = join(__dirname, '../../../modules/english-grammar/feedback')

describe('Feedback JSON integrity', () => {
  const files = readdirSync(feedbackDir).filter((f) => f.endsWith('.json'))

  for (const file of files) {
    it(`validates ${file} structure`, () => {
      const data = JSON.parse(readFileSync(join(feedbackDir, file), 'utf8'))
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)

      for (const msg of data) {
        expect(msg).toHaveProperty('id')
        expect(msg).toHaveProperty('text')
        expect(msg).toHaveProperty('context')
        expect(msg).toHaveProperty('minLevel')
        expect(msg.id).toBeTruthy()
        expect(msg.text.length).toBeGreaterThanOrEqual(5)
        expect(msg.text.length).toBeLessThanOrEqual(500)
        expect(msg.context).toBeTruthy()
        expect(msg.minLevel).toBeTruthy()
      }

      // Check no duplicate IDs within file
      const ids = data.map((m: { id: string }) => m.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  }

  it('validates combined feedback library structure', () => {
    const allMessages: { id: string; text: string; file: string }[] = []

    for (const file of files) {
      const data = JSON.parse(readFileSync(join(feedbackDir, file), 'utf8'))
      for (const msg of data) {
        allMessages.push({ id: msg.id, text: msg.text, file })
      }
    }

    // Total messages >= 100
    expect(allMessages.length).toBeGreaterThanOrEqual(100)

    // No duplicate IDs across all files
    const allIds = allMessages.map((m) => m.id)
    expect(new Set(allIds).size).toBe(allIds.length)

    // No cold/blaming language
    const coldPatterns = ['incorrect.', 'wrong.', 'you failed', 'try harder', 'bad answer', 'stupid']
    for (const msg of allMessages) {
      const lower = msg.text.toLowerCase()
      for (const pattern of coldPatterns) {
        expect(lower).not.toContain(pattern)
      }
    }

    // Correct feedback has >= 20 messages
    const correct = JSON.parse(readFileSync(join(feedbackDir, 'correct.json'), 'utf8'))
    expect(correct.length).toBeGreaterThanOrEqual(20)

    // Incorrect feedback has >= 20 messages
    const incorrect = JSON.parse(readFileSync(join(feedbackDir, 'incorrect.json'), 'utf8'))
    expect(incorrect.length).toBeGreaterThanOrEqual(20)

    // Hints has >= 10 messages
    const hints = JSON.parse(readFileSync(join(feedbackDir, 'hints.json'), 'utf8'))
    expect(hints.length).toBeGreaterThanOrEqual(10)
  })
})
