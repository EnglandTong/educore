export type PilotStatus = "planning" | "ready" | "active" | "paused" | "completed" | "cancelled";
export interface PilotPack {
  id: string;
  name: string;
  description: string;
  scope: "school" | "regional";
  targetSchools: string[];
  estimatedStudentCount: number;
  status: PilotStatus;
  runbook: string[];
  risks: Array<{ risk: string; mitigation: string; severity: "low" | "medium" | "high"; }>;
  acceptanceCriteria: string[];
  dataBoundaries: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
