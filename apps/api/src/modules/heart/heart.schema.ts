import { z } from "zod";

export const createJournalSchema = z.object({
  date: z.string().optional(),
  mood: z.enum(["happy", "calm", "sad", "anxious", "angry", "tired"]),
  content: z.string().max(2000).optional(),
  isPrivate: z.boolean().default(false)
});

export const createProudMomentSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional()
});

export const addReactionSchema = z.object({
  type: z.enum(["heart", "star", "thumbsup", "hug"])
});

export const createMoodLogSchema = z.object({
  date: z.string().optional(),
  mood: z.enum(["😊", "😌", "😢", "😰", "😤", "😴", "🤔", "🥰"]),
  note: z.string().max(200).optional()
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type CreateProudMomentInput = z.infer<typeof createProudMomentSchema>;
export type AddReactionInput = z.infer<typeof addReactionSchema>;
export type CreateMoodLogInput = z.infer<typeof createMoodLogSchema>;
