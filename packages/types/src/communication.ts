export type CommunicationChannel = "message" | "call" | "meeting" | "note";
export type CommunicationParticipant = "parent" | "teacher" | "school-admin" | "student";
export interface CommunicationLog {
  id: string;
  initiatorId: string;
  initiatorRole: CommunicationParticipant;
  participantId: string;
  participantRole: CommunicationParticipant;
  channel: CommunicationChannel;
  subject: string;
  content: string;
  studentId?: string;
  consentRequired: boolean;
  consentVerified: boolean;
  timestamp: string;
}
