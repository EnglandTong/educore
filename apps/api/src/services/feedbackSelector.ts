export function selectWarmFeedback(kind: "correct" | "notQuite" | "streak" | "comeback"): string {
  const messages = {
    correct: "Nice work. Your practice is paying off.",
    notQuite: "Not quite yet, but your thinking is moving in the right direction.",
    streak: "You're building a steady rhythm. Keep going.",
    comeback: "Welcome back. Let's pick up from your next helpful step."
  } as const;
  return messages[kind];
}
