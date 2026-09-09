# PLACEHOLDER_ENDPOINTS

Status: Active
Last updated: 2026-09-09
Owner: Controller/QA

These endpoints (or stores) return successful HTTP responses but are **not product-complete**. Do not treat them as Accepted feature delivery.

| Surface | Path / Asset | Current behavior | Completeness | Suggested follow-up |
|---|---|---|---|---|
| School admin | `GET /api/v1/school/classes` | Always `{ classes: [], schoolId }` | **Placeholder** | Class management milestone (Owner target required) |
| Sync | `getSyncStatus` via sync routes | Queries server-side `AnswerEvent` processing/completion state | **Partial — M84** | Add end-session receipts and full client queue observability |
| Auth module stub | `modules/auth/auth.service.ts` | Removed in M81 (was dead code) | **Removed** | N/A |
| IndexedDB | `apps/web/src/db/progress-store.ts` | No app consumers | **Orphan / incomplete** | Mid-term: wire or delete (M86 defer) |
| IndexedDB | `apps/web/src/db/questions-store.ts` | No app consumers | **Orphan / incomplete** | Mid-term: wire or delete (M86 defer) |
| TeacherAssignment | Teacher-facing CRUD | Read-only list + community upsert only | **Partial** | Product decision milestone (Non-Goal until authorized) |
| Volunteer dashboard | `VolunteerDashboardPage.tsx` | Nav shell, no data fetch | **Thin shell** | Volunteer data milestone (Non-Goal) |
| Edge / local Ollama | `apps/api/src/modules/ai/providers/ollama.ts` + ModelManager | Real HTTP client exists; **acceptance via M87 simulated profiles only** | **Simulated-testable / Hardware paused** | Real Pi bring-up is a separate Owner program; CI must use SimOllama |

## QA Rule

A placeholder may pass typecheck and smoke tests. **Passing tests ≠ feature Accepted.** Acceptance requires an explicit milestone that removes the placeholder behavior or documents a permanent intentional stub with Owner signoff.

**M87 addition:** Missing physical Raspberry Pi or host Ollama must not block acceptance. Simulation gate PASS ≠ on-device hardware delivery.
