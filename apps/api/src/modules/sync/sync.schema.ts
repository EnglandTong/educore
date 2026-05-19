import { z } from "zod";

export const syncBatchBodySchema = z.object({
  operations: z.array(
    z.object({
      type: z.enum(["submit_answer", "end_session"]),
      sessionId: z.string().min(1),
      payload: z.record(z.unknown()),
      clientTimestamp: z.number().nonnegative(),
    })
  ).min(1).max(100),
});

export const syncStatusQuerySchema = z.object({
  since: z.coerce.number().nonnegative().optional(),
});

export type SyncBatchBody = z.infer<typeof syncBatchBodySchema>;
export type SyncBatchOperation = SyncBatchBody["operations"][number];
