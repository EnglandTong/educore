import { z } from 'zod'

export const feedbackMessageSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(5).max(500),
  context: z.string().min(1),
  minLevel: z.string().min(1),
})

export const feedbackSchema = z.object({
  correct: z.array(feedbackMessageSchema).min(1),
  incorrect: z.array(feedbackMessageSchema).min(1),
  hints: z.array(feedbackMessageSchema).min(1),
  levelUp: z.array(feedbackMessageSchema).min(1),
  comeback: z.array(feedbackMessageSchema).min(1),
  streak: z.array(feedbackMessageSchema).min(1),
})

export type ValidatedFeedback = z.infer<typeof feedbackSchema>
