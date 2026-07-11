export type CultivationStatus = "draft" | "open" | "enrolled" | "in-progress" | "completed" | "cancelled";
export interface CultivationPath {
  id: string;
  enterpriseId: string;
  name: string;
  description: string;
  stages: Array<{
    name: string;
    description: string;
    duration: string;
    milestones: string[];
  }>;
  capacity: number;
  enrolledStudentIds: string[];
  status: CultivationStatus;
  parentAuthorizationRequired: boolean;
  schoolAuthorizationRequired: boolean;
  transparentRecords: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CultivationEnrollment {
  id: string;
  pathId: string;
  studentId: string;
  parentConsentVerified: boolean;
  schoolConsentVerified: boolean;
  enrolledAt: string;
  currentStage: number;
  progressNotes: string[];
  status: CultivationStatus;
}
