export interface SchoolDashboardData {
  schoolId: string;
  schoolName: string;
  totalStudents: number;
  totalTeachers: number;
  gradeLevelSummaries: Array<{
    gradeLevel: string;
    studentCount: number;
    averageProgress: string;
    topStrengths: string[];
    needsSupportAreas: string[];
  }>;
}

export interface SchoolClassSummary {
  classId: string;
  teacherName: string;
  studentCount: number;
  classProgress: string;
  notableAchievements: string[];
}
