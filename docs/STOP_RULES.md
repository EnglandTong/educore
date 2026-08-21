# STOP_RULES - M82-M86 Program

Status: Active
Governance: Large + Full
Last updated: 2026-08-16 (supersedes M50-era rules; OVR-001 loop-budget override expired at M80 acceptance and is not renewed)

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

## Program-specific stops (M82-M86)

- S1: No large-scale code refactoring before M83 Owner rebaseline is signed
- S2: No expansion of volunteer/enterprise/matching/talent features before M84 is
     independently QA-accepted
- S3: M82 loops must not modify `apps/`, `packages/`, `modules/` source; findings go to Docs only
- S4: No milestone may be marked Accepted without its evidence class complete (see ACCEPTANCE.md)
- S5: Historical PASS never overrides fresh failing evidence
- S6: A failed verification command must not be retried more than twice in one loop; then stop
- S7: If audit evidence contradicts the current TARGET/ACCEPTANCE text, stop and reconcile first

## Loop budget stops

- `max_loops` per work order: see `Docs/LOOP_CONFIG.md`; exhaustion -> status Blocked + HANDOFF.md
- `max_consecutive_failures`: 2 (same signature), then stop (rule 7)

## Failure handling protocol

1. Record command, exit code, output tail in LOOP_STATE.md
2. Classify: environment / flaky / real defect
3. Real defect -> add to P0/P1/P2 list, do not fix within an audit loop (M82) unless Controller
   explicitly dispatches a fix loop
4. Two consecutive same-signature failures -> stop, write HANDOFF.md, await Controller
