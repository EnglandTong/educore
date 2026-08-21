# M82-R1 Evidence Index — Fresh Verification (2026-08-17)

Run by: Developer (M82 audit-only). Environment: Node v24.16.0, pnpm 9.15.0,
Turbo 2.9.x, HEAD `4913467`, workspace `D:\Development\EduCore`.
Each row: command, exit code, timestamp note, tail, raw log path.

> Caveat: root typecheck/test/lint ran via Turbo and were largely **cache hits**
> (Turbo validates cache keys against current source, but did not re-execute from
> scratch). Web build + web e2e were re-run directly to obtain trustworthy exit codes.

| # | Command | Exit | Tail / key fact | Raw log |
|---|---|---|---|---|
| 1 | `pnpm -w run typecheck` | 0 | 9/9 tasks successful, 9 cached | `docs/evidence/M82/pnpm_w_run_typecheck.log` |
| 2 | `pnpm -w run test` | 0 | 12/12 tasks; real tests: algorithms 53, api 54, validation 18; web 0 (no test files); types/constants echo | `docs/evidence/M82/pnpm_w_run_test.log` |
| 3 | `pnpm -w run lint` | 0 | web = `echo "lint configured in a later sprint"`; api/types/constants = `tsc --noEmit` | `docs/evidence/M82/pnpm_w_run_lint.log` |
| 4 | `pnpm --filter @educore/api test` | 0 | 11 files / 54 tests (unit+security+integration) | `docs/evidence/M82/pnpm_filter_educore_api_test.log` |
| 5 | `pnpm --filter @educore/web run build` | **1 (outer wrapper artifact)** | see R1-5a/5b below | `docs/evidence/M82/pnpm_filter_educore_web_run_build.log` |
| 5a | `pnpm exec tsc --noEmit` (web) | 0 | typecheck clean | `docs/evidence/M82/web_tsc.log` |
| 5b | `pnpm exec vite build` (web) | 0 (build proceeds; dist produced) | 2818 modules transformed, dist/sw.js + PWA precache generated | `docs/evidence/M82/web_vite_build.log` |
| 6 | `pnpm --filter @educore/web run test:e2e` | 0 | 17 tests / 4 files / 1.4m; **uses e2e-mocks 200 envelope (UI wiring only)** | `docs/evidence/M82/web_e2e.log` |
| 7 | constants declaration drift check | N/A | `dist/mastery.d.ts` identical to `src/mastery.ts` (6 levels, thresholds, PROFICIENT_UNLOCK_SCORE=70, MASTERY_CHALLENGE_PASSING_SCORE=5) — **no drift** | `packages/constants/dist/mastery.d.ts` |

## True/false-positive notes

- **Web build EXIT=1 is a false positive**: `tsc --noEmit && vite build` — vite ran
  (so tsc passed), and re-running each part directly yields rc=0. The outer pnpm
  wrapper under PowerShell did not return the real exit code (matches HANDOFF §1.2 warning).
  Real build = SUCCESS.
- **Green ≠ capability**: web `lint` is a no-op echo; web unit tests = 0 files; e2e
  is mock-backed. None of these prove runtime/permission/DB behavior.

## M81A re-verification input (preliminary, NOT a decision)

Fresh evidence shows the verification *harness* passes (with the caveats above), but
the M81A "Verification Baseline & Governance Convergence" cannot be called Accepted because:
(a) governance files still conflict (MP8, P0), (b) web quality gates are empty,
(c) e2e is mock-only. Recommended classification for Controller review:
**Accept-with-notes** at most; final decision deferred to `REBASELINE_AUDIT.md` (R6).
Developer does not self-accept.
