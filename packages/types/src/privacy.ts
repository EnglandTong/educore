export type AuditAction = "create" | "read" | "update" | "delete" | "export" | "share" | "consent-grant" | "consent-revoke";
export type DataSensitivity = "public" | "internal" | "confidential" | "restricted" | "student-personal";
export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  dataSensitivity: DataSensitivity;
  studentId?: string;
  consentVerified: boolean;
  timestamp: string;
  ipAddress?: string;
  details?: string;
}
export interface DataRetentionPolicy {
  id: string;
  resourceType: string;
  retentionDays: number;
  autoDelete: boolean;
  exportable: boolean;
  requiresConsent: boolean;
}
export interface DataExportRequest {
  id: string;
  requesterId: string;
  studentId?: string;
  status: "pending" | "approved" | "processing" | "completed" | "rejected";
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  auditLogged: boolean;
}
export interface DataDeletionRequest {
  id: string;
  requesterId: string;
  studentId?: string;
  reason: string;
  status: "pending" | "approved" | "processing" | "completed" | "rejected";
  requestedAt: string;
  completedAt?: string;
  auditLogged: boolean;
}
