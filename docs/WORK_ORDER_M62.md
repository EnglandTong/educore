# Work Order — M62 Home-School Communication Log

## Work Order ID

`M62`

## Milestone

`M62 — Home-School Communication Log`

## Complexity

Standard

## Task

Track collaboration. Record parent, teacher, and school communication. Permissions, timestamps, and boundaries exist. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/communication.ts` with `CommunicationChannel`, `CommunicationParticipant`, and `CommunicationLog`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m61_m65_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M62-R1` — `CommunicationChannel` union (4 channels) defined.
- `M62-R2` — `CommunicationParticipant` union (4 roles) defined.
- `M62-R3` — `CommunicationLog` interface (participants, consent, timestamp) defined.
- `M62-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M62-R1` Create `packages/types/src/communication.ts` with `CommunicationChannel` (message, call, meeting, note).
- [x] `M62-R2` Add `CommunicationParticipant` (parent, teacher, school-admin, student).
- [x] `M62-R3` Add `CommunicationLog` interface (id, initiatorId, initiatorRole, participantId, participantRole, channel, subject, content, studentId?, consentRequired, consentVerified, timestamp).
- [x] `M62-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./communication.js";` in `packages/types/src/m61_m65_exports.txt`.

## Allowed Files

- `packages/types/src/communication.ts`
- `packages/types/src/m61_m65_exports.txt`
- `Docs/WORK_ORDER_M62.md`
- `Docs/QA_M62_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `communication.ts` exists with the required types.
- `communication.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `communication.js` is recorded in `m61_m65_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `consentRequired` + `consentVerified` are separate booleans so a log can require consent and record whether it was verified — the boundary between "needs consent" and "consent confirmed" is explicit.
- `studentId` is optional because not every home-school exchange is about a specific student (e.g., a general school announcement).

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the parallel index.ts task can proceed.
