# ACCEPTANCE - Current Gate

Status: M87 Ready for Controller/QA Review; Pilot Core (M88–M92) planned after signoff
Last updated: 2026-09-09
Scope authority: `TARGET.md` > this file > `PROJECT_BOARD.md` > `STATUS.md` > `PENDING.md` > `NEXT_ACTIONS.md`
Board: `docs/PROJECT_BOARD.md`

## Current Milestone: M87 — Governance Rebaseline + Hardware Simulation Gate

Work order: `docs/WORK_ORDER_M87.md`  
Developer disposition: **Ready for Controller/QA Review**  
QA packet: `docs/QA_M87_ACCEPTANCE_2026-09-09.md`  
Evidence: `docs/evidence/M87/EVIDENCE_INDEX.md`

### Prior program (closed)

| Milestone | Result | Evidence |
|---|---|---|
| M82 | Accept-with-notes | `QA_M82_ACCEPTANCE_2026-08-21.md` |
| M83 | Owner Option A confirmed | `M83_OWNER_DECISION_BRIEF.md` |
| M84 | Accept-with-notes | `QA_M84_ACCEPTANCE_2026-08-21.md` |
| M85 | Accepted-with-notes | `QA_M85_ACCEPTANCE_2026-08-21.md` |
| M86 | Accepted-with-deferrals | `QA_M86_DISPOSITION_2026-08-21.md` |

### Must Pass (M87) — unchecked until independent QA

- [ ] MP1: Governance files agree on M87 / M82–M86 closed / Pilot Core planned
- [ ] MP2: Four edge profiles automated; zero live Ollama / zero physical Pi dependency
- [ ] MP3: `pi-down` / `offline-core` → rule (or next stub); non-empty text; observable `providerId`
- [ ] MP4: `pi-slow` finishes via timeout/degrade (no hang)
- [ ] MP5: Docs: Hardware paused; sim PASS ≠ on-device delivery
- [ ] MP6: No destructive M86 deletes; no payment/volunteer direct-contact enablement

### Evidence package

- `docs/evidence/M87/api-test.txt` (60/60), `api-typecheck.txt`
- `docs/HANDOFF_M87_PROGRAM_DEVELOPER.md`
- `docs/PLACEHOLDER_ENDPOINTS.md` (Simulated-testable / Hardware paused)
- `docs/PROJECT_BOARD.md` (capability + roadmap)

### Not Accepted if

- Blocked only because Pi/Ollama missing
- Sim green claimed as classroom hardware ready
- Developer self-accepted
- Any MP lacks evidence link

## Next gate (not active until M87 signed)

M88 Runtime Truth — work order to be created after M87 Accept. Must Pass will include uncached typecheck/test/build, compose smoke, full seed validation, and non-noop web lint / zero-test policy.

## Evidence classes (program-wide)

Automatic + run (+ security from M89 + sim-constraint from M87/M91) + docs consistency + independent QA.
