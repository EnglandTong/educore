import { z } from "zod";

export const createQuestionSchema = z.object({
  moduleId: z.string().optional(),
  skillId: z.string().optional(),
  content: z.string().min(1).max(1000)
});

export const createAnswerSchema = z.object({
  content: z.string().min(1).max(2000)
});

export const rateAnswerSchema = z.object({
  rating: z.number().int().min(1).max(5)
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
export type RateAnswerInput = z.infer<typeof rateAnswerSchema>;
