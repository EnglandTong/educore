export type EvidenceCategory = "learning" | "teacher" | "family-school" | "volunteer" | "industry" | "talent" | "equity" | "privacy" | "safety";
export type EvidenceStrength = "supporting" | "strong" | "definitive";
export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  title: string;
  description: string;
  evidenceType: "automated-test" | "manual-test" | "documentation" | "metric" | "audit-log" | "user-feedback";
  strength: EvidenceStrength;
  source: string;
  timestamp: string;
  verified: boolean;
  verifiedBy?: string;
}
export interface TalentDevelopmentEvidencePack {
  id: string;
  period: string;
  evidence: EvidenceItem[];
  categoryCoverage: Record<EvidenceCategory, boolean>;
  summary: string;
  contributionToEducation: string;
  contributionToTalent: string;
  generatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}
