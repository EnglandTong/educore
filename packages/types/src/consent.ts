/**
 * Consent DTOs — M52 Student Protection & Consent
 *
 * Defines parent/school consent, student-contact boundaries, and audit rules.
 * No direct student contact without authorization and traceability.
 */

/** Consent categories governing different forms of student contact and data use */
export type ConsentType =
  | "parent-guardian"
  | "school"
  | "volunteer-contact"
  | "enterprise-contact"
  | "mentorship"
  | "data-sharing";

/** Lifecycle status of a consent record */
export type ConsentStatus = "pending" | "granted" | "revoked" | "expired";

/** A consent record capturing who authorized what, when, and audit context */
export interface ConsentRecord {
  id: string;
  studentId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  grantedBy: string; // parent/guardian user ID
  grantedAt?: string;
  revokedAt?: string;
  expiresAt?: string;
  auditNote?: string;
}

/** Contact rules describing how a student may be contacted */
export interface StudentContactRule {
  studentId: string;
  allowedContactTypes: ConsentType[];
  requiresSupervision: boolean;
  auditEnabled: boolean;
}
