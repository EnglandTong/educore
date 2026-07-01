# Dispatch M25 Program to Developer

Date: 2026-07-01  
From: MRT-Controller-QA  
To: MRT-Developer  
Program: M25 - Post-M24 Governance Baseline Verification  
Milestone: `Docs/MILESTONE_M25_POST_M24_GOVERNANCE_BASELINE_VERIFICATION_2026-07-01.md`

---

## 1. Authorization

MRT-Developer is authorized to execute the full M25 Program consisting of four ordered Work Orders:

| Order | ID | Complexity | Task |
|---|---|---|---|
| 1 | P25-01 | Lite | M24 post-acceptance status baseline verification |
| 2 | P25-02 | Standard | Evidence chain cross-validation (M22 -> M23 -> M24) |
| 3 | P25-03 | Standard | Governance documentation consistency pass |
| 4 | P25-04 | Standard | Consolidated milestone handoff and next-readiness assessment |

## 2. Auto-Advance Rules

Developer may automatically proceed to the next Work Order in this Program provided ALL of the following are true:

- The previous Work Order has been completed with a handoff containing evidence.
- No item in `Docs/STOP_RULES.md` was triggered.
- No verification command failed for the previous Work Order.
- No scope conflict or unauthorized file modification was detected.
- No more than `max_consecutive_failures` (default: 3) consecutive failures occurred.

If any condition is violated, Developer must stop and return the current state to Controller/QA.

## 3. Evidence Requirements

Per Work Order:

- P25-01: Command outputs showing status files correctly reference M24.
- P25-02: Cross-reference matrix and command outputs showing evidence chain continuity.
- P25-03: List of files checked, any corrections made, consistency log.
- P25-04: Consolidated handoff with next-readiness assessment.

At the end of the Program:

- A consolidated handoff must be created at `Docs/HANDOFF_M25_PROGRAM_DEVELOPER.md`.
- `Docs/LOOP_RUNS.jsonl` must contain an entry for the M25 Program.

## 4. Stop Conditions

Developer must stop immediately and mark work `Blocked` if:

- Any `Docs/STOP_RULES.md` condition is triggered.
- A required evidence file is missing and cannot be reconstructed from accepted history.
- The same verification command fails three consecutive times for the same unresolved reason.
- Developer detects a scope conflict or needs an Owner-only decision.

## 5. What Developer Must NOT Do

- Do NOT mark any Work Order or the Program as `Accepted` or `Completed`.
- Do NOT modify `Docs/TARGET.md`, `Docs/STOP_RULES.md`, or `Docs/ACCEPTANCE.md`.
- Do NOT write product code or create new architecture.
- Do NOT perform destructive git operations.
- Do NOT write outside `D:\Development\EduCore`.

## 6. Expected Final Status

At Program completion, Developer must set status to one of:

- `Developer Complete` — if all Work Orders passed and handoff is ready.
- `Ready for Controller/QA Review` — if all Work Orders passed and the consolidated handoff is published.

Developer must NOT use:

- `Accepted`
- `Accepted With Risk`
- `Completed`

## 7. Controller/QA Will Review

After receiving the consolidated handoff, Controller/QA will:

1. Re-run key verification commands where feasible.
2. Check acceptance criteria against evidence.
3. Verify no stop rules were triggered.
4. Record the decision in a QA acceptance record.
5. Update project status files.

## 8. Program Files

- Milestone: `Docs/MILESTONE_M25_POST_M24_GOVERNANCE_BASELINE_VERIFICATION_2026-07-01.md`
- Program: `Docs/M25_PROGRAM_2026-07-01.md`
- Work Orders:
  - `Docs/WORK_ORDER_P25-01.md`
  - `Docs/WORK_ORDER_P25-02.md`
  - `Docs/WORK_ORDER_P25-03.md`
  - `Docs/WORK_ORDER_P25-04.md`
- Dispatch: `Docs/DISPATCH_M25_PROGRAM_TO_DEVELOPER.md` (this file)

---

Controller/QA Signature: MRT-Controller-QA  
Dispatch Date: 2026-07-01  
Status: Dispatched / Active
