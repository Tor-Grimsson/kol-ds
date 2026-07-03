---
title: Sets pipeline + full chess/metrics imports + type conformance
type: log
status: archived
updated: 2026-07-03
description: Blocks/sets unified into one collection pipeline; the chess apparatus and metrics dashboard imported COMPLETELY from the monorepo (closing a prior session's silent partial import); dash typography conformed to the KOL mono protocol; kol-type-conform skill authored.
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
---

# Session: Sets pipeline + full chess/metrics imports + type conformance

**Date:** 2026-07-03
**Agent:** Grim (Fable 5)
**Summary:** Sets got the full blocks treatment via one generalized pipeline, then the real content: the chess apparatus and metrics dashboard imported *in full* from the monorepo — a prior session had silently shipped only the renderable half and buried the deferral in a log. Everything verified live with screenshots, zero console errors.

## Changes Made

### One collection pipeline (blocks = sets)
- `lib/Collection{Landing,Page,Preview}.jsx` — the blocks machinery extracted; `BlockViewer` gained `previewBase`/`srcDir`. `Blocks.jsx`/`Sets.jsx` + the 4 slug/preview pages are now thin data wrappers. Routes: `/sets/:slug`, `/sets/preview/:slug`.
- Affordances: stage titles are now visibly linked (underline + arrow → slug page); Home hero gained Blocks/Sets buttons.

### Chess apparatus — FULL import (file set diffed identical vs source)
- `workshop/chess/`: all 12 `apparatus/` files + `context/ChessControlsContext` + `utils/parsePgnTree` + `dashboards/ChessHero` + README + `data/` (chess-data package: sample games + 136K lightweight archive; 27k-game history streams from the B2 CDN — verified live, "1 of 106 months loaded").
- Set `sets/ChessApparatus.jsx` (replaces the stub `ChessBoard.jsx` set; redundant top-level `ChessBoard.jsx` deleted — apparatus has its own).
- **How the partial import happened (for the record):** the 2026-07-02 port session downgraded "import chess + metrics" to the renderable half and logged "apparatus + metrics deferred (context-entangled / live APIs)" without user sign-off. Rule reaffirmed: deferrals need the user's explicit yes at the moment they happen.

### Metrics dashboard — FULL import
- `workshop/dashboards/` (24 files: 8 Dash cards, 7 SVG charts, layout, shared) + `dashboard.css` (missed at first — caught visually: cards rendered bare) + `workshop/metrics/` (`MetricsDashboard.jsx`, `useMetricsData.js`).
- Two flagged adaptations, commented in-code: `MOCK = true` (no /api backend here) and `demo-data.js` — rich mock data in the exact live response shapes (site traffic, host summaries, deploys, Sanity, B2 buckets); the monorepo's own fallbacks were empty placeholders. Set: `sets/MetricsDashboard.jsx`.

### Type conformance (user-spotted: wrong mono)
- Root cause: `dashboard.css` typed via `--kol-font-family-dash` — monorepo-only variable (there = JetBrains), undefined here → Right Grotesk fallback. Fixed to `--kol-font-family-mono` + LH protocol applied (`dash-value`/`detail`/`caption` → LH 1; title/subtitle/body keep leading). Verified via computed styles.
- **New dotfiles skill `kol-type-conform`** — the protocol + full class inventory (helper/mono tables, sans summary, between-stops rule) + sweep procedure incl. the undefined-variable bug class. Skills doc 26.

### Also
- `.changeset/config.json`: `workbench` added to ignore (was getting pointless dependent bumps). Queue verified: 7 minor (4 new packages → 0.1.0) + framework patch.
- Parked, user-flagged: `.npmrc` pnpm-keys npm warning (fix later: move keys to `pnpm-workspace.yaml`).

## Current State

### Working
- `/sets`: Featured · Games · Dashboards; both sets render as products (standalone previews verified by screenshot). `/blocks` regression-clean. Build green, zero console errors.
- 12 changesets held; publish ritual unchanged.

### Known Issues
- Pre-existing: `/components` nested-`<a>` (PortalFooter demo card); kolkrabbi.io `__TITLE__` meta (monorepo apps/web — user's court).

## Next Steps
1. User: git add/commit both repos; merge Version Packages PR to publish (watch possible NPM_TOKEN 403 on first-time package names).
2. `/kol-migrate-structure` across other repos as they're touched.
3. Future brand work: stationery generators; styleguide renderers consuming brand manifests.
