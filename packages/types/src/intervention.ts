export type InterventionStatus = "suggested" | "planned" | "in-progress" | "completed" | "cancelled";
export type InterventionType = "review-session" | "extra-practice" | "parent-contact" | "skill-retarget" | "group-activity";
export interface TeacherIntervention {
  id: string;
  teacherId: string;
  studentId: string;
  interventionType: InterventionType;
  status: InterventionStatus;
  source: string;
  action: string;
  followUpDate: string;
  followUpNote?: string;
  createdAt: string;
  updatedAt: string;
}
