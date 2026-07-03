---
title: README overhaul + Vercel deploy
type: log
status: archived
updated: 2026-07-03
description: Rewrote the stale root README as a thin front door (roster 4→8, real publish flow, less prose) and stood up the Vercel deploy at ds.kolkrabbi.io.
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
related:
  - "[[2026-07-03-context-reset-fresh-agent|prior session]]"
---

# Session: README overhaul + Vercel deploy

**Date:** 2026-07-03
**Summary:** Root README was very stale — fixed the lies and cut the noise, keeping it a front door (depth lives in `docs/documentation/`). Also worked out the Vercel import and put the live site in the README.

## Changes Made

- `README.md` — full rewrite:
  - **Packages 4 → 8**, one table with a Tier column (UI / Client / Brand / Tool). Clients tier, brand-kit tier, and `kol-scrape` were missing entirely.
  - **Publishing** corrected to the real flow: `pnpm changeset` → push → merge the "Version Packages" PR (**merging is the publish button**) → `git pull`. Killed the misleading manual `version-packages`/`release` recipe.
  - **Showcase** line now names Components / Blocks / Sets / Docs / Icons.
  - New **Deploy (Vercel)** + **Layout** sections; `.kol/` called out as the reference implementation.
  - Deleted the trailing `# kol-ds` junk line and trimmed wordy consumer/dev prose.
  - Added a clickable shields.io **live badge** at the top → https://ds.kolkrabbi.io.

## Vercel import (settings that matter)

- **Root Directory = repo root**, NOT `showcase/` — the app pulls packages via `workspace:*`, which only resolve when pnpm installs from the workspace root. Rooting at `showcase/` chokes install.
- Framework preset **Vite** · build `pnpm build` · output `showcase/dist` · install auto (pnpm 9.15 from `packageManager`).
- Live at **ds.kolkrabbi.io**.

## Next Steps

- None open. README isn't published, so no changeset needed.
