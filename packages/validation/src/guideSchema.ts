import { z } from 'zod'

export const guideSchema = z.object({
  skillId: z.string().min(1),
  skillName: z.string().min(1),
  title: z.string().min(1),
  whatIsIt: z.string().min(20),
  howToHelp: z.array(z.string().min(10)).min(1),
  commonMistakes: z.array(z.string().min(5)).min(1),
  signsOfProgress: z.array(z.string().min(5)).min(1),
  ifStruggling: z.array(z.string().min(10)).min(1),
})

export type ValidatedGuide = z.infer<typeof guideSchema>
