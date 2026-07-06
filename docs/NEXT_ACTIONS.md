# NEXT ACTIONS

Status: M30 Dispatched - Developer Executing Program
Last updated: 2026-07-01T19:00:00+08:00

## Current Next Action

Developer executes the full M30 Program in order, starting with `P30-01`.

## Milestone Goal (M30)

**Primary goal:** Add read-only `GET /api/v1/teacher/assignments` and show Assigned Students on the Assignment Overview page.

**Closes:** Deferred follow-up from M27–M29 for dedicated assignments list data (not aggregate overview only).

See `Docs/PROJECT_ROADMAP.md` for goals of all milestones M14–M30.

## Active Program

- `M30 - Teacher Assignments List API and UI Integration`
- Dispatched: `2026-07-01T19:00:00+08:00`
- Dispatch: `Docs/DISPATCH_M30_PROGRAM_TO_DEVELOPER.md`
- Start with: `Docs/WORK_ORDER_P30-01.md`

## Work Order Sequence

1. `P30-01` - Lite - Audit TeacherAssignment model and API patterns
2. `P30-02` - Standard - Add GET `/assignments` backend endpoint
3. `P30-03` - Standard - Frontend fetcher, hook, Assigned Students UI
4. `P30-04` - Lite - E2e mock, verification, consolidated handoff

## Latest Accepted Program

- `M29 - Teacher Assignment Overview E2E Smoke Coverage`
- Accepted: `2026-07-01T18:30:00+08:00`

## Developer Rules

- Execute entire Program sequentially unless Stop Rule triggers.
- Final status: `Ready for Controller/QA Review` only.
