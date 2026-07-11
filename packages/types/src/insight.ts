export type InsightType =
  | "weak-area"
  | "progress-signal"
  | "intervention-suggestion"
  | "class-trend"
  | "student-flag";

export type InsightPriority = "high" | "medium" | "low";

export interface TeacherInsight {
  id: string;
  teacherId: string;
  insightType: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  affectedStudentIds?: string[];
  suggestedAction: string;
  dataReference?: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface ClassInsightSummary {
  classId: string;
  teacherId: string;
  totalStudents: number;
  weakAreas: Array<{ skillId: string; skillName: string; strugglingCount: number }>;
  progressSignals: Array<{ direction: "up" | "down" | "flat"; studentCount: number }>;
  topInsights: TeacherInsight[];
  generatedAt: string;
}
