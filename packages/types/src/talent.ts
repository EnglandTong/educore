export type SignalSource = "practice" | "diagnostic" | "self-report" | "teacher-observation" | "parent-observation" | "project" | "competition";
export type SignalType = "interest" | "effort" | "performance" | "outcome" | "aptitude";
export interface TalentSignal {
  id: string;
  studentId: string;
  signalType: SignalType;
  source: SignalSource;
  domain: string;
  description: string;
  strength: "emerging" | "developing" | "strong" | "exceptional";
  evidence?: string;
  recordedAt: string;
  nonDiscriminatory: boolean;
  reviewable: boolean;
}
export interface TalentProfile {
  studentId: string;
  signals: TalentSignal[];
  topInterests: string[];
  aptitudeAreas: string[];
  lastUpdated: string;
}
