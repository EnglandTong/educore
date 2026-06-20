# Evidence Index M15 - Release Candidate Evidence Pack

Status: P15-01 Developer Complete
Owner: MRT-Developer
Updated: 2026-06-20T10:12:00+08:00

## Purpose

Map each `docs/ACCEPTANCE.md` Must Pass item to current evidence paths, verification commands, and latest known timestamps for release-candidate review.

## Acceptance Evidence Map

| Must Pass Item | Current Evidence Paths | Verification Command Or Evidence Source | Latest Known Timestamp | Status |
| --- | --- | --- | --- | --- |
| Repository integrity | `docs/QA_M14_ACCEPTANCE_2026-06-20.md`; `docs/LOOP_RUNS.jsonl`; `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md` | `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict` | `2026-06-20T09:55:20+08:00` | Current |
| Adaptive learning algorithms | `docs/QA_M14_ACCEPTANCE_2026-06-20.md`; `docs/LOOP_RUNS.jsonl`; `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md` | Strict acceptance command includes `packages/algorithms` tests: BKT, IRT, scoring, diagnostic strategy, question selection, spaced repetition, and content simulation. | `2026-06-20T09:55:20+08:00` | Current |
| Core learner smoke flow | `apps/web/e2e-report/index.html`; `docs/QA_M14_ACCEPTANCE_2026-06-20.md`; `docs/HANDOFF_M14_PROGRAM_DEVELOPER.md`; `docs/LOOP_RUNS.jsonl` | `corepack pnpm --filter @educore/web run test:e2e --reporter=list` | `2026-06-20T09:55:47+08:00` | Current |
| Student UX copy | `docs/RUBRIC.md`; `docs/UX_REVIEW_NOTES.md`; `docs/QA_M14_ACCEPTANCE_2026-06-20.md`; `docs/ACCEPTANCE.md` | Rubric evidence source: total `20/25`, no category below `3/5`. | `2026-06-19T17:49:06+08:00` | Historical accepted evidence |
| Agent Loop evidence | `docs/LOOP_STATE_Workbuddy.md`; `docs/LOOP_LOG_Workbuddy.jsonl`; `docs/LOOP_RUNS.jsonl`; `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md` | Agent Loop state/log entries with exact timestamps, commands, status, and evidence paths. | `2026-06-20T10:03:37+08:00` | Current |

## Supporting Evidence

- M14 QA acceptance: `docs/QA_M14_ACCEPTANCE_2026-06-20.md`
- M14 Developer handoff: `docs/HANDOFF_M14_PROGRAM_DEVELOPER.md`
- M15 Program: `docs/M15_PROGRAM_2026-06-20.md`
- Current dispatch: `docs/DISPATCH_M15_PROGRAM_TO_DEVELOPER.md`
- Current status: `docs/STATUS.md`

## Notes

- This index does not lower or rewrite any `docs/ACCEPTANCE.md` pass condition.
- Historical accepted evidence remains referenced when it is still the controlling evidence source.
- Production deployment, production credentials, live data, and external services are excluded.
