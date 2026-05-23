# AGENTS.md

## Cursor Cloud specific instructions

### Services overview

| Service | Port | Required | Notes |
|---------|------|----------|-------|
| MongoDB | 27017 | Yes | API cannot start without it |
| Redis | 6379 | No | Graceful degradation; no token rotation in dev |
| API (Fastify) | 4000 | Yes | `pnpm dev` from `apps/api/` |
| Web (Vite) | 5173 | Yes | `pnpm dev` from `apps/web/` |

### Starting MongoDB

MongoDB 7 is installed system-wide. Since systemd is not available, start it manually:

```bash
mkdir -p /data/db
mongod --dbpath /data/db --fork --logpath /var/log/mongodb.log --bind_ip_all
```

If forking fails (stale lock), remove `/data/db/mongod.lock` and `/tmp/mongodb-27017.sock` then retry.

### Environment file

Copy `.env.example` to `.env` at the repo root before starting the API. Default values work for local dev (no auth on MongoDB, Redis optional).

### Build order gotcha

The monorepo uses Turborepo with `composite` TypeScript projects. Stale `tsconfig.tsbuildinfo` files in `packages/` can cause spurious "Could not find declaration file" errors on typecheck/lint. The update script cleans these automatically, but if you hit this issue interactively, run:

```bash
find packages -name "tsconfig.tsbuildinfo" -delete && find packages apps -name "dist" -type d -exec rm -rf {} + 2>/dev/null; pnpm build
```

### Running standard commands

See root `package.json` scripts. All are run via Turborepo:

- `pnpm dev` — starts both API and web in watch mode
- `pnpm typecheck` — type-checks all packages
- `pnpm lint` — runs linting (TypeScript type-check for most packages)
- `pnpm test` — runs Vitest unit/integration tests (uses `mongodb-memory-server`, no real DB needed)
- `pnpm build` — full production build

### Seed data note

`modules/math-algebra/seeds/B1.json` had a corrupted JSON entry (literal control character). It has been patched. If you encounter similar JSON parse errors in seed files during `loadModules()`, check for malformed strings with unescaped control characters.
