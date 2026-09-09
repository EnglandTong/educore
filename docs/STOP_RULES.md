# STOP_RULES - M87 Program

Status: Active
Governance: Large + Full
Last updated: 2026-09-09 (supersedes M82-M86 program-specific stops where they conflict with M87)

## Hard stops (always ask Owner / Controller first)

1. Secrets, credentials, production data, real student data access
2. Production deployment or external network exposure
3. Destructive git operations (force push, hard reset, history rewrite) or irreversible deletion
4. Tech-stack replacement, database engine migration, package manager change
5. New sponsorship/partnership/production commitments
6. Enabling donation/payment, or any direct volunteer/enterprise-to-student contact channel
7. Same failure signature twice with no new evidence -> stop, write `Docs/HANDOFF.md`, mark Blocked
8. Governance drift: TARGET.md / ACCEPTANCE.md / Work_Order_Active.md / STATUS.md disagree about
   the active milestone or scope -> stop and reconcile before any task
9. Outside review scope: security disclosure, data export, media claims

## Program-specific stops (M87)

- S1: Do **not** block acceptance because a physical Raspberry Pi or host Ollama is missing;
     simulated edge constraint tests are the authorized gate
- S2: Do not claim on-device / classroom hardware delivery from simulation PASS alone
- S3: Do not expand parent / school / volunteer / payment surfaces under M87
- S4: Do not destructively delete M86-deferred orphans without a separate Owner target
- S5: No milestone may be marked Accepted without its evidence class complete (see ACCEPTANCE.md)
- S6: Historical PASS never overrides fresh failing evidence
- S7: A failed verification command must not be retried more than twice in one loop; then stop
- S8: If audit evidence contradicts the current TARGET/ACCEPTANCE text, stop and reconcile first

## Loop budget stops

- `max_loops` per work order: see `Docs/LOOP_CONFIG.md`; exhaustion -> status Blocked + HANDOFF.md
- `max_consecutive_failures`: 2 (same signature), then stop (rule 7)

## Failure handling protocol

1. Record command, exit code, output tail in LOOP_STATE.md
2. Classify: environment / flaky / real defect
3. Real defect -> fix only inside the active M87 work-order boundary; otherwise stop for Controller
4. Two consecutive same-signature failures -> stop, write HANDOFF.md, await Controller
