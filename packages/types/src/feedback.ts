export type FeedbackType = "bug" | "feature-request" | "usability" | "content" | "performance" | "safety" | "other";
export type FeedbackPriority = "critical" | "high" | "medium" | "low";
export type FeedbackStatus = "new" | "triaged" | "in-progress" | "resolved" | "wontfix";
export interface PilotFeedback {
  id: string;
  pilotId: string;
  submitterId: string;
  submitterRole: string;
  feedbackType: FeedbackType;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  title: string;
  description: string;
  affectedArea?: string;
  suggestedAction?: string;
  linkedWorkOrderId?: string;
  createdAt: string;
  resolvedAt?: string;
}
export interface FeedbackSummary {
  pilotId: string;
  totalFeedback: number;
  byPriority: Record<FeedbackPriority, number>;
  byStatus: Record<FeedbackStatus, number>;
  topIssues: Array<{ feedbackId: string; title: string; priority: FeedbackPriority; }>;
  nextWorkOrders: Array<{ title: string; description: string; priority: FeedbackPriority; }>;
  generatedAt: string;
}
