# QA Acceptance - M15 Release Candidate Evidence Pack

Decision: `Accepted`
Actor: MRT-Controller-QA
Signed: 2026-06-20T10:40:00+08:00

## Scope Reviewed

- Milestone: `M15 - Release Candidate Evidence Pack`
- Program: `docs/M15_PROGRAM_2026-06-20.md`
- Dispatch: `docs/DISPATCH_M15_PROGRAM_TO_DEVELOPER.md`
- Developer handoff: `docs/HANDOFF_M15_PROGRAM_DEVELOPER.md`
- Work orders reviewed:
  - `P15-01` - `docs/WORK_ORDER_P15-01.md`
  - `P15-02` - `docs/WORK_ORDER_P15-02.md`
  - `P15-03` - `docs/WORK_ORDER_P15-03.md`
  - `P15-04` - `docs/WORK_ORDER_P15-04.md`

## Acceptance Decision

M15 is accepted.

Developer completed the Program within the dispatched work-order boundaries. The Program created a traceable release-candidate evidence pack, a local smoke-flow checklist, an evidence freshness audit, and a consolidated Developer handoff. No product code, production credential, live data, architecture, subsystem, shared-layer, deployment, or external-service work was required by M15.

## Controller/QA Verification

| Check | Command | Result | Evidence |
| --- | --- | --- | --- |
| Web e2e | `corepack pnpm --filter @educore/web run test:e2e --reporter=list` | `PASS` | 11/11 Playwright tests passed at Controller/QA review. |
| Strict acceptance | `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict` | `PASS` | Exit `0`; output included `Acceptance check passed`; completed `2026-06-20T10:39:30.9143925+08:00`. |
| Evidence index markers | `Select-String -LiteralPath .\docs\EVIDENCE_INDEX_M15.md -Pattern "Repository integrity","Adaptive learning algorithms","Core learner smoke flow","Student UX copy","Agent Loop evidence"` | `PASS` | All `docs/ACCEPTANCE.md` Must Pass headings are mapped. |
| Smoke checklist markers | `Select-String -LiteralPath .\docs\SMOKE_FLOW_CHECKLIST_M15.md -Pattern "register/signin","training answer","wrong-answer","heart journal","parent","teacher","local-only"` | `PASS` | Local learner and supporting route smoke coverage is documented. |
| Freshness audit markers | `Select-String -LiteralPath .\docs\EVIDENCE_FRESHNESS_AUDIT_M15.md -Pattern "Present","Missing","Historical","Acceptance check passed"` | `PASS` | Audit records present/historical evidence and no missing required evidence. |
| Status consistency | `Select-String -LiteralPath .\docs\STATUS.md,.\docs\NEXT_ACTIONS.md,.\docs\PENDING.md,.\docs\COMPLETED.md -Pattern "P15-01","P15-02","P15-03","P15-04","Ready for Controller/QA Review"` | `PASS` | Pre-signoff status files were consistent and ready for QA review. |

## Acceptance Contract Review

`docs/ACCEPTANCE.md` Must Pass items were checked:

- Repository integrity: `PASS`
- Adaptive learning algorithm coverage: `PASS`
- Core learner smoke flow: `PASS`
- Student UX copy evidence: `PASS`
- Agent Loop evidence currency: `PASS`

UX evidence is accepted by reference to the previously signed rubric source: `docs/RUBRIC.md` score `20/25`, with no category below `3/5`, and `docs/UX_REVIEW_NOTES.md`.

## Boundary And Risk Review

- `docs/TARGET.md` boundary violation: `No`
- `docs/STOP_RULES.md` violation: `No`
- Production credentials, secrets, private keys, or live user data used: `No`
- External network provisioning or dependency installation required: `No`
- Destructive git operation required: `No`
- Skipped checks: `None`
- Known risks: `None`

## Evidence Paths

- `docs/EVIDENCE_INDEX_M15.md`
- `docs/SMOKE_FLOW_CHECKLIST_M15.md`
- `docs/EVIDENCE_FRESHNESS_AUDIT_M15.md`
- `docs/HANDOFF_M15_PROGRAM_DEVELOPER.md`
- `docs/LOOP_RUNS.jsonl`
- `docs/LOOP_LOG_Workbuddy.jsonl`
- `docs/LOOP_STATE_Workbuddy.md`
- `apps/web/e2e-report/index.html`

## Final Status

M15 final status: `Accepted`
