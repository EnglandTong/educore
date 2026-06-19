# UX Acceptance Rubric - EduCore Student Experience

Status: Developer Done - Ready for Controller/QA Final Review
Last updated: 2026-06-19

Use this rubric for UI/UX or user-experience signoff. A Controller/QA signature requires objective evidence, not subjective approval.

## Scoring Scale

- 5: Strong evidence; no material issue found.
- 4: Pass with minor polish items.
- 3: Minimum pass; acceptable but needs follow-up.
- 2: Not acceptable for signoff; clear fix required.
- 1: Blocking issue.

## Categories

1. Warm Non-Judgmental Copy
   - Measures whether student-facing labels, empty states, feedback, and review language avoid shame, blame, or punitive framing.
   - Evidence sources: visible UI text, `docs/UX_REVIEW_NOTES.md`, e2e route coverage.

2. Core Learning Flow Usability
   - Measures whether a learner can move through check-in, diagnostic, practice/training, review notes, and heart space without confusing dead ends.
   - Evidence sources: Playwright student journey smoke, route assertions, report output.

3. Review And Recovery Experience
   - Measures whether wrong answers/review notes are framed as revisits and provide a clear next action.
   - Evidence sources: wrong-answer page assertions, copy review, empty-state review.

4. Emotional Safety Features
   - Measures whether heart journal and proud wall flows are reachable and include supportive language and low-friction controls.
   - Evidence sources: Playwright heart journal/proud wall interactions, visible headings and controls.

5. Technical UX Reliability
   - Measures whether the UX can be verified consistently in local automation without depending on unavailable external services.
   - Evidence sources: strict acceptance command, e2e mock coverage, e2e report.

## Current Developer Self-Score

Date: 2026-06-19
Evaluator: Developer self-check before Controller/QA review

| Category | Score | Evidence |
| --- | ---: | --- |
| Warm Non-Judgmental Copy | 4 | `docs/UX_REVIEW_NOTES.md`; wrong-answer copy uses revisit/review framing. |
| Core Learning Flow Usability | 4 | Student e2e covers check-in, diagnostic, training, review notes. |
| Review And Recovery Experience | 4 | Wrong answers route and review copy are asserted in e2e. |
| Emotional Safety Features | 4 | Heart space, journal, and proud wall interactions covered in e2e. |
| Technical UX Reliability | 4 | Strict acceptance command exits 0; Playwright web journey smoke covers 11/11 local e2e tests with API mocks. |

Total: 20/25

Latest evidence: `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict` completed with `Acceptance check passed` at `2026-06-19T15:22:48+08:00`.

## Controller Rework Status - 2026-06-19

- Controller review issue: Milestone signoff was blocked because strict e2e could be marked PASS after timeout without validating output.
- Developer rework result: `PASS`.
- Latest command: `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
- Latest completed: `2026-06-19T16:29:36+08:00`
- UX evidence status: functionally PASS; awaiting Controller/QA final signoff for the Milestone.

## Controller/QA UX Signoff - 2026-06-19

- Signed: `2026-06-19T17:49:06+08:00`
- Status: `PASS`
- Score accepted: `20/25`
- Basis: strict acceptance passed, Playwright e2e covers 11/11 local journey tests, and student UX evidence has no category below `3/5`.

## Signoff Threshold

Controller/QA may sign the UX portion only when:

- no category is below 3/5;
- total score is at least 20/25;
- all evidence paths are current;
- any known limitation is listed in `docs/EVALUATION.md` or `docs/LOOP_STATE_Workbuddy.md`.
