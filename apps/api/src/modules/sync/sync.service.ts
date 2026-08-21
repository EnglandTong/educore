import type { SyncBatchBody, SyncBatchOperation } from "./sync.schema.js";
import { AnswerEvent } from "../../models/AnswerEvent.js";
import { SyncEvent } from "../../models/SyncEvent.js";

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
    const eventId = op.eventId ?? (op.payload.eventId as string | undefined);
    let receipt = eventId ? await SyncEvent.findOne({ studentId: userId, eventId }) : null;
    try {
      if (receipt?.status === "completed") {
        synced++;
        continue;
      }
      if (!receipt && eventId) {
        receipt = await SyncEvent.create({ studentId: userId, eventId, operation: op.type, status: "processing" });
      }
      await processOperation(userId, op);
      if (receipt) {
        receipt.status = "completed";
        await receipt.save();
      }
      synced++;
    } catch (err) {
      if (receipt?.status === "processing") await SyncEvent.deleteOne({ _id: receipt._id });
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
        eventId: op.eventId ?? (op.payload.eventId as string | undefined),
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
  userId: string,
): Promise<{ pendingOperations: number; lastSyncedAt: string | null }> {
  const [pendingAnswer, pendingSync, latestAnswer, latestSync] = await Promise.all([
    AnswerEvent.countDocuments({ studentId: userId, status: "processing" }),
    SyncEvent.countDocuments({ studentId: userId, status: "processing" }),
    AnswerEvent.findOne({ studentId: userId, status: "completed" }).sort({ updatedAt: -1 }).lean(),
    SyncEvent.findOne({ studentId: userId, status: "completed" }).sort({ updatedAt: -1 }).lean()
  ]);
  const latest = [latestAnswer?.updatedAt, latestSync?.updatedAt]
    .filter((value): value is Date => value instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return {
    pendingOperations: pendingAnswer + pendingSync,
    lastSyncedAt: latest ? latest.toISOString() : null
  };
}
