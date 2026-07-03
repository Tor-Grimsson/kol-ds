---
title: Composition manifests on block/set slug pages
type: log
status: archived
updated: 2026-07-03
description: Every /blocks/:slug and /sets/:slug now renders the full scanner-derived component manifest — linked KOL components, local parts by area, support modules, external deps — via a new extract-composition scanner in the extract:docs chain.
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
---

# Session: Composition manifests on block/set slug pages

**Date:** 2026-07-03
**Agent:** Grim (Fable 5)
**Summary:** User requirement (repeated, finally landed): slug pages must list EVERY component the featured block/set is compiled from. Implemented scanner-first so the list can never drift or be hand-authored.

## Changes Made

- **`scripts/extract-composition.mjs`** — new scanner: walks each `blocks/*.jsx` + `sets/*.jsx` entry, follows relative imports **transitively** (incl. `export … from` re-export barrels — a naive import-only scan silently misses barrel-routed families; first pass missed ChessPiece + the whole dashboards family until the barrel pattern was added). Collects: `@kolkrabbi/*` named imports · local `.jsx` parts grouped by area · `.js` support modules · external packages. Output: `showcase/src/usage/composition.json`. Wired into `pnpm extract:docs` (3rd step).
- **Registries** (`blocks-registry.js`, `sets-registry.js`) attach `composition` per entry from the JSON.
- **`lib/CollectionPage.jsx`** — new "Components" section under the viewer: KOL components as chips **linked** to `/components/:slug` (Icon/Graphic route to `/docs/loaders`; unlinked names render as plain chips), local parts grouped by area with counts, support-modules and external-deps lines.

## Current State

### Working (verified live, zero console errors)
- `/sets/ChessApparatus`: KOL (6, linked) · workshop/chess parts (10, incl. ChessPiece + context) · support (parsePgnTree, sample-games, lightweight) · external (chess.js). Bonus observation: the archive's CDN month-fetch works live (Jul 2023 games loaded in the stage).
- `/sets/MetricsDashboard`: KOL (3) · dashboards parts (20 — all cards + charts + layout + shared) · metrics module · support (5).
- All 6 blocks scanned and rendering their manifests. New blocks/sets get theirs automatically.

### Known Issues
- Unchanged parked items (nested-`<a>` on /components; kolkrabbi.io meta; .npmrc npm warning).

## Next Steps
1. User: commit both repos; merge Version Packages PR for the 12-changeset publish.
2. Regenerate (`pnpm extract:docs`) whenever block/set imports change — CI could enforce staleness later if drift ever bites.
