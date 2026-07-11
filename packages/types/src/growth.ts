export type GrowthMetric =
  | "skill-mastery"
  | "practice-consistency"
  | "improvement-rate"
  | "engagement"
  | "confidence";

export interface GrowthRecord {
  id: string;
  studentId: string;
  metric: GrowthMetric;
  value: number;
  trend: "improving" | "stable" | "declining";
  recordedAt: string;
  context?: string;
}

export interface StudentGrowthPortfolio {
  studentId: string;
  strengths: string[];
  growthAreas: string[];
  interests: string[];
  progressSummary: string;
  metrics: GrowthRecord[];
  lastUpdated: string;
}

export interface GrowthReport {
  portfolio: StudentGrowthPortfolio;
  narrative: string;
  generatedAt: string;
}
