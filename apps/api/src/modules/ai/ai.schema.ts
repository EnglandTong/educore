import { z } from "zod";

export const aiChatSchema = z.object({
  question: z.string().min(1).max(2000)
});

export const aiExplainSchema = z.object({
  questionId: z.string().optional(),
  studentAnswer: z.string(),
  correctAnswer: z.string()
});

export const aiSuggestSchema = z.object({
  moduleId: z.string(),
  skillScores: z.record(z.number())
});

export const aiEncourageSchema = z.object({
  recentPerformance: z.array(z.object({
    correct: z.boolean(),
    moduleId: z.string().optional()
  }))
});

export type AIChatInput = z.infer<typeof aiChatSchema>;
export type AIExplainInput = z.infer<typeof aiExplainSchema>;
export type AISuggestInput = z.infer<typeof aiSuggestSchema>;
export type AIEncourageInput = z.infer<typeof aiEncourageSchema>;
