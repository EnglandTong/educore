# M84-R1 Evidence — 2026-08-21

Runtime: isolated Mongo database on local `127.0.0.1:27017`, API `127.0.0.1:3300`; fixture
users/questions were unique to the audit database.

## Automatic

- `corepack pnpm --filter @educore/api run typecheck` — pass after M84 event changes.
- `corepack pnpm --filter @educore/web run typecheck` — pass.
- `corepack pnpm --filter @educore/api test` — 11 files / 54 tests passed.
- `corepack pnpm --filter @educore/web run build` — pass; Vite 2818 modules and PWA assets generated.

## Real HTTP

- Login — pass.
- Training start — pass.
- Next question — pass.
- Server grading — pass.
- Same `eventId` submitted twice — both responses successful and identical; second response
  retained `questionsAttempted: 1`, proving no second mastery advancement.
- Training end — pass in the current rerun, returning session report; prior runtime failure
  remains a historical defect signal and must be covered by regression.
- Cross-account session answer — rejected with `NOT_FOUND`.
- System Chrome browser — login reached `/student/dashboard`, training start rendered a real
  question, selecting an answer returned to question 2.
- Browser offline mode — answer was retained while offline; after reconnect the queue replayed
  and the UI advanced to question 2.

## Current implementation

- `AnswerEvent` has unique `(studentId, eventId)` storage and completed result replay.
- Web online and offline answer paths generate and preserve `eventId`.
- `/api/v1/sync/status` reads pending/last completed answer-event state instead of returning
  a fixed empty response.
- `end_session` sync receipt replayed twice with `synced: 1, failed: 0` each time; the second
  request did not re-run session completion.

## Not yet proven

- Offline queue deletion after successful replay and retry-limit evidence are not yet directly
  observed in IndexedDB.
- Direct IndexedDB deletion/retry-limit exhaustion and failure-visibility evidence are not yet
  directly observed in IndexedDB.
- Independent QA final acceptance of M84.
