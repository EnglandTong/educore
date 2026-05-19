export type UserRole = "student" | "parent" | "teacher" | "admin" | "volunteer" | "school-admin";

export interface UserPreferences {
  language: "en" | "zh";
  theme: "light" | "dark" | "auto";
  dailyGoal?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  nickname?: string;
  age?: number;
  gradeLevel?: string;
  createdAt: string;
  preferences?: UserPreferences;
}

export interface GuardianLink {
  parentId: string;
  studentId: string;
  relationship: string;
  consentGiven: boolean;
  consentDate?: string;
}
