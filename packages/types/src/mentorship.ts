export type MentorshipStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
export type MentorshipFormat = "video" | "chat" | "in-person" | "async";
export interface MentorshipSession {
  id: string;
  mentorId: string;
  menteeId: string;
  format: MentorshipFormat;
  status: MentorshipStatus;
  topic: string;
  description: string;
  scheduledAt: string;
  durationMinutes: number;
  consentVerified: boolean;
  recordingEnabled: boolean;
  feedbackSubmitted: boolean;
  createdAt: string;
}
export interface MentorshipFeedback {
  id: string;
  sessionId: string;
  fromUserId: string;
  rating: number;
  comments: string;
  wouldRecommend: boolean;
  createdAt: string;
}
