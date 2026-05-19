import { z } from "zod";

export const createPathSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  moduleId: z.string().optional()
});

export const updatePathSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  moduleId: z.string().optional()
});

export const branchConditionSchema = z.object({
  skillId: z.string().min(1),
  operator: z.enum(["gte", "lt", "eq"]),
  thresholdScore: z.number().min(0).max(100),
  targetNodeId: z.string().min(1)
});

export const pathNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["module", "skill", "condition", "review", "challenge"]),
  moduleId: z.string().optional(),
  skillId: z.string().optional(),
  label: z.string().min(1),
  positionX: z.number(),
  positionY: z.number(),
  difficulty: z.number().min(0).max(100).optional(),
  branches: z.array(branchConditionSchema).default([])
});

const edgeConditionSchema = z.object({
  type: z.enum(["always", "score_above", "score_below"]),
  threshold: z.number().min(0).max(100).optional()
});

const pathEdgeSchema = z.object({
  id: z.string().min(1),
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  condition: edgeConditionSchema.optional()
});

export const saveGraphSchema = z.object({
  nodes: z.array(pathNodeSchema),
  edges: z.array(pathEdgeSchema)
});

export const publishPathSchema = z.object({
  assignedClassIds: z.array(z.string()).optional()
});

export const pathIdParam = z.object({
  id: z.string().min(1)
});

export type CreatePathInput = z.infer<typeof createPathSchema>;
export type UpdatePathInput = z.infer<typeof updatePathSchema>;
export type SaveGraphInput = z.infer<typeof saveGraphSchema>;
export type PublishPathInput = z.infer<typeof publishPathSchema>;
