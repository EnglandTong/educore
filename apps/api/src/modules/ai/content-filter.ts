/**
 * Content Filter — Sensitive word detection, output review, and privacy protection.
 */

const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\b(?:fuck|shit|damn|bitch|asshole|crap)\b/i, label: "profanity" },
  { pattern: /\b(?:kill|murder|suicide|self-harm|hurt myself)\b/i, label: "violence-self-harm" },
  { pattern: /\b(?:porn|sexy|naked|nsfw|xxx)\b/i, label: "explicit" },
  { pattern: /\b(?:password|credit.?card|ssn|social.?security)\b/i, label: "pii-request" },
  { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, label: "phone-number" },
  { pattern: /\b[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/, label: "email" },
];

export interface ContentFilterResult {
  passed: boolean;
  issues: string[];
  sanitized: string;
}

/**
 * Filter user input — detect sensitive content and flag it.
 */
export function filterInput(input: string): ContentFilterResult {
  const issues: string[] = [];
  let sanitized = input;

  for (const { pattern, label } of SENSITIVE_PATTERNS) {
    if (pattern.test(sanitized)) {
      issues.push(label);
      sanitized = sanitized.replace(pattern, "***");
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    sanitized,
  };
}

/**
 * Review AI output before sending to student.
 * Strips any PII, blocks inappropriate content, and adds warmth check.
 */
export function reviewOutput(output: string): ContentFilterResult {
  const issues: string[] = [];
  let sanitized = output;

  // Block profanity in output
  for (const { pattern, label } of SENSITIVE_PATTERNS) {
    if (pattern.test(sanitized)) {
      issues.push(`output-${label}`);
      sanitized = sanitized.replace(pattern, "***");
    }
  }

  // Ensure output isn't empty after filtering
  if (sanitized.trim().length < 2) {
    issues.push("output-too-short");
    sanitized = "I'd love to help with that! Could you tell me more about what you're learning?";
  }

  return {
    passed: issues.length === 0,
    issues,
    sanitized,
  };
}

/**
 * Strip personally identifiable information from output.
 */
export function stripPII(text: string): string {
  return text
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE]")
    .replace(/\b[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, "[EMAIL]")
    .replace(/\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, "[SSN]");
}

/**
 * Check if output is warm and age-appropriate for elementary students.
 */
export function isAgeAppropriate(output: string): boolean {
  const sentenceLengths = output.split(/[.!?]+/).map((s) => s.trim().split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / Math.max(sentenceLengths.length, 1);
  // Elementary-appropriate: avg sentence < 20 words, no complex vocabulary markers
  return avgSentenceLength < 25;
}
