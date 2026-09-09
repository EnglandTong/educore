# TARGET - EduCore

Status: M87 Active → Pilot Core Planned (M88–M92)
Owner: Owner (product decisions) / Controller-QA (acceptance)
Last updated: 2026-09-09
Canonical board: `docs/PROJECT_BOARD.md`（功能 / 目标 / 状态 / 进度 / 下一步）

Latest accepted runtime baseline: M84 student learning loop (Accept-with-notes, 2026-08-21)
Latest collaboration confirmation: M85 teacher read-only (Accepted-with-notes)
Latest placeholder disposition: M86 Accepted-with-deferrals
M87 status: Developer Ready for Controller/QA Review (not Accepted until signed)
Prior contract-only acceptances: M50-M80 (NOT runtime capability)

## Program Goal

Convert EduCore into a truthful, safe, runnable **pilot learning core**:

1. Student can complete login → train → answer → server grade → BKT mastery → next/wrong.
2. Teacher can read assigned-student progress only.
3. Weak-network and local-AI limits are proven via **simulation profiles**, never via required physical Pi.
4. Capability labels stay honest (Implemented / Partial / Placeholder / Simulated-testable / Deferred).

Methodology: 学习培伴-style evidence honesty (borrowed as method only; `EnglandTong/learning-companion` not readable here).

## Hard Sequencing Rules

1. No real Raspberry Pi / edge deployment or donation-kit claims in Pilot Core.
2. CI/QA must not require live Ollama or physical hardware.
3. Only one active work order at a time.
4. M88+ must not start until M87 is Controller/QA signed (or Owner explicitly supersedes).
5. Volunteer / enterprise / matching / talent / payment remain Non-Goals.
6. M86 deferred surfaces stay deferred until a new Owner target.

## Milestone Roadmap

| ID | Goal | Gate |
|---|---|---|
| M87 | Governance rebaseline + hardware→sim gate | QA sign `QA_M87_ACCEPTANCE_2026-09-09.md` |
| M88 | Runtime Truth — clean start, real green | uncached checks + compose smoke + seed validation |
| M89 | Identity & Privacy — register/authz/shared-device | Mongo deny matrix + account-switch privacy |
| M90 | Learning Integrity — DTO/idempotency/reports/content | real API/DB learning journey |
| M91 | Weak-Net Sim — expand edge profiles + non-mock offline | profile table + replay DB proof |
| M92 | Minimum Pilot Loop — student+teacher demo pack | Owner readiness checklist (sim, not hardware) |

## Current Milestone Boundary (M87)

Active work order: `docs/WORK_ORDER_M87.md`  
Developer delivery complete; awaiting independent QA. Details: `docs/PROJECT_BOARD.md`.

## In Scope (Pilot Core overall)

- `apps/api`, `apps/web`, `packages/*`, `modules/*` within each milestone’s work order
- Simulation harnesses for edge/AI/weak-net
- Governance + evidence under `docs/`

## Out of Scope / Non-Goals

- Real Pi / RK3566 classroom station; treating sim PASS as on-device delivery
- Parent/school/volunteer expansion (unless Owner adds to M92)
- Payment/donation activation; direct student–volunteer contact
- Destructive deletion of M86 orphans
- Tech-stack replacement; production deploy; real student data; secrets

## Success Criteria (program-level)

- [ ] M87 Accepted by Controller/QA
- [ ] M88–M92 each have automatic + run (+ security/sim where required) evidence
- [ ] PROJECT_BOARD capability labels match evidence
- [ ] No endpoint claims complete capability while returning pseudo-success
- [ ] Hardware remains paused; sim gate documented as the substitute

## Failure Examples

- Blocking acceptance for missing physical Pi
- Claiming classroom hardware ready from simulation alone
- Starting M88 before M87 signoff
- Developer self-acceptance; green typecheck as sole proof of runtime capability
