export type VolunteerEducatorStatus = "pending" | "approved" | "active" | "suspended" | "disabled";
export type VolunteerEducatorType = "volunteer-teacher" | "volunteer-school";
export interface VolunteerEducator {
  id: string;
  userId: string;
  educatorType: VolunteerEducatorType;
  status: VolunteerEducatorStatus;
  schoolId?: string;
  subjects: string[];
  gradeLevels: string[];
  reviewStatus: "pending" | "reviewing" | "approved" | "rejected";
  reviewedBy?: string;
  contentReviewRequired: boolean;
  serviceLogEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface VolunteerEducatorServiceLog {
  id: string;
  educatorId: string;
  serviceType: string;
  description: string;
  durationMinutes: number;
  date: string;
  studentIds?: string[];
  consentVerified: boolean;
  reviewableContent: boolean;
}
