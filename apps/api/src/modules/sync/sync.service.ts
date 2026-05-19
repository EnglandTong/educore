import type { SyncBatchBody, SyncBatchOperation } from "./sync.schema.js";

export interface SyncResult {
  synced: number;
  failed: number;
  errors: Array<{ index: number; message: string }>;
}

export async function processSyncBatch(
  userId: string,
  body: SyncBatchBody,
): Promise<SyncResult> {
  const errors: Array<{ index: number; message: string }> = [];
  let synced = 0;

  for (let i = 0; i < body.operations.length; i++) {
    const op = body.operations[i] as SyncBatchOperation;
    try {
      await processOperation(userId, op);
      synced++;
    } catch (err) {
      errors.push({
        index: i,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return { synced, failed: errors.length, errors };
}

async function processOperation(
  userId: string,
  op: SyncBatchOperation,
): Promise<void> {
  switch (op.type) {
    case "submit_answer": {
      const { submitLearningAnswer } = await import("../../services/learning.service.js");
      await submitLearningAnswer(userId, {
        sessionId: op.sessionId,
        questionId: op.payload.questionId as string,
        answer: op.payload.answer as string | string[],
        timeSpent: op.payload.timeSpent as number | undefined,
        hintsUsed: op.payload.hintsUsed as number | undefined,
      });
      break;
    }
    case "end_session": {
      const { endLearningSession } = await import("../../services/learning.service.js");
      const sessionType = (op.payload.sessionType as string) ?? "training";
      await endLearningSession(userId, sessionType as "diagnostic" | "training" | "review" | "challenge");
      break;
    }
    default:
      throw new Error(`Unknown operation type: ${(op as Record<string, unknown>).type as string}`);
  }
}

export async function getSyncStatus(
  _userId: string,
): Promise<{ pendingOperations: number; lastSyncedAt: string | null }> {
  // Placeholder — in production, query sync_log collection
  return { pendingOperations: 0, lastSyncedAt: null };
}
