# M87 Evidence Index

Date: 2026-09-09
Branch: `cursor/m87-sim-hardware-gate-93ef`
Work order: `docs/WORK_ORDER_M87.md`

## Commands

| Command | Exit | Log |
|---|---|---|
| `pnpm --filter @educore/api test` | 0 | `api-test.txt` |
| `pnpm --filter @educore/api typecheck` | 0 | `api-typecheck.txt` |

## Results

- API Vitest: **12 files / 60 tests passed** (includes 6 new M87 simulation tests).
- Prior M84 baseline was 54 API tests; M87 adds +6 without live Ollama or physical Pi.
- Typecheck: PASS.

## Edge constraint profiles covered

| Profile | Expected | Evidence |
|---|---|---|
| `pi-ok` | `providerId=ollama` via SimOllama | `model-manager-fallback.test.ts` |
| `pi-slow` | degrade to `rule` within timeout | same |
| `pi-down` | unreachable local → `rule` | same |
| `offline-core` | rule-only | same |

## Hardware gate statement

Simulation PASS proves degrade/fallback under encoded Pi-like constraints.
It does **not** prove classroom Raspberry Pi / on-device delivery. Hardware remains paused.

## Source identity

See `runtime.txt` (Node, pnpm, git HEAD at evidence capture).
