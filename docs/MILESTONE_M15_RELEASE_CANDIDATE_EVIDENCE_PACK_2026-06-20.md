# Milestone M15 - Release Candidate Evidence Pack

Status: Program Created
Owner: MRT-Controller-QA
Created: 2026-06-20T10:03:37+08:00

## Controller/QA Decision

Previous milestone `M14 - MVP Readiness Hardening` is `Accepted`.

Evidence:

- `docs/QA_M14_ACCEPTANCE_2026-06-20.md`
- `docs/HANDOFF_M14_PROGRAM_DEVELOPER.md`
- `docs/LOOP_RUNS.jsonl`
- `docs/STATUS.md`

M15 is created as the next milestone because the current target boundary still allows evidence quality, local acceptance reliability, student learning loop verification depth, deployment precheck documentation, and Docs traceability work.

## Milestone Goal

Create a reviewable release-candidate evidence pack that maps acceptance requirements to current evidence, defines a repeatable local smoke checklist, audits evidence freshness, and prepares a consolidated Developer handoff for Controller/QA review.

## Status Classification

- Previous milestone: `Accepted`
- Current milestone: `Continue`
- Current program: `docs/M15_PROGRAM_2026-06-20.md`
- Dispatch: `docs/DISPATCH_M15_PROGRAM_TO_DEVELOPER.md`

## Completion Definition

M15 can be returned for Controller/QA review when every P15 work order is Developer-complete, current acceptance commands remain passing or have documented allowed no-run reasons, evidence paths are current, no stop rule is triggered, and the final handoff explicitly states remaining risks or `None`.

## Non-Goals

- Production deployment or production environment mutation.
- Production credentials, secrets, private keys, OAuth tokens, paid-service keys, or live user data.
- New product architecture, new subsystem, or shared platform layer.
- Business feature changes or broad UI redesign.
- Destructive git operations.
- Work outside `D:\Development\EduCore`.
