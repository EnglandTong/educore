export type EnterpriseStatus = "pending" | "approved" | "active" | "suspended" | "disabled";
export type EnterpriseProgramType = "industry-intro" | "internship" | "mentorship" | "cultivation" | "scholarship" | "site-visit";
export interface VolunteerEnterprise {
  id: string;
  name: string;
  industry: string;
  description: string;
  status: EnterpriseStatus;
  ownerId: string;
  contactEmail: string;
  contactPhone?: string;
  programTypes: EnterpriseProgramType[];
  reviewStatus: "pending" | "reviewing" | "approved" | "rejected";
  reviewedBy?: string;
  approvedAt?: string;
  safetyCheckPassed: boolean;
  fairnessAgreementSigned: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface EnterpriseProgram {
  id: string;
  enterpriseId: string;
  name: string;
  programType: EnterpriseProgramType;
  description: string;
  capacity: number;
  enrolledStudentIds: string[];
  consentRequired: boolean;
  status: "draft" | "open" | "closed" | "active" | "completed";
  startDate?: string;
  endDate?: string;
  createdAt: string;
}
