import { z } from 'zod'

export const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  subSkills: z.array(z.string()),
  order: z.number().int().min(1),
})

export const manifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  subject: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  targetAge: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  }),
  skills: z.array(skillSchema).min(1),
  levels: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      gradeRange: z.string().min(1),
      order: z.number().int().min(1),
    })
  ),
  questionTypes: z.array(z.string()).min(1),
  diagnostic: z.object({
    rounds: z.number().int().min(1),
    questionsPerRound: z.number().int().min(1),
    strategy: z.string().min(1),
  }),
  training: z.object({
    sessionLength: z.number().int().min(1),
    adaptiveWeights: z.object({
      weak: z.number().min(0).max(100),
      current: z.number().min(0).max(100),
      review: z.number().min(0).max(100),
    }),
    masteryThreshold: z.number().min(0).max(100),
  }),
})

export type ValidatedManifest = z.infer<typeof manifestSchema>
