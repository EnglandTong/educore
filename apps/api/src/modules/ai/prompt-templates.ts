/**
 * Prompt Templates — Encouragement, explanation, path suggestion, and warm dialogue templates.
 * Separated from service logic so they can be maintained independently.
 */

// --- Encouragement Templates ---

export interface EncouragementInput {
  correctCount: number;
  totalCount: number;
  streakDays?: number;
}

export function pickEncouragement(input: EncouragementInput): string {
  const pct = input.totalCount > 0 ? Math.round((input.correctCount / input.totalCount) * 100) : 0;

  if (pct >= 90) {
    return messagesByTier.amazing[Math.floor(Math.random() * messagesByTier.amazing.length)]!;
  }
  if (pct >= 70) {
    return messagesByTier.great[Math.floor(Math.random() * messagesByTier.great.length)]!;
  }
  if (pct >= 50) {
    return messagesByTier.good[Math.floor(Math.random() * messagesByTier.good.length)]!;
  }
  return messagesByTier.encouraging[Math.floor(Math.random() * messagesByTier.encouraging.length)]!;
}

const messagesByTier = {
  amazing: [
    "You're on fire! Every answer shows how much you're growing. Keep shining! 🌟",
    "Incredible work! Your focus and effort are truly paying off. 🎉",
    "Wow — you're mastering this! So proud of the dedication you're showing. 💫",
  ],
  great: [
    "You're making great progress! Every step counts. Keep going! 🌟",
    "Beautiful work today! Your persistence is building something wonderful. 💪",
    "You're getting stronger with every question — that's what learning looks like! 📚",
  ],
  good: [
    "Learning takes courage, and you have plenty. Well done! 💪",
    "You're building knowledge one question at a time. That's fantastic! 📚",
    "Every attempt teaches us something new. You're doing amazing work! ✨",
  ],
  encouraging: [
    "Mistakes are just stepping stones to mastery. You've got this! 🎯",
    "Your persistence is truly inspiring. Keep up the amazing work! ✨",
    "Every expert was once a beginner. You're on the right path — keep going! 🌱",
  ],
};

// --- Explanation Templates ---

export interface ExplanationInput {
  correctAnswer: string;
  studentAnswer: string;
  subject?: string;
}

export function buildExplanationPrompt(input: ExplanationInput): string {
  return `You are a warm, encouraging tutor for elementary school students (ages 6-12). 
The student answered "${input.studentAnswer}" but the correct answer is "${input.correctAnswer}".
${input.subject ? `This is about ${input.subject}.` : ""}

Please explain in a kind, age-appropriate way:
1. First, acknowledge their effort
2. Then, gently explain the correct concept using simple words and relatable examples
3. End with encouragement to keep trying

Keep the explanation under 150 words and use short sentences.`;
}

// --- Path Suggestion Templates ---

export interface SuggestionInput {
  moduleId: string;
  skillScores: Record<string, number>;
}

export function buildSuggestionPrompt(input: SuggestionInput): string {
  const weakestSkills = Object.entries(input.skillScores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([k, v]) => `${k} (${Math.round(v * 100)}%)`);

  return `You are a friendly learning guide for elementary students. 
Based on their current skills, the areas needing most attention are: ${weakestSkills.join(", ")}.

Suggest 2-3 fun, low-pressure activities they can do to improve. 
Make each suggestion:
- Simple enough for a 6-12 year old to understand
- Mention a relatable real-world example
- End with an encouraging note

Keep the response under 120 words.`;
}

// --- Warm Dialogue Templates ---

export interface DialogueInput {
  question: string;
  context?: string;
}

export function buildChatPrompt(input: DialogueInput): string {
  const contextBlock = input.context
    ? `\nContext: The student is currently learning about "${input.context}".`
    : "";

  return `You are a friendly AI tutor for elementary school students (ages 6-12).
Your voice is warm, patient, and encouraging — like a kind older sibling or a favorite teacher.

Guidelines:
- Use simple words and short sentences${contextBlock}
- Relate concepts to everyday things a child would know
- If the student asks something off-topic, gently guide them back
- Never give answers directly — help them think through the problem
- Always end with encouragement or an invitation to ask more

Student's question: "${input.question}"

Respond warmly and age-appropriately (under 200 words):`;
}

// --- Fallback Responses ---

export const FALLBACK_RESPONSES = {
  chat: "That's a wonderful question! I'd love to help you think through it. Could you tell me a bit more about what you're learning in class?",
  explain: "Great effort! Understanding takes time. Let's review this together with your teacher for a more detailed explanation.",
  suggest: "Try practicing with short, focused sessions of 15-20 minutes. Then take a break and come back — you'll be amazed at how much you remember!",
  encourage: "You showed up today and gave it your best — that's what learning is all about! Every try makes you stronger. 🌟",
};
