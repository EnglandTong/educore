# Dispatch M28 Program to Developer

Date: 2026-07-01  
From: MRT-Controller-QA  
To: MRT-Developer  
Program: M28 - Teacher Assignment Build Verification and UX Hardening  
Milestone: `Docs/MILESTONE_M28_TEACHER_ASSIGNMENT_BUILD_VERIFICATION_AND_UX_HARDENING_2026-07-01.md`

---

## 1. Authorization

MRT-Developer is authorized to execute the full M28 Program consisting of four ordered Work Orders:

| Order | ID | Complexity | Task |
|---|---|---|---|
| 1 | P28-01 | Standard | Verify `apps/web` typecheck and build; fix blocking M27-scope TS errors only |
| 2 | P28-02 | Lite | Replace inline mastery badges with existing `Badge` component |
| 3 | P28-03 | Lite | Add teacher sidebar navigation link to Assignment Overview |
| 4 | P28-04 | Lite | Consolidated handoff and governance state sync |

## 2. Auto-Advance Rules

Developer may automatically proceed to the next Work Order provided ALL of the following are true:

- The previous Work Order has been completed with a handoff containing evidence.
- No item in `Docs/STOP_RULES.md` was triggered.
- No verification command failed for the previous Work Order without a documented fix.
- No scope conflict or unauthorized file modification was detected.
- No more than 3 consecutive failures occurred for the same unresolved verification command.

If any condition is violated, Developer must stop and return the current state to Controller/QA.

## 3. Evidence Requirements

Per Work Order:

- P28-01: Typecheck and build command outputs; list of any M27-scope files fixed; confirmation no backend files touched.
- P28-02: Diff showing `Badge` import and usage; before/after description of mastery level rendering.
- P28-03: Sidebar link entry, path `/teacher/assignments`, and icon/label choice.
- P28-04: Consolidated handoff at `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md`; updated governance files.

At the end of the Program:

- A consolidated handoff must be created at `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md`.
- `Docs/LOOP_RUNS.jsonl` must contain entries for P28-01 through P28-04.

## 4. Stop Conditions

Developer must stop immediately and mark work `Blocked` if:

- Any item in `Docs/STOP_RULES.md` is triggered.
- Build/typecheck failures require changes outside the active Work Order Allowed Files.
- Dependency installation or external network access is required and not already available locally.
- Three consecutive failures of the same verification command occur for the same unresolved reason.
- Unauthorized files are modified.

When blocked, update `Docs/STATUS.md`, `Docs/PENDING.md`, and the active Work Order handoff section with blocker evidence.

## 5. Final Status Rules

Developer may mark the Program only as:

- `Developer Complete`, or
- `Ready for Controller/QA Review`

Developer must NOT mark the Program or any Work Order as:

- `Accepted`
- `Completed`
- `Accepted With Risk`

Only Controller/QA may sign acceptance after review.

## 6. Program Completion

When all four Work Orders are complete:

1. Create `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md` consolidating all Work Order evidence.
2. Update `Docs/STATUS.md`, `Docs/NEXT_ACTIONS.md`, `Docs/PENDING.md`, `Docs/CURRENT_ROLE_INSTRUCTIONS.md`, and `Docs/Work_Order_Active.md`.
3. Append loop evidence to `Docs/LOOP_RUNS.jsonl` and `Docs/LOOP_LOG_Workbuddy.jsonl`.
4. Set final status to `Ready for Controller/QA Review`.
5. Stop and await Controller/QA acceptance review.

## 7. Reference Files

- Milestone: `Docs/MILESTONE_M28_TEACHER_ASSIGNMENT_BUILD_VERIFICATION_AND_UX_HARDENING_2026-07-01.md`
- Program: `Docs/M28_PROGRAM_2026-07-01.md`
- Work Orders: `Docs/WORK_ORDER_P28-01.md` through `Docs/WORK_ORDER_P28-04.md`
- Prior acceptance: `Docs/QA_M27_ACCEPTANCE_2026-07-01.md`
- Prior handoff: `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md`
- Target boundary: `Docs/TARGET.md`
- Stop rules: `Docs/STOP_RULES.md`

## 8. Dispatch Signature

- Dispatched by: MRT-Controller-QA
- Dispatched at: 2026-07-01T15:00:00+08:00
- Developer role: authorized for full M28 Program sequential execution
