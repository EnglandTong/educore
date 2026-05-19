/**
 * CheckIn Constants — M7 Gentle Check-In
 *
 * Weather metaphor for student mood check-ins.
 * Mirrors "心情气象站" from 光合·启途 predecessor.
 *
 * Never clinical, never blocking, never shaming.
 */

export const CHECKIN_MOODS = ["sunny", "cloudy", "rainy", "stormy"] as const;

export type CheckInMood = (typeof CHECKIN_MOODS)[number];

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
