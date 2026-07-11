# QA Acceptance — M79 Privacy, Audit & Compliance Hardening

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M79-AC-1 | `AuditAction` union (8 actions) defined | PASS | `packages/types/src/privacy.ts` — create, read, update, delete, export, share, consent-grant, consent-revoke |
| M79-AC-2 | `DataSensitivity` union (5 tiers) defined | PASS | `packages/types/src/privacy.ts` — public, internal, confidential, restricted, student-personal |
| M79-AC-3 | `AuditLog` interface defined | PASS | `packages/types/src/privacy.ts` — id, actorId, actorRole, action, resourceType, resourceId, dataSensitivity, studentId?, consentVerified, timestamp, ipAddress?, details? |
| M79-AC-4 | `DataRetentionPolicy` interface defined | PASS | `packages/types/src/privacy.ts` — id, resourceType, retentionDays, autoDelete, exportable, requiresConsent |
| M79-AC-5 | `DataExportRequest` and `DataDeletionRequest` interfaces defined | PASS | `packages/types/src/privacy.ts` — both carry id, requesterId, studentId?, status (pending/approved/processing/completed/rejected), requestedAt, completedAt?, auditLogged; deletion adds required `reason` |
| M79-AC-6 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m76_m80_exports.txt` |
| M79-AC-7 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **Consent-verified invariant is tooling-enforced, not type-enforced**: `AuditLog.consentVerified === false` on a `student-personal` action is a compliance violation, but the type permits it; alerting and audit-review tooling must flag this combination.
2. **`index.ts` export pending**: The `export * from "./privacy.js";` line is staged in `m76_m80_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **Retention enforcement is downstream**: `DataRetentionPolicy.autoDelete` and `retentionDays` are declarative; the actual deletion sweep that honors them is not implemented in this milestone. A missed sweep leaves data beyond its retention window — a compliance gap.
4. **`auditLogged` is a self-attested flag**: `DataExportRequest.auditLogged` and `DataDeletionRequest.auditLogged` are booleans set by the request handler; the type cannot prove the audit entry actually exists. Compliance checks should cross-reference the audit table.
5. **Export/deletion status transitions not type-enforced**: The shared status lifecycle (pending → approved → processing → completed | rejected) is not encoded; request handlers must enforce valid transitions and reject illegal jumps (e.g., pending → completed).
6. **`DataSensitivity` escalation is convention, not type**: The tier ordering public → internal → confidential → restricted → student-personal is a convention; the type does not prevent a `restricted` resource from being treated as `public`. Access-control tooling must enforce the tiering.

## Decision

**Accepted** — All Must Pass items have objective evidence. Privacy, audit, and compliance hardening types are defined, type-safe, and verified. The audit log (`AuditLog` with actor, action, sensitivity, and consent verification), retention policy (`DataRetentionPolicy` with auto-delete, exportability, and consent requirement), and export/deletion request lifecycles (`DataExportRequest` / `DataDeletionRequest` with audit-logging flags) are expressible via the privacy contracts. This milestone provides the compliance backbone that the M80 evidence pack's `audit-log` evidence type draws from, and ensures student data is auditable, limited, and accountable.
