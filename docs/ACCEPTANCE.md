# ACCEPTANCE - M87 Hardware Simulation Gate

Status: M87 Active
Last updated: 2026-09-09
Scope authority: `Docs/TARGET.md` > this file > `Docs/STATUS.md` > `Docs/PENDING.md` > `Docs/NEXT_ACTIONS.md`
Prior program: M82-M86 closed — see `docs/HANDOFF_M82_M86_FINAL_2026-08-21.md`

## Current Milestone: M87 - Governance Rebaseline + Hardware Simulation Gate

Work order: `Docs/WORK_ORDER_M87.md`

### Prior program disposition (closed)

| Milestone | Result | Evidence |
|---|---|---|
| M82 | Accept-with-notes | `docs/QA_M82_ACCEPTANCE_2026-08-21.md` |
| M83 | Owner Option A confirmed | `docs/M83_OWNER_DECISION_BRIEF.md` |
| M84 | Accept-with-notes | `docs/QA_M84_ACCEPTANCE_2026-08-21.md` |
| M85 | Accepted-with-notes | `docs/QA_M85_ACCEPTANCE_2026-08-21.md` |
| M86 | Accepted-with-deferrals | `docs/QA_M86_DISPOSITION_2026-08-21.md` |

### Must Pass (all required for M87 acceptance)

- [ ] MP1: Governance files all point to M87; no stale "M82 Active" / "M85-M86 in progress" conflict
- [ ] MP2: Four edge profiles (`pi-ok`, `pi-slow`, `pi-down`, `offline-core`) have automated tests
      that pass with **zero** live Ollama and **zero** physical Pi dependency
- [ ] MP3: `pi-down` and `offline-core` degrade to rule engine (or next injected stub) with non-empty
      text and observable `providerId`
- [ ] MP4: `pi-slow` finishes inside the test timeout via timeout/degrade (no hang)
- [ ] MP5: Docs state Hardware paused; simulation PASS ≠ on-device hardware delivery
- [ ] MP6: No destructive deletion of M86 deferred surfaces; no payment/volunteer direct-contact enablement

### Evidence package

- Work order: `docs/WORK_ORDER_M87.md` (Developer: Ready for Review)
- Evidence index: `docs/evidence/M87/EVIDENCE_INDEX.md`
- Automatic logs: `docs/evidence/M87/api-test.txt` (60/60), `docs/evidence/M87/api-typecheck.txt`
- QA packet: `docs/QA_M87_ACCEPTANCE_2026-09-09.md`
- Handoff: `docs/HANDOFF_M87_PROGRAM_DEVELOPER.md`
- Placeholder/hardware label: `docs/PLACEHOLDER_ENDPOINTS.md`

Current Developer disposition: `Ready for Controller/QA Review`; MP checkboxes remain unchecked until independent review.

### Not Accepted if

- Acceptance blocked solely because physical hardware or host Ollama is missing
- Simulation green claimed as classroom hardware ready
- Developer self-accepted without Controller/QA record
- Any Must Pass lacks an evidence link

### Evidence classes

Automatic (typecheck/test) + documentation (TARGET/Work Order consistency). Browser/hardware
device runs are **not** required for M87; simulated constraint tests substitute for edge hardware.
