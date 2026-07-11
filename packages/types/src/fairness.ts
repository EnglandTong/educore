/**
 * Fair Opportunity Principles — M53 Fair Opportunity Principles
 *
 * Define equal treatment and opportunity fairness.
 * No negative labels by region, poverty, or school resources.
 */

/** Categories protected from labeling or bias */
export type FairnessCategory =
  | "region"
  | "poverty"
  | "school-resource"
  | "background"
  | "gender"
  | "disability";

/** A fairness rule describing what is prohibited and how it is enforced */
export interface FairnessRule {
  id: string;
  category: FairnessCategory;
  rule: string;
  description: string;
  enforcement: "block" | "warn" | "log";
}

/** Result of a fairness check on a piece of content */
export interface FairnessCheckResult {
  passed: boolean;
  violatedRules: FairnessRule[];
  warnings: string[];
}

/** The canonical set of fairness rules enforced across the platform */
export const FAIRNESS_RULES: FairnessRule[] = [
  { id: "FR-001", category: "region", rule: "no-region-labeling", description: "Do not label or rank students by geographic region", enforcement: "block" },
  { id: "FR-002", category: "poverty", rule: "no-poverty-labeling", description: "Do not label or rank students by economic status", enforcement: "block" },
  { id: "FR-003", category: "school-resource", rule: "no-resource-labeling", description: "Do not label or rank students by school resource level", enforcement: "block" },
  { id: "FR-004", category: "background", rule: "no-background-labeling", description: "Do not label or rank students by family background", enforcement: "block" },
  { id: "FR-005", category: "gender", rule: "no-gender-bias", description: "Do not show gender-based bias in recommendations or feedback", enforcement: "block" },
  { id: "FR-006", category: "disability", rule: "no-disability-labeling", description: "Do not label or rank students by disability status", enforcement: "block" }
];

/**
 * Check content for fairness violations using basic labeling patterns.
 * Returns the violated rules and warnings for each detected pattern.
 */
export function checkFairness(content: string): FairnessCheckResult {
  // Basic check for labeling patterns
  const violations: FairnessRule[] = [];
  const warnings: string[] = [];
  const povertyRule = FAIRNESS_RULES.find((rule) => rule.id === "FR-002");
  const labelPatterns = [/poor\s+student/i, /rich\s+student/i, /urban\s+student/i, /rural\s+student/i, /low-income/i, /disadvantaged/i];
  for (const pattern of labelPatterns) {
    if (pattern.test(content)) {
      if (povertyRule) {
        violations.push(povertyRule); // poverty labeling
      }
      warnings.push(`Content contains potentially labeling language: ${pattern.source}`);
    }
  }
  return { passed: violations.length === 0, violatedRules: violations, warnings };
}
