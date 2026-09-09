# HANDOFF_M87 — Developer — 2026-09-09

## Outcome

M87-R1–R3 Developer delivery complete. Status: **Ready for Controller/QA Review**.

## File list

### Docs
- `docs/TARGET.md`, `docs/ACCEPTANCE.md`, `docs/STATUS.md`, `docs/PENDING.md`, `docs/NEXT_ACTIONS.md`
- `docs/LOOP_STATE.md`, `docs/LOOP_CONFIG.md`, `docs/STOP_RULES.md`, `docs/CMS.md`, `docs/Work_Order_Active.md`
- `docs/WORK_ORDER_M87.md`, `docs/PLACEHOLDER_ENDPOINTS.md`
- `docs/evidence/M87/*`, `docs/QA_M87_ACCEPTANCE_2026-09-09.md`, this handoff

### Code
- `apps/api/src/modules/ai/providers/manager.ts` — injectable `ModelManager`
- `apps/api/src/modules/ai/providers/ollama.ts` — optional constructor config
- `apps/api/tests/helpers/sim-ollama.ts`
- `apps/api/tests/fixtures/edge-profiles.ts`
- `apps/api/tests/unit/model-manager-fallback.test.ts`

## Source identity

- Branch: `cursor/m87-sim-hardware-gate-93ef`
- See `docs/evidence/M87/runtime.txt` for HEAD captured with evidence

## Test output

- API: 60/60 passed (`docs/evidence/M87/api-test.txt`)
- Typecheck: PASS (`docs/evidence/M87/api-typecheck.txt`)

## Known risks

- Real on-device Ollama / Pi still unproven (by design for M87)
- Clean cloud installs may need `tsc -b --force` on workspace packages before API vitest resolves `@educore/*`

## Not run

- Web E2E / Playwright (out of M87 scope)
- Live Ark API (no CI key; intentionally stubbed/skipped)
- Physical Raspberry Pi

## Rollback

- Revert the M87 commits on this branch; production default `modelManager` singleton behavior is preserved when no providers are injected.
