export type MatchStatus = "pending" | "proposed" | "accepted" | "rejected" | "active" | "completed" | "cancelled";
export type MatchResourceType = "volunteer" | "volunteer-teacher" | "volunteer-school" | "volunteer-org" | "volunteer-enterprise" | "program" | "mentor";
export type MatchNeedType = "subject-help" | "career-guidance" | "industry-exposure" | "mentorship" | "resource" | "practice";
export interface MatchRequest {
  id: string;
  studentId: string;
  needType: MatchNeedType;
  description: string;
  preferredSubjects?: string[];
  urgency: "low" | "medium" | "high";
  consentGiven: boolean;
  status: MatchStatus;
  createdAt: string;
}
export interface MatchResult {
  id: string;
  matchRequestId: string;
  resourceType: MatchResourceType;
  resourceId: string;
  resourceName: string;
  matchScore: number;
  matchReason: string;
  status: MatchStatus;
  consentRequired: boolean;
  auditTrail: string[];
  createdAt: string;
}
export interface MatchingRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  priority: number;
  active: boolean;
}
