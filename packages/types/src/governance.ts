export type ResourceReviewStatus = "pending" | "approved" | "rejected" | "flagged" | "removed";
export type ResourceType = "volunteer" | "organization" | "enterprise" | "content" | "program" | "mentor";
export interface ResourceReview {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  reviewerId: string;
  status: ResourceReviewStatus;
  rating?: number;
  comments?: string;
  reviewedAt: string;
}
export interface ResourceComplaint {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  complainantId: string;
  reason: string;
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
}
export interface ResourceTakedown {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  reason: string;
  authorizedBy: string;
  takedownAt: string;
  reversible: boolean;
}
