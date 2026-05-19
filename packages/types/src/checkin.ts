/**
 * CheckIn DTOs — M7 Gentle Check-In
 *
 * Students share a daily mood (weather metaphor) + optional emoji and note.
 * Check-ins are visible ONLY to the owning student.
 * Never blocking, never clinical, never shaming.
 */

/** Weather-based mood — mirrors "心情气象站" metaphor from 光合·启途 */
export type CheckInMood =
  | "sunny"    // Great day
  | "cloudy"   // Okay day
  | "rainy"    // Struggling
  | "stormy";  // Really hard

export const CHECKIN_MOODS: CheckInMood[] = ["sunny", "cloudy", "rainy", "stormy"];

export const CHECKIN_MOOD_LABELS: Record<CheckInMood, string> = {
  sunny: "Great day!",
  cloudy: "An okay day",
  rainy: "A bit rough",
  stormy: "Really hard"
};

export const CHECKIN_MOOD_EMOJIS: Record<CheckInMood, string> = {
  sunny: "☀️",
  cloudy: "⛅",
  rainy: "🌧️",
  stormy: "⛈️"
};

/** Request: save a daily check-in */
export interface CreateCheckInRequest {
  mood: CheckInMood;
  emoji?: string;
  note?: string;
}

/** Response: a saved check-in */
export interface CheckInDTO {
  id: string;
  studentId: string;
  mood: CheckInMood;
  emoji?: string;
  note?: string;
  date: string;        // ISO date (YYYY-MM-DD) — one per day
  createdAt: string;   // ISO datetime
}

/** Response: confirmation with warm message */
export interface CheckInResponse {
  checkIn: CheckInDTO;
  message: string;     // Warm confirmation text
}

/** Response: list of check-ins */
export interface CheckInListResponse {
  checkIns: CheckInDTO[];
  streak: number;      // Consecutive days with check-ins
  total: number;
}
