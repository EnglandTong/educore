# Smoke Flow Checklist M15

Status: P15-02 Developer Complete
Owner: MRT-Developer
Updated: 2026-06-20T10:14:00+08:00

## Purpose

Provide a local-only smoke-flow checklist for the accepted EduCore learner journey and supporting routes. This checklist does not require production credentials, live user data, external services, or production deployment.

## Automation Anchor

Run from repository root:

- `corepack pnpm --filter @educore/web run test:e2e --reporter=list`

Expected result:

- command exits `0`;
- 11/11 Playwright tests pass;
- report path is `apps/web/e2e-report/index.html`.

## Local-Only Checklist

### Student Journey

- [ ] `register/signin`: create or reuse the local mocked student account through the e2e flow.
  - E2E anchor: `Student Journey - Register login check-in and diagnostic flow`
- [ ] `check-in`: verify the local check-in route opens and accepts a mood/note path where available.
  - E2E anchor: `Student Journey - Register login check-in and diagnostic flow`
- [ ] `diagnostic`: verify diagnostic route is reachable and renders its heading/content.
  - E2E anchor: `Student Journey - Register login check-in and diagnostic flow`
- [ ] `training answer`: verify practice adventure starts, a training answer can be selected, and the answer can be submitted.
  - E2E anchor: `Student Journey - Training answer feedback and session summary flow`
- [ ] `training feedback`: verify visible feedback or explanation appears after answer submission.
  - E2E anchor: `Student Journey - Training answer feedback and session summary flow`
- [ ] `session summary`: verify ending the session shows the recap/summary state.
  - E2E anchor: `Student Journey - Training answer feedback and session summary flow`
- [ ] `wrong-answer review`: verify review notes show wrong-answer evidence and the revisit action can be recorded.
  - E2E anchor: `Student Journey - Review notes show wrong-answer evidence and revisit action`
- [ ] `heart journal`: verify the heart space journal route accepts a local journal entry.
  - E2E anchor: `Student Journey - Heart journal and proud wall interactions`
- [ ] `proud wall`: verify the proud wall route accepts a local proud moment.
  - E2E anchor: `Student Journey - Heart journal and proud wall interactions`

### Supporting Route Smoke

- [ ] `parent`: verify parent register/link-child/progress route smoke.
  - E2E anchor: `Parent Journey - register -> link child -> view progress`
- [ ] `teacher`: verify teacher register/class/announcement route smoke.
  - E2E anchor: `Teacher Journey - register -> view class -> check announcements`
- [ ] `donation`: verify public donation page and basic routing smoke.
  - E2E anchor: `Donation Page - public donation page renders and form works`

## Evidence Paths

- `apps/web/e2e-report/index.html`
- `apps/web/e2e/student-journey.spec.ts`
- `apps/web/e2e/parent-journey.spec.ts`
- `apps/web/e2e/teacher-journey.spec.ts`
- `apps/web/e2e/donation-routing.spec.ts`
- `docs/EVIDENCE_INDEX_M15.md`
- `docs/LOOP_RUNS.jsonl`

## Exclusions

- No production credentials.
- No live data.
- No external service dependency.
- No product source changes.
- No new architecture or subsystem.
