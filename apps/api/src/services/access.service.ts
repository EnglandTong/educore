import type { FastifyRequest } from "fastify";

import { GuardianLink } from "../models/GuardianLink.js";
import { AppError } from "../utils/errors.js";

export type AuthenticatedUser = NonNullable<FastifyRequest["user"]>;

export function assertRole(user: AuthenticatedUser, allowed: Array<AuthenticatedUser["role"]>): void {
  if (!allowed.includes(user.role)) {
    throw new AppError(403, "FORBIDDEN", "This space is reserved for another part of the community. Let's head back to your own area.");
  }
}

export async function requireGuardianLink(parentId: string, studentId: string, requireConsent = true) {
  const link = await GuardianLink.findOne({ parentId, studentId }).lean();
  if (!link || (requireConsent && !link.consentGiven)) {
    throw new AppError(403, "FORBIDDEN", "This child is not linked to your account yet. Let's finish the connection first.");
  }

  return link;
}

export async function listConsentedGuardianLinks(parentId: string) {
  return GuardianLink.find({ parentId, consentGiven: true }).lean();
}

export function requireTeacherOrAdmin(user: AuthenticatedUser): void {
  assertRole(user, ["teacher", "admin"]);
}

export async function requireParent(user: AuthenticatedUser): Promise<void> {
  assertRole(user, ["parent"]);
}
