import { z } from 'zod'

export const choiceSchema = z.object({
  key: z.string().length(1),
  text: z.string().min(1).max(500),
})

export const questionSchema = z
  .object({
    id: z.string().regex(/^eg-[a-z]\d-\d{3,4}$/),
    moduleId: z.literal('english.grammar'),
    skill: z.enum([
      'tense-aspect',
      'subject-verb-agreement',
      'articles-determiners',
      'prepositions',
      'conditionals',
      'passive-voice',
      'modal-verbs',
      'relative-clauses',
      'reported-speech',
      'conjunctions-connectors',
    ]),
    subSkill: z.string().optional(),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    questionType: z.enum([
      'multiple-choice',
      'gap-filling',
      'transformation',
      'matching',
      'cloze',
      'true-false',
      'error-correction',
      'open',
    ]),
    difficulty: z.number().min(0).max(1),
    prompt: z.string().min(10).max(1000),
    choices: z.array(choiceSchema).min(2).max(6).optional(),
    answerKey: z.union([z.string(), z.array(z.string())]),
    explanation: z.string().min(20).max(2000),
    explanationSteps: z.array(z.string()).min(2).max(6),
    hints: z.array(z.string()).min(3).max(3),
    wrongChoiceReasons: z.record(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    estimatedTimeSec: z.number().min(5).max(300).optional(),
  })
  .refine(
    (q) => {
      if (q.questionType === 'multiple-choice') {
        return q.choices && q.choices.length >= 3 && q.wrongChoiceReasons
      }
      return true
    },
    {
      message:
        'Multiple choice questions must have choices and wrongChoiceReasons',
    }
  )
  .refine(
    (q) => {
      if (q.questionType === 'multiple-choice' && q.choices) {
        const keys = q.choices.map((c) => c.key)
        return typeof q.answerKey === 'string' && keys.includes(q.answerKey)
      }
      return true
    },
    {
      message: 'Answer key must match one of the choices',
    }
  )

export type ValidatedQuestion = z.infer<typeof questionSchema>
