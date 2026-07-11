export type OrgStatus = "pending" | "approved" | "active" | "suspended" | "disabled";
export interface VolunteerOrganization {
  id: string;
  name: string;
  description: string;
  status: OrgStatus;
  ownerId: string;
  contactEmail: string;
  contactPhone?: string;
  serviceScope: string[];
  volunteerIds: string[];
  reviewStatus: "pending" | "reviewing" | "approved" | "rejected";
  reviewedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}
export interface ServiceProject {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  volunteerIds: string[];
  status: "draft" | "active" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
  createdAt: string;
}
