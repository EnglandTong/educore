# Acceptance Contract - EduCore

Status: Controller/QA Signed - Milestone Complete
Owner: Controller/QA
Last updated: 2026-06-19

## Milestone Goal

EduCore must be buildable, testable, and reviewable as a local acceptance candidate for the rural adaptive learning MVP. The milestone focuses on core learning flow evidence, adaptive algorithm coverage, and warm non-judgmental learner UX.

## Must Pass

- [x] Repository integrity is sufficient for local acceptance.
  - Evidence required: automatic
  - Required command: `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
  - Pass condition: command exits `0` and prints `Acceptance check passed` with a completion timestamp.

- [x] Adaptive learning algorithms have test coverage.
  - Evidence required: automatic
  - Required evidence: `packages/algorithms` tests pass through the root acceptance check.
  - Pass condition: BKT, IRT, scoring, diagnostic strategy, question selection, spaced repetition, and content simulation tests pass.

- [x] Core learner smoke flow is verifiable.
  - Evidence required: automatic + functional
  - Required e2e flow: register/signin -> check-in -> diagnostic -> practice/training -> wrong answers/review notes -> heart journal or proud wall.
  - Pass condition: Playwright web journey smoke passes and evidence report is generated at `apps/web/e2e-report/index.html`.

- [x] Student UX copy is warm and non-judgmental.
  - Evidence required: rubric + functional review
  - Required evidence: `docs/RUBRIC.md` scoring and `docs/UX_REVIEW_NOTES.md`.
  - Pass condition: no category below 3/5 and total score at least 20/25.

- [x] Agent Loop evidence is current.
  - Evidence required: documentation
  - Required files: `docs/LOOP_STATE_Workbuddy.md`, `docs/LOOP_LOG_Workbuddy.jsonl`, `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md`.
  - Pass condition: latest entry has exact timestamp, commands, status, and evidence paths.

## Known Exclusions

- Production deployment mode is not signed off in this milestone.
- Production secrets, private keys, and cloud credentials are outside this milestone.
- Damaged recovery artifacts and `node_modules` fragments are not acceptance evidence.

## Current Blocking Rules

Set status to `Blocked` in `docs/EVALUATION.md` if any of the following occurs:

- `Docs/ACCEPTANCE.md` or `Docs/RUBRIC.md` cannot be maintained.
- The strict acceptance command fails three consecutive times for the same unresolved reason.
- A fix requires production credentials, external service configuration, or architecture changes beyond the current work orders.
- A task requires writing outside `D:\Development\EduCore`.

## Developer Completion - 2026-06-19

- Completed: `2026-06-19T15:22:48+08:00`
- Status: `PASS - Developer complete, ready for Controller/QA final review`
- Command: `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
- Result: `Acceptance check passed`
- Evidence paths:
  - `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md`
  - `docs/RUBRIC.md`
  - `docs/UX_REVIEW_NOTES.md`
  - `docs/LOOP_STATE_Workbuddy.md`
  - `apps/web/e2e-report/index.html`

## Developer Rework Completion - 2026-06-19

- Completed: `2026-06-19T16:29:36+08:00`
- Status: `PASS - returned for Controller/QA re-review`
- Command: `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
- Result: `Acceptance check passed`
- Return issue resolved: strict e2e no longer marks timeout as PASS without validating captured success output and absence of fail/error/stderr markers.

## Controller/QA Signoff - 2026-06-19

- Signed: `2026-06-19T17:49:06+08:00`
- Status: `PASS - Milestone complete`
- Reviewed must-pass items:
  - Repository integrity: `PASS`
  - Adaptive learning algorithm coverage: `PASS`
  - Core learner smoke flow: `PASS`
  - Student UX copy and rubric threshold: `PASS`
  - Agent Loop evidence currency: `PASS`
- Controller verification command: `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
- Controller verification result: exit `0`, output included `Acceptance check passed`.
- UX rubric: `20/25`, no category below `3/5`.
