export type WorkExposureType = "video" | "interview" | "site-visit" | "case-study" | "project" | "job-shadow";
export type WorkExposureStatus = "draft" | "pending-review" | "approved" | "published" | "archived";
export interface WorkEnvironmentContent {
  id: string;
  title: string;
  exposureType: WorkExposureType;
  enterpriseId?: string;
  industry: string;
  description: string;
  contentUrl?: string;
  sourceAttribution: string;
  reviewStatus: WorkExposureStatus;
  reviewedBy?: string;
  targetGradeLevels?: string[];
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
}
export interface WorkExposureRecord {
  id: string;
  studentId: string;
  contentId: string;
  viewedAt: string;
  reflectionNote?: string;
  consentVerified: boolean;
}
