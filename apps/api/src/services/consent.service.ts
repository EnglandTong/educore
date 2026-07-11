import type { ConsentType, StudentContactRule } from "@educore/types";

import { ConsentRecord } from "../models/ConsentRecord.js";
import { AppError } from "../utils/errors.js";

/**
 * Check whether a student currently has a granted (and non-expired) consent
 * for the given consent type.
 */
export async function hasConsent(studentId: string, consentType: ConsentType): Promise<boolean> {
  const record = await ConsentRecord.findOne({ studentId, consentType }).lean();
  if (!record || record.status !== "granted") {
    return false;
  }

  if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) {
    return false;
  }

  return true;
}

/**
 * Grant consent for a given student and consent type. Updates an existing
 * record or upserts a new one. Records the authorizer and timestamp.
 */
export async function grantConsent(
  studentId: string,
  consentType: ConsentType,
  grantedBy: string,
  options?: { expiresAt?: Date; auditNote?: string }
) {
  const now = new Date();
  const updated = await ConsentRecord.findOneAndUpdate(
    { studentId, consentType },
    {
      $set: {
        status: "granted" as const,
        grantedBy,
        grantedAt: now,
        revokedAt: undefined,
        expiresAt: options?.expiresAt,
        auditNote: options?.auditNote
      },
      $setOnInsert: {
        studentId,
        consentType
      }
    },
    { upsert: true, new: true }
  ).lean();

  return updated;
}

/**
 * Revoke a previously granted consent. Records the revoker and timestamp.
 * Throws AppError if no record exists.
 */
export async function revokeConsent(
  studentId: string,
  consentType: ConsentType,
  revokedBy: string,
  options?: { auditNote?: string }
) {
  const now = new Date();
  const auditNote = options?.auditNote
    ? `${options.auditNote} (revoked by ${revokedBy})`
    : `revoked by ${revokedBy}`;
  const updated = await ConsentRecord.findOneAndUpdate(
    { studentId, consentType },
    {
      $set: {
        status: "revoked" as const,
        revokedAt: now,
        auditNote
      }
    },
    { new: true }
  ).lean();

  if (!updated) {
    throw new AppError(404, "NOT_FOUND", "We could not find that consent record. Let's check the details and try again.");
  }

  return updated;
}

/**
 * Require that consent is granted for the given student and consent type.
 * Throws AppError (403) if consent is missing, revoked, or expired.
 */
export async function requireConsent(studentId: string, consentType: ConsentType): Promise<void> {
  const granted = await hasConsent(studentId, consentType);
  if (!granted) {
    throw new AppError(
      403,
      "FORBIDDEN",
      "This action needs consent from a parent or guardian before it can continue."
    );
  }
}

/**
 * Build the student contact rules based on currently granted consents.
 * Volunteer/enterprise/mentorship contact types require supervision and audit.
 */
export async function getStudentContactRules(studentId: string): Promise<StudentContactRule> {
  const records = await ConsentRecord.find({ studentId, status: "granted" }).lean();

  const allowedContactTypes: ConsentType[] = [];
  let requiresSupervision = false;

  for (const record of records) {
    if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) {
      continue;
    }
    allowedContactTypes.push(record.consentType);
    if (
      record.consentType === "volunteer-contact" ||
      record.consentType === "enterprise-contact" ||
      record.consentType === "mentorship"
    ) {
      requiresSupervision = true;
    }
  }

  return {
    studentId,
    allowedContactTypes,
    requiresSupervision,
    auditEnabled: true
  };
}
