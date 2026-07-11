export type EcosystemJourneyRole = "student" | "parent" | "teacher" | "school-admin" | "volunteer" | "volunteer-org" | "volunteer-enterprise";
export interface E2EJourneyStep {
  stepId: string;
  role: EcosystemJourneyRole;
  action: string;
  expectedOutcome: string;
  verificationMethod: "automated" | "manual" | "mixed";
  consentRequired: boolean;
  auditLogged: boolean;
}
export interface E2EJourney {
  id: string;
  name: string;
  description: string;
  roles: EcosystemJourneyRole[];
  steps: E2EJourneyStep[];
  estimatedDuration: string;
  status: "draft" | "ready" | "active" | "deprecated";
}
export interface E2EJourneyResult {
  journeyId: string;
  executedAt: string;
  stepsPassed: number;
  stepsFailed: number;
  stepsSkipped: number;
  evidence: Array<{ stepId: string; passed: boolean; notes?: string; }>;
  overallStatus: "pass" | "fail" | "partial";
}
