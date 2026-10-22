# Session: Catalog variants button, no-cover card, Content Card page, loader minimum

**Date:** 2026-10-22
**Agent:** Claude (Grim)
**Summary:** Built the catalog plan (all but 2.2), fixed the props tables estate-wide, built kol-monitor's loader minimum; published kol-component 0.284.0 · kol-framework 0.53.0.

## Changes Made

### Files Modified
- `pnpm-lock.yaml` — refreshed; Vercel's frozen install failed on kol-framework's `kol-theme >=0.179.0` peer.
- `packages/component/src/molecules/ContentCard.jsx` — catalog card with `media={false}` keeps its plate at the frame's foot.
- `packages/framework/src/loaderApp.js` — `hideLoaderApp({ minMs = 600 })`, per-app override.
- `showcase/src/open-questions/2026-10-22.jsx` — Round 16, the variants button (icon · size · fill · shadow, light + dark).
- `apps/catalog/src/App.jsx` — round button top-right at the page pad; panel: preset · card · row · list · width · media.
- `showcase/src/previews/ContentCard.jsx` — variants file · catalog · slide · article · showcase · canvas; stage full; states axis for no cover · corner controls · fit · ratio · fade.
- `scripts/extract-api.mjs` — every destructured prop is a row; definitions pair by display name first. Tables 1126 → 2450 rows, none lost.
- `docs/operations/04-content-pipeline/01-sources.md`, shipped-packages table, both changelogs.
- Plan: `plan-2026-10-22-catalog-variants-and-no-cover.md`.

## Current State

### Working
- Published kol-component 0.284.0 · kol-framework 0.53.0.
- Catalog app: shelf = 3 cols of slide cards with download · star · trash; Missing = placeholder.
- Loader: fast load done at 616 ms, `minMs: 0` at 44 ms.

### Known Issues
- `validate:drift` — 9 violations, the same 9 before this change.
- `validate:previews` (browser gate) ran past 6 minutes; killed, pages checked by hand.

## Next Steps
1. Round 16 — the user picks the button; a different pick is two lines in `apps/catalog/src/App.jsx`.
2. 2.2 (TALK): the same button on the other reference apps.
3. Push is the user's.
