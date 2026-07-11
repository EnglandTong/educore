# Work Order — M68 Mentorship Session MVP

## Work Order ID

`M68`

## Milestone

`M68 — Mentorship Session MVP`

## Complexity

Standard

## Task

Provide a mentorship session MVP. Schedule sessions between mentors and mentees with format, consent, recording, and feedback boundaries. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/mentorship.ts` with `MentorshipStatus`, `MentorshipFormat`, `MentorshipSession`, and `MentorshipFeedback`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m66_m70_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M68-R1` — `MentorshipStatus` union (5 states) defined.
- `M68-R2` — `MentorshipFormat` union (4 formats) defined.
- `M68-R3` — `MentorshipSession` interface (mentor, mentee, format, consent, recording, feedback) defined.
- `M68-R4` — `MentorshipFeedback` interface (rating, comments, recommendation) defined.
- `M68-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M68-R1` Create `packages/types/src/mentorship.ts` with `MentorshipStatus` (scheduled, in-progress, completed, cancelled, no-show).
- [x] `M68-R2` Add `MentorshipFormat` (video, chat, in-person, async).
- [x] `M68-R3` Add `MentorshipSession` interface (id, mentorId, menteeId, format, status, topic, description, scheduledAt, durationMinutes, consentVerified, recordingEnabled, feedbackSubmitted, createdAt).
- [x] `M68-R4` Add `MentorshipFeedback` interface (id, sessionId, fromUserId, rating, comments, wouldRecommend, createdAt).
- [x] `M68-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./mentorship.js";` in `packages/types/src/m66_m70_exports.txt`.

## Allowed Files

- `packages/types/src/mentorship.ts`
- `packages/types/src/m66_m70_exports.txt`
- `Docs/WORK_ORDER_M68.md`
- `Docs/QA_M68_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `mentorship.ts` exists with the required types.
- `mentorship.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `mentorship.js` is recorded in `m66_m70_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `consentVerified` is a hard gate — services must not transition a session to `in-progress` until consent is verified (mirrors M62/M65/M66 consent pattern).
- `recordingEnabled` declares whether recording is permitted; services must not record sessions where `recordingEnabled === false`, and for `in-person` / `async` formats recording semantics differ and must be handled by downstream code.
- `feedbackSubmitted` is a denormalized flag on the session to avoid an extra join when listing sessions; the source of truth is `MentorshipFeedback` records keyed by `sessionId`.
- `MentorshipFeedback.rating` is a plain number; the type does not constrain range, but services should normalize to 1–5 and document the scale.
- `wouldRecommend` is a separate boolean from `rating` to capture explicit recommendation intent for downstream recommendation logic.

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
