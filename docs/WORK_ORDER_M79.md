# Work Order — M79 Privacy, Audit & Compliance Hardening

## Work Order ID

`M79`

## Milestone

`M79 — Privacy, Audit & Compliance Hardening`

## Complexity

Standard

## Task

Strengthen data protection, audit logging, retention policy, data export, and data deletion contracts so student data is auditable, limited, and accountable. Define the audit log (actor, action, sensitivity, consent verification), retention policy (per-resource retention, auto-delete, exportability, consent requirement), and export/deletion request lifecycles with audit-logging flags. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/privacy.ts` with `AuditAction`, `DataSensitivity`, `AuditLog`, `DataRetentionPolicy`, `DataExportRequest`, and `DataDeletionRequest`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m76_m80_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M79-R1` — `AuditAction` union (create, read, update, delete, export, share, consent-grant, consent-revoke) defined.
- `M79-R2` — `DataSensitivity` union (public, internal, confidential, restricted, student-personal) defined.
- `M79-R3` — `AuditLog` interface (actor, action, resource, sensitivity, student link, consent verified, timestamp) defined.
- `M79-R4` — `DataRetentionPolicy` interface (resource type, retention days, auto-delete, exportable, requires consent) defined.
- `M79-R5` — `DataExportRequest` and `DataDeletionRequest` interfaces (requester, student, status lifecycle, audit-logged flag) defined.
- `M79-R6` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M79-R1` Create `packages/types/src/privacy.ts` with `AuditAction` (create, read, update, delete, export, share, consent-grant, consent-revoke).
- [x] `M79-R2` Add `DataSensitivity` (public, internal, confidential, restricted, student-personal).
- [x] `M79-R3` Add `AuditLog` interface (id, actorId, actorRole, action, resourceType, resourceId, dataSensitivity, studentId?, consentVerified, timestamp, ipAddress?, details?).
- [x] `M79-R4` Add `DataRetentionPolicy` interface (id, resourceType, retentionDays, autoDelete, exportable, requiresConsent).
- [x] `M79-R5` Add `DataExportRequest` (id, requesterId, studentId?, status, requestedAt, completedAt?, downloadUrl?, auditLogged) and `DataDeletionRequest` (id, requesterId, studentId?, reason, status, requestedAt, completedAt?, auditLogged).
- [x] `M79-R6` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./privacy.js";` in `packages/types/src/m76_m80_exports.txt`.

## Allowed Files

- `packages/types/src/privacy.ts`
- `packages/types/src/m76_m80_exports.txt`
- `Docs/WORK_ORDER_M79.md`
- `Docs/QA_M79_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `privacy.ts` exists with the required types.
- `privacy.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `privacy.js` is recorded in `m76_m80_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `AuditAction` includes `consent-grant` / `consent-revoke` so consent lifecycle changes are themselves auditable — this closes the loop with the consent types (M-consent) and the consent-verified flag on every other action.
- `DataSensitivity` escalates from `public` → `internal` → `confidential` → `restricted` → `student-personal`. `student-personal` is the highest tier; any `AuditLog` with this sensitivity must have `consentVerified === true` (enforced by tooling, not the type).
- `AuditLog.consentVerified` is a required boolean so every audited action explicitly declares whether consent was checked at audit time; `false` on a `student-personal` action is a compliance violation that alerting must flag.
- `DataRetentionPolicy.requiresConsent` ties a resource type to the consent system: resources with `requiresConsent === true` cannot be created/read/exported without a live consent grant.
- `DataExportRequest` and `DataDeletionRequest` share a status lifecycle: pending → approved → processing → completed | rejected. The `auditLogged` boolean on each is the proof that the request itself was written to the audit log — downstream compliance checks read this flag, not the audit table.
- `DataDeletionRequest.reason` is required (deletion without a reason is non-compliant); `DataExportRequest` has no reason field because export is a transparency right, not an exceptional action.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines the privacy/audit/compliance *contract*; it does not implement the audit-log writer, retention enforcer, consent gate, or export/deletion pipeline. Concrete privacy tooling is a downstream concern.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
