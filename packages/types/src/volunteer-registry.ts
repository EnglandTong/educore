export type VolunteerStatus = "pending" | "approved" | "active" | "suspended" | "disabled";
export type VolunteerSupportType = "qa" | "content" | "mentorship" | "teaching" | "industry-intro" | "resource-provision";
export type VolunteerDomain = "math" | "science" | "english" | "chinese" | "arts" | "technology" | "career-guidance" | "general";
export interface VolunteerRecord {
  id: string;
  userId: string;
  status: VolunteerStatus;
  supportTypes: VolunteerSupportType[];
  domain: VolunteerDomain;
  organizationId?: string;
  reviewStatus: "pending" | "reviewing" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  backgroundCheckStatus?: "pending" | "passed" | "failed";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
