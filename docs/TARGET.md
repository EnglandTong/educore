# TARGET - EduCore

Status: M87 Program Active (Governance Rebaseline + Hardware Simulation Gate)
Owner: Owner (product decisions) / Controller-QA (acceptance)
Last updated: 2026-09-09
Latest accepted runtime baseline: M84 student learning loop (Accept-with-notes, 2026-08-21)
Latest collaboration confirmation: M85 teacher read-only assigned-student view (Accepted-with-notes)
Latest placeholder disposition: M86 Accepted-with-deferrals
Prior contract-only acceptances: M50-M80 (type/document contracts, NOT runtime capability)

## Program Goal

Keep EduCore a truthful, safe, runnable learning product core. After M82-M86 closed the
audit → Owner rebaseline → student loop → teacher read-only → placeholder disposition cycle,
M87 rebaselines governance and replaces any real-hardware acceptance path with **simulated
edge/hardware constraint tests** that encode Pi/Ollama limits without requiring physical devices.

## Hard Sequencing Rules

1. No real Raspberry Pi / edge-device deployment or donation-kit claims in this program.
2. CI and acceptance must not require a live Ollama daemon or physical hardware.
3. Deferred M86 surfaces (school classes, orphan IndexedDB stores, volunteer shell) stay deferred
   until Owner opens a new target.
4. Only one bounded work order is active at a time: `Docs/WORK_ORDER_M87.md`.
5. Volunteer / enterprise / matching / talent / payment remain Non-Goals.

## Current Milestone Boundary (M87)

1. Docs governance sync so TARGET / ACCEPTANCE / STATUS / PENDING / NEXT_ACTIONS / LOOP_* /
   CMS / Work_Order_Active all point at M87 and record M82-M86 as closed.
2. Injectable `ModelManager` + simulated Ollama HTTP fixture.
3. Constraint profiles: `pi-ok`, `pi-slow`, `pi-down`, `offline-core` with automated API unit tests.
4. Evidence under `docs/evidence/M87/`; hardware path labeled Simulated-testable / Hardware paused.

## In Scope

- `docs/` governance and evidence for M87
- `apps/api/src/modules/ai/providers/manager.ts` (injectable providers; default behavior unchanged)
- `apps/api/tests/**` simulation helpers and ModelManager fallback tests

## Out of Scope / Non-Goals

- Real Raspberry Pi, RK3566, or classroom edge station bring-up
- Treating simulation PASS as on-device hardware delivery
- Parent / school / volunteer collaboration expansion
- Payment / donation activation; direct student-volunteer contact
- Destructive deletion of M86-deferred orphans
- Tech-stack replacement or schema migration
- Secrets, production data, or production deployment

## Success Criteria

- [ ] Governance files agree that M87 is active and M82-M86 are closed with notes/deferrals
- [ ] Four edge constraint profiles pass without live Ollama or physical hardware
- [ ] `pi-down` / `offline-core` prove honest fallback to rule engine (or next stub) with observable `providerId`
- [ ] `pi-slow` completes inside test timeout via degrade-on-timeout, not hang
- [ ] Docs state clearly: Hardware paused; sim gate ≠ classroom hardware ready

## Failure Examples

- Blocking acceptance because a physical Pi or host Ollama is missing
- Claiming Implemented-on-device from simulation alone
- Expanding deferred collaboration or payment surfaces under M87
- Developer self-acceptance without evidence links
