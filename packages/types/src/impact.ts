export type ImpactMetricCategory = "learning-gains" | "opportunity-coverage" | "participation" | "engagement" | "equity" | "talent-development";
export interface ImpactMetric {
  id: string;
  category: ImpactMetricCategory;
  name: string;
  description: string;
  value: number;
  unit: string;
  target?: number;
  trend: "improving" | "stable" | "declining";
  demographicBreakdown?: Array<{ group: string; value: number; }>;
  recordedAt: string;
}
export interface ImpactDashboard {
  id: string;
  period: string;
  metrics: ImpactMetric[];
  summary: string;
  highlights: string[];
  areasOfConcern: string[];
  generatedAt: string;
}
export interface EquityMetric {
  id: string;
  metricName: string;
  overallValue: number;
  groupValues: Array<{ group: string; value: number; gap: number; }>;
  gapThreshold: number;
  measuredAt: string;
}
