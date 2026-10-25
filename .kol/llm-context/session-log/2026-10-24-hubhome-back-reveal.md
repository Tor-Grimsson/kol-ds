# Session: HubHomeBackReveal — Home's cards turn whole

**Date:** 2026-10-24
**Agent:** Claude (Grim)
**Summary:** kol-monitor's HubHomeBackReveal ticket built, published as kol-shell 0.82.0, closed with its receipt.

## Changes Made

### Files Modified
- `packages/shell/src/HubHome.jsx` — page-level `backReveal`; a file's own `backReveal` wins, mapped onto the card
- `apps/rack-hub/src/App.jsx` · `src/pages/shipped.jsx` — the twin passes `flip-card` on Home and Library
- `packages/shell/package.json` · `CHANGELOG.md` — 0.82.0; `docs/operations/01-release/02-shipped-packages.md` bumped
- `docs/documentation/03-components/06-content-card-system.md` — HubHome's `backReveal`
- `lobby/` — HubHomeBackReveal to `done/`, ledger row and history line; receipt in kol-monitor's `lobby/outbox/HubHomeBackReveal.md`
- `_tmp/2026-10-24-home-back-reveal/walk.mjs` — the walk

### Features Added/Removed
- `HubHome backReveal`: Home's cards honour the treatment instead of always `flip-image`

## Current State

### Working
- Walk 5/5: every card `flip-card` on rack-hub's Home and Library, `F` turns all whole, no page errors; props and syntax gates clean
- kol-shell 0.82.0 live on the registry

### Known Issues
- None new

## Next Steps
1. Push is his on this repo
2. kol-monitor's remainder: bump kol-shell 0.82.0, pass `backReveal: 'flip-card'` on `home`
