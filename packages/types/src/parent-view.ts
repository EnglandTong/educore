export interface ParentDashboardData {
  parentId: string;
  children: Array<{
    childId: string;
    childName: string;
    gradeLevel?: string;
    progressSummary: string;
    strengths: string[];
    supportSuggestions: string[];
    lastActiveDate?: string;
  }>;
}

export interface ParentProgressReport {
  childId: string;
  childName: string;
  overallProgress: string;
  subjectProgress: Array<{
    subject: string;
    status: "on-track" | "needs-support" | "excelling";
    description: string;
  }>;
  encouragementNote: string;
  generatedAt: string;
}
