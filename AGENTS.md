# AGENTS.md

## Cursor Cloud specific instructions

EduCore (光合啟途) is a Turborepo + pnpm monorepo for an adaptive learning platform.

- `apps/api` — Fastify + TypeScript REST API (port `4000`), uses MongoDB (Mongoose) + Redis (ioredis).
- `apps/web` — React 19 + Vite PWA frontend (dev port `5173`).
- `packages/*` — shared `types`, `algorithms`, `constants`, `validation` (built with `tsc`).
- `modules/` — subject content (manifests + question seed JSON) loaded by the API at startup.

Standard scripts live in the root `package.json` (`pnpm dev|build|test|lint|typecheck`) and per-app `package.json`. CI is `.github/workflows/ci.yml` (the authoritative env-var matrix for typecheck/build/test/lint).

### Services (must be running for the API + hello-world flow)

MongoDB and Redis are required by the API in dev. They are installed in the VM image (snapshot), not started by the update script — start them yourself, then run the apps:

- MongoDB: `mongod` is at `/usr/local/bin/mongod` (binary reused from `mongodb-memory-server`; `mongosh` is NOT installed). Start with: `mongod --dbpath ~/data/db --bind_ip 127.0.0.1 --port 27017`.
- Redis: `redis-server --port 6379` (installed via apt; the systemd unit does not auto-start in this container).
- Run them in the background (e.g. tmux) since they are long-lived.

Seed data after Mongo is up (idempotent): `set -a && . ./.env && set +a && pnpm --filter @educore/api db:indexes && pnpm --filter @educore/api db:seed && pnpm --filter @educore/api db:seed-demo`. Demo logins: `demo.student@educore.example` / `demo123` (also parent + teacher).

### Running the apps

- From the repo root, `pnpm dev` runs both API and web via Turbo. The dev scripts do NOT auto-load `.env`; the API falls back to working localhost defaults in `apps/api/src/config/env.ts` (Mongo `27017`, Redis `6379`, dev JWT secret), so it runs as long as Mongo/Redis are up. A local `.env` (copied from `.env.example`) also exists.
- Web dev API calls: leave `VITE_API_URL` UNSET so the frontend uses relative `/api/v1` through the Vite dev proxy (`vite.config.ts` proxies `/api` → `localhost:4000`, same-origin). Sourcing `.env` exports an absolute `VITE_API_URL`; that still works (dev CORS allows all origins) but the proxy is the canonical path. Health check: `curl localhost:4000/health`.

### Gotchas

- Stale `*.tsbuildinfo` are committed but `dist/` is gitignored. On a fresh checkout (no `dist/`), `pnpm build`/`pnpm test` can fail with `Could not find a declaration file for module '@educore/types'`. Fix with a clean rebuild: `find . -name '*.tsbuildinfo' -delete && rm -rf packages/*/dist apps/*/dist && pnpm build`. The snapshot already has built `dist/`, so this only bites after a manual clean.
- `pnpm test` and `pnpm build` depend on the shared packages being built first (Turbo handles ordering); run them from the repo root, not inside a single package.
- Tests use `mongodb-memory-server` (binary cached under `node_modules/.cache`), so the API/package test suites do NOT need the standalone Mongo/Redis running. Use `NODE_ENV=test` and provide the CI env vars when running tests/lint/typecheck (see `ci.yml`).
