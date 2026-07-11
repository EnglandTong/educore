# STOP_RULES - EduCore

Status: M50 Planning Baseline
Last updated: 2026-07-06

Project-level stop rules may be stricter than general agent rules. They must not be loosened unless the Owner explicitly approves.

## Hard Stops

Stop immediately, mark the work Blocked, and record evidence in the relevant `Docs/` status files if any task requires:

- Reading, creating, changing, or exposing secrets, tokens, `.env` files, OAuth credentials, Supabase secrets, private keys, SSH keys, or production credentials.
- Access to production databases, real student records, real customer data, paid cloud resources, or unauthorized external resources.
- Direct student contact, mentorship, volunteer interaction, enterprise interaction, or matching without explicit consent, audit, and Controller/QA-approved milestone scope.
- System-level installation, drivers, registry changes, host security settings, or administrator-only machine changes.
- Changing OS, shell, browser, IDE, global Git configuration, or host-level security posture.
- Destructive Git or filesystem operations, including history rewrite, force push, reset, irreversible delete, or out-of-scope overwrite.
- Technology stack replacement, large version upgrade, new architecture, new subsystem, new shared layer, or project goal change.
- Schema migration, assignment CRUD, production deployment, or external integration not explicitly authorized by the active milestone.
- Writing outside `D:\Development\EduCore`.
- Self-accepting a milestone as Accepted or Completed without Controller/QA signoff.

## Student Protection Stops

Stop immediately if the task would:

- Allow volunteer, enterprise, mentor, teacher, or school representative contact with a student without consent and supervision rules.
- Expose student personal data beyond the role's approved visibility.
- Create rankings, labels, or feedback that shame, discourage, or negatively categorize students by region, poverty, school resources, or background.
- Store or display sensitive student data without auditability, retention boundaries, and access controls.
- Use student data for talent discovery, enterprise programs, or opportunity matching without explicit governance and approval.

## Volunteer / Enterprise Governance Stops

Stop immediately if the task would:

- Onboard a volunteer, organization, enterprise, volunteer teacher, or volunteer school without review status and accountable owner.
- Publish industry, school, major, or work-environment content without source attribution and review path.
- Create a matching engine, mentorship session, or enterprise cultivation path before M50-M53 safety and role boundaries are accepted.
- Let an external party change student-facing content, recommendations, or opportunity allocation without audit trail.

## Budget Stops

- max_loops: 8
- max_consecutive_failures: 2
- max_runtime_minutes: 60
- Stop if the same verification failure repeats twice without a new root cause or narrower failing scope.
- Stop if the current context is insufficient to safely distinguish planning from implementation.

## Project-Specific Stops

- M50 is docs-only. Stop if implementation work begins in `apps/`, `packages/`, database schema, deployment, or runtime integration.
- Stop if a task lowers or obscures the M49 accepted baseline: typecheck PASS, build PASS, e2e 17/17 PASS.
- Stop if state files, acceptance files, and work order files disagree about active milestone or scope.
- Stop if any work order conflicts with `Docs/TARGET.md`, `Docs/ACCEPTANCE.md`, or these stop rules.

## Overrides

Only explicit Owner approval may override project-specific scope limits. The following may not be overridden inside an agent loop: secret exposure, production data access, destructive Git actions, unauthorized student contact, and work outside the approved project directory.

### Owner Override OVR-001 — M50-M80 Autonomous Execution

- Date: 2026-07-06
- Scope: M50 through M80 milestones
- Owner approval: User explicitly authorized autonomous Controller→Developer→QA execution for all M50-M80 milestones
- Overridden rules:
  - M50 docs-only restriction (Project-Specific Stops line 1) — product code implementation allowed for M51+
  - "No volunteer, enterprise, mentor, matching, or student-contact feature implementation in M50" (TARGET.md Non-Goals) — implementation allowed for M51+ within milestone scope
  - "No new architecture, new subsystem, or shared layer without Owner approval" (TARGET.md Non-Goals) — pre-approved for M51-M80
  - max_loops: 8 (LOOP_CONFIG.md) — expanded to 96 (31 milestones × 3 phases)
  - "No self-acceptance by Developer" — autonomous QA phase allowed within loop, evidence-based
- Still NOT overridable:
  - No secret/credential exposure
  - No production data access
  - No destructive Git operations
  - No unauthorized student contact (product features must still include consent/audit)
  - No work outside D:\Development\EduCore
- Expiration: M80 acceptance or explicit revocation
