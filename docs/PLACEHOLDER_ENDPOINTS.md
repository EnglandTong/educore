# PLACEHOLDER_ENDPOINTS

Status: Active
Last updated: 2026-07-21
Owner: Controller/QA

These endpoints (or stores) return successful HTTP responses but are **not product-complete**. Do not treat them as Accepted feature delivery.

| Surface | Path / Asset | Current behavior | Completeness | Suggested follow-up |
|---|---|---|---|---|
| School admin | `GET /api/v1/school/classes` | Always `{ classes: [], schoolId }` | **Placeholder** | Class management milestone |
| Sync | `getSyncStatus` via sync routes | Queries server-side `AnswerEvent` processing/completion state | **Partial — M84** | Add end-session receipts and full client queue observability |
| Auth module stub | `modules/auth/auth.service.ts` | Removed in M81 (was dead code) | **Removed** | N/A |
| IndexedDB | `apps/web/src/db/progress-store.ts` | No app consumers | **Orphan / incomplete** | Mid-term: wire or delete |
| IndexedDB | `apps/web/src/db/questions-store.ts` | No app consumers | **Orphan / incomplete** | Mid-term: wire or delete |
| TeacherAssignment | Teacher-facing CRUD | Read-only list + community upsert only | **Partial** | Product decision milestone (Non-Goal until authorized) |
| Volunteer dashboard | `VolunteerDashboardPage.tsx` | Nav shell, no data fetch | **Thin shell** | Volunteer data milestone |

## QA Rule

A placeholder may pass typecheck and smoke tests. **Passing tests ≠ feature Accepted.** Acceptance requires an explicit milestone that removes the placeholder behavior or documents a permanent intentional stub with Owner signoff.
