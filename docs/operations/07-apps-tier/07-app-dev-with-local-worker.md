---
title: App dev with a local worker
type: playbook
status: active
created: 2026-10-24
updated: 2026-10-24
audience: internal
description: One pnpm dev runs the app and its D1 worker locally — kol-fxr's setup, the rule for every app with a worker
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
aliases:
  - local-worker-dev
related:
  - "[[INDEX|Apps tier]]"
  - "[[01-tier-rules|Tier rules]]"
  - "[[06-studio-adoption|Studio adoption]]"
---

# App dev with a local worker

**The rule (user, 2026-10-24):** an app that has a D1 worker beside it runs that worker LOCALLY in dev, from the same `pnpm dev`, against wrangler's local SQLite — a save while developing never reaches the live database, and a worker change is tried before it is deployed. kol-fxr has run this way since plan 07 (2026-10-08); kol-mirror and kol-monitor ran `vite --force` against their deployed workers until this ruling and are converging. The setup is fxr's, file for file.

| File | What it holds |
|---|---|
| `scripts/dev.mjs` | applies the schema to the local D1, starts `wrangler dev` on 8787 and `vite --force` with `VITE_<APP>_API` pointed at it; Ctrl+C stops both |
| `package.json` scripts | `dev` → `node scripts/dev.mjs` · `dev:app` → `vite --force` (no API, the library local only) · `api:dev` · `api:schema` · `api:schema:local` · `api:deploy` |
| `api/wrangler.toml` | the worker: `name`, `main`, the custom-domain route, `[[d1_databases]]` binding `DB`, `[vars] ALLOWED_ORIGINS` |
| `api/schema.sql` | `CREATE TABLE IF NOT EXISTS …` — idempotent, applied on every `pnpm dev` |
| `api/.dev.vars` | `ADMIN_PASSWORD` for the local worker — gitignored; the deployed one is `wrangler secret put` |
| `.env.local` | the live host (`VITE_<APP>_API=https://<app>-api.kolkrabbi.io`) for a build or `dev:app`; in `pnpm dev` the script's environment wins |

**The worker port is fixed per app** so the three run side by side in one tmux session (two defaults on 8787 cannot both bind — found 2026-10-24):

| App | D1 | Variable | Worker port |
|---|---|---|---|
| kol-fxr (the reference) | `kol-fxr` | `VITE_FXR_API` | 8787 |
| kol-mirror | `kol-mirror` | `VITE_MIRROR_API` | 8788 |
| kol-monitor | `kol-monitor` | `VITE_MONITOR_API` | 8789 |

The port lives in two places — the script's default (`?? 'http://127.0.0.1:<port>'`) and `api:dev`'s `--port`. The next app with a worker takes 8790.

## 0. Prerequisites

- The app has a worker in `api/` with a D1 binding named `DB` in `api/wrangler.toml`, and a schema file (`api/schema.sql`, or migrations — then step 2 applies those).
- `wrangler` is a devDependency of the app (the script starts it from `node_modules/.bin`, not through `pnpm exec`, so each child is its own process group and one signal stops both).
- `api/.dev.vars` exists locally with `ADMIN_PASSWORD=…`, and `.gitignore` lists `api/.dev.vars` and `api/.wrangler/`.

## 1. The script

Copy kol-fxr's `scripts/dev.mjs` and change three names: the D1 database (`kol-fxr` → the app's), the env variable (`VITE_FXR_API` → the app's), the schema path if it differs. What it does, in order:

1. `wrangler d1 execute <db> --local --file api/schema.sql --config api/wrangler.toml` — waits for it.
2. `wrangler dev --config api/wrangler.toml --port 8787` and `vite --force` with `VITE_<APP>_API=http://127.0.0.1:8787` in the child's environment, each `detached` in its own process group.
3. On SIGINT · SIGTERM · SIGHUP, or when either child exits, kills both groups.

`VITE_<APP>_API` already set in the shell points the app elsewhere (the deployed worker) — the script reads it before falling back to 8787.

## 2. The scripts block

```json
"dev": "node scripts/dev.mjs",
"dev:app": "vite --force",
"api:dev": "wrangler dev --config api/wrangler.toml --port 8787",
"api:schema": "wrangler d1 execute <db> --remote --file api/schema.sql --config api/wrangler.toml",
"api:schema:local": "wrangler d1 execute <db> --local --file api/schema.sql --config api/wrangler.toml",
"api:deploy": "wrangler deploy --config api/wrangler.toml"
```

`dev` is the one the user runs, with the app's port in the two `8787`s above. `dev:app` is vite alone: with a `.env.local` naming the live host it talks to the deployed worker (mirror, monitor); without one (fxr) it has no API and no Sign in in the rail.

## 3. The app reads the host once

`setLibraryApi(import.meta.env.VITE_<APP>_API)` (or the app's equivalent) at boot; unset, the app has no cloud and says so. The worker allows `localhost` and `127.0.0.1` on any port as origins, so no CORS change is needed for dev.

## 4. Verification

1. `pnpm dev` prints vite's Local and Network lines AND wrangler's binding table with `env.DB  D1 Database  local` — both, in one terminal (fxr's pane is the picture of it).
2. Sign in with the `.dev.vars` password; save; the row lands in `api/.wrangler/` (the local SQLite), not in the live D1 — check the live one did not change.
3. Ctrl+C once stops both processes; no orphan on 8787 or the vite port.
4. `pnpm build` still reads `.env.local`'s live host; a deployed build talks to `<app>-api.kolkrabbi.io`.
