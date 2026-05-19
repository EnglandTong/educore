export const CEFR_LEVELS = [
  { id: "A1", name: "Beginner", gradeRange: "1-2", order: 1 },
  { id: "A2", name: "Elementary", gradeRange: "3-4", order: 2 },
  { id: "B1", name: "Intermediate", gradeRange: "5-6", order: 3 },
  { id: "B2", name: "Upper Intermediate", gradeRange: "7-9", order: 4 },
  { id: "C1", name: "Advanced", gradeRange: "10-12", order: 5 },
  { id: "C2", name: "Mastery", gradeRange: "12+", order: 6 }
] as const;

export type CefrLevelId = (typeof CEFR_LEVELS)[number]["id"];
