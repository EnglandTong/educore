# Deployment Precheck - EduCore MVP

Status: Draft for Controller/QA Review
Owner: Developer
Created: 2026-06-20T09:10:00+08:00

## Purpose

This document records non-secret deployment readiness checks for the existing EduCore MVP. It does not authorize production deployment, production credential setup, cloud mutation, or architecture changes.

Production deployment and credential configuration require Owner approval before any action.

## Local Readiness

Run local acceptance from the repository root:

- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`

Required result:

- command exits `0`;
- output includes `Acceptance check passed`;
- durable evidence is updated under `docs/` and the Playwright report remains available at `apps/web/e2e-report/index.html`.

The strict command currently covers:

- workspace typecheck;
- unit tests;
- lint command;
- non-web package build;
- web typecheck;
- web bundle build;
- web e2e journey smoke.

## Staging Preparation

Before any Owner-approved staging deployment, confirm only variable names and configuration responsibilities. Do not place real values in this document.

Variables already present in repository examples or code:

- `PORT`
- `NODE_ENV`
- `HOST`
- `MONGODB_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_ACCESS_EXPIRY`
- `JWT_REFRESH_EXPIRY`
- `ARK_API_KEY`
- `ARK_BASE_URL`
- `ARK_MODEL`
- `OLLAMA_ENABLED`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `VITE_API_URL`
- `CORS_ORIGIN`

Precheck requirements:

- `NODE_ENV` must match the intended environment.
- `VITE_API_URL` must point to the approved API base URL for that environment.
- `CORS_ORIGIN` must be explicit for non-local environments.
- `JWT_SECRET` must not use the default placeholder value.
- Database and Redis connection strings must be provided through the approved secret/config mechanism, not committed files.
- Optional AI provider settings must remain blank or disabled unless Owner approves provider credentials.

## Production Exclusions

The M14 Program does not sign off production deployment.

The following are excluded and require Owner approval:

- production deployment execution;
- production secrets, tokens, private keys, OAuth credentials, or paid-service keys;
- live user data access or migration;
- cloud resource creation, deletion, or mutation;
- new deployment scripts or architecture changes;
- modifying `.env` or `.env.*` files.

## Evidence Paths

Use these evidence paths for Controller/QA review:

- `docs/ACCEPTANCE.md`
- `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md`
- `docs/LOOP_STATE_Workbuddy.md`
- `docs/LOOP_LOG_Workbuddy.jsonl`
- `docs/LOOP_RUNS.jsonl`
- `apps/web/e2e-report/index.html`

## Stop Conditions

Stop and return to Controller/QA or Owner if a next step requires:

- real secret values;
- production data;
- external network provisioning;
- system-level installation;
- modifying files outside `D:\Development\EduCore`;
- new architecture or a new shared subsystem.

## Acceptance Reference

The local readiness pass condition remains the existing strict acceptance output:

- `Acceptance check passed`
