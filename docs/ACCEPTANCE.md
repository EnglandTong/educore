# ACCEPTANCE - EduCore

Status: M81A Active
Owner: Controller/QA
Last updated: 2026-07-23
Latest accepted baseline: M80 - National Talent Development Evidence Pack

## Must Pass (M81A)

- [x] @educore/constants dist rebuilt — `dist/mastery.d.ts` exports `scoreToMasteryLevel` + `parseMasteryLevel`.
  - Evidence: `pnpm --filter @educore/constants run build` succeeds; d.ts verified.

- [x] Root turbo typecheck passes — `pnpm run typecheck` 9/9 tasks green.
  - Evidence: 2026-07-23 run, 9 successful tasks.

- [x] Root turbo test passes — `pnpm run test` 12/12 tasks green.
  - Evidence: 2026-07-23 run, 12 successful tasks (54+53+18 unit tests).

- [x] Web build passes — `pnpm --filter @educore/web run build` succeeds.
  - Evidence: built in 20.28s, PWA precache 35 entries.

- [x] school.routes.ts add-teacher pushes teacher userId (not schoolId) into teacherIds.
  - Evidence: code review — uses `existingUser._id` with `.equals()` dedup.

- [x] school.routes.ts remove-teacher removes from teacherIds + conditional role demotion.
  - Evidence: code review — filters teacherIds, only demotes if role === "teacher".

- [x] QA answer rating requires question-author ownership.
  - Evidence: code review — 403 if `question.studentId !== user.id`.

- [x] Volunteer register restricted to student/teacher/parent roles.
  - Evidence: code review — 403 for other roles.

- [x] Docs governance files converged to M81A.
  - Evidence: STATUS/ACCEPTANCE/NEXT_ACTIONS/PENDING/CMS/Work_Order_Active all updated.

## Should Pass

- [ ] API unit tests still pass after route changes (no regression).
  - Evidence: `pnpm --filter @educore/api run test` — 54 passed.

## Verification Commands

```bash
pnpm run typecheck        # 9/9 PASS
pnpm run test             # 12/12 PASS
pnpm --filter @educore/web run build   # PASS
```

## Completion Gate

- Done: all Must Pass items have objective evidence, verification commands pass, no stop rule triggered.
- Blocked: credentials, production data, or architecture changes required.
- Failed / Needs Fix: any Must Pass item lacks evidence or weakens M80 accepted baseline.

