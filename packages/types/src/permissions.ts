import type { UserRole } from "./user.js";

/**
 * Permission identifiers used across the EduCore ecosystem.
 * Permissions are grouped by domain: learning, teaching, community, volunteer, governance.
 */
export type Permission =
  // Learning
  | "learning:practice"
  | "learning:diagnostic"
  | "learning:wrong-answers"
  | "learning:progress:view"
  // Teaching
  | "teaching:class:view"
  | "teaching:assignment:view"
  | "teaching:student:detail"
  | "teaching:intervention"
  // Parent
  | "parent:child:progress"
  | "parent:child:guide"
  // Community
  | "community:view"
  | "community:post"
  // Volunteer
  | "volunteer:qa:answer"
  | "volunteer:profile:manage"
  | "volunteer:content:submit"
  // Volunteer org/enterprise
  | "volunteer-org:manage"
  | "volunteer-enterprise:program:manage"
  // Governance
  | "governance:audit:view"
  | "governance:user:manage"
  | "governance:school:manage"
  | "governance:volunteer:approve"
  // Growth
  | "growth:portfolio:view"
  | "growth:portfolio:manage";

/**
 * Defines what a role can do, what data it can see, and what is forbidden.
 */
export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
  visibleData: string[];
  forbiddenActions: string[];
}

/**
 * The canonical permission matrix for all 10 roles in the ecosystem.
 * This is the single source of truth for role-based access control.
 */
export const PERMISSION_MATRIX: Record<UserRole, RolePermission> = {
  student: {
    role: "student",
    permissions: [
      "learning:practice",
      "learning:diagnostic",
      "learning:wrong-answers",
      "learning:progress:view",
      "growth:portfolio:view",
    ],
    visibleData: ["own profile", "own progress", "own wrong answers", "own growth portfolio"],
    forbiddenActions: [
      "view other students' data",
      "contact volunteers without consent",
      "access teacher dashboards",
      "access admin panels",
    ],
  },
  parent: {
    role: "parent",
    permissions: [
      "parent:child:progress",
      "parent:child:guide",
      "community:view",
      "community:post",
    ],
    visibleData: ["linked children progress", "linked children guides", "community posts"],
    forbiddenActions: [
      "view unlinked children",
      "access teacher class data",
      "contact volunteers without consent",
      "modify learning content",
    ],
  },
  teacher: {
    role: "teacher",
    permissions: [
      "teaching:class:view",
      "teaching:assignment:view",
      "teaching:student:detail",
      "teaching:intervention",
      "community:view",
    ],
    visibleData: ["assigned class overview", "assigned student details", "weak area signals", "progress signals"],
    forbiddenActions: [
      "view students not assigned to them",
      "contact students outside the platform",
      "modify student grades directly",
      "access admin panels",
    ],
  },
  admin: {
    role: "admin",
    permissions: [
      "governance:audit:view",
      "governance:user:manage",
      "governance:school:manage",
      "governance:volunteer:approve",
      "teaching:class:view",
      "teaching:assignment:view",
    ],
    visibleData: ["all users", "all schools", "audit logs", "system metrics"],
    forbiddenActions: [
      "expose student personal data without audit",
      "bypass consent requirements",
      "access production secrets",
    ],
  },
  "school-admin": {
    role: "school-admin",
    permissions: [
      "governance:school:manage",
      "teaching:class:view",
      "teaching:assignment:view",
      "community:view",
    ],
    visibleData: ["school teachers", "school students aggregate", "school-level summaries"],
    forbiddenActions: [
      "view individual student details without teacher context",
      "contact students directly",
      "access other schools' data",
    ],
  },
  volunteer: {
    role: "volunteer",
    permissions: [
      "volunteer:qa:answer",
      "volunteer:profile:manage",
      "volunteer:content:submit",
      "community:view",
    ],
    visibleData: ["QA questions (anonymized)", "own volunteer profile", "approved content"],
    forbiddenActions: [
      "contact students directly",
      "view student personal data",
      "access teacher dashboards",
      "publish content without review",
    ],
  },
  "volunteer-teacher": {
    role: "volunteer-teacher",
    permissions: [
      "volunteer:qa:answer",
      "volunteer:profile:manage",
      "volunteer:content:submit",
      "teaching:class:view",
      "community:view",
    ],
    visibleData: ["assigned class overview (read-only)", "QA questions", "approved content"],
    forbiddenActions: [
      "contact students directly without consent and audit",
      "modify student records",
      "access school admin panels",
      "publish content without review",
    ],
  },
  "volunteer-school": {
    role: "volunteer-school",
    permissions: [
      "volunteer:profile:manage",
      "volunteer:content:submit",
      "teaching:class:view",
      "community:view",
    ],
    visibleData: ["partnered school summaries (read-only)", "approved content"],
    forbiddenActions: [
      "contact students directly",
      "modify school records",
      "access admin panels",
      "publish content without review",
    ],
  },
  "volunteer-org": {
    role: "volunteer-org",
    permissions: [
      "volunteer-org:manage",
      "volunteer:profile:manage",
      "volunteer:content:submit",
      "community:view",
    ],
    visibleData: ["organization volunteers", "organization service projects", "approved content"],
    forbiddenActions: [
      "contact students directly",
      "view student personal data",
      "access teacher dashboards",
      "approve own content",
    ],
  },
  "volunteer-enterprise": {
    role: "volunteer-enterprise",
    permissions: [
      "volunteer-enterprise:program:manage",
      "volunteer:profile:manage",
      "volunteer:content:submit",
      "community:view",
    ],
    visibleData: ["enterprise programs", "enterprise mentorship records", "approved content"],
    forbiddenActions: [
      "contact students directly without consent and audit",
      "use student data for talent discovery without governance",
      "access teacher dashboards",
      "publish content without review",
    ],
  },
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const rolePermission = PERMISSION_MATRIX[role];
  if (!rolePermission) return false;
  return rolePermission.permissions.includes(permission);
}

/**
 * Get all permissions for a role.
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return PERMISSION_MATRIX[role]?.permissions ?? [];
}

/**
 * Get forbidden actions for a role.
 */
export function getForbiddenActions(role: UserRole): string[] {
  return PERMISSION_MATRIX[role]?.forbiddenActions ?? [];
}
