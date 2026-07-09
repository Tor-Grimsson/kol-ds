# Session: Lobby wall + publish chain (brand/workshop/theme/foundry) + chess/dashboards vault docs

**Date:** 2026-07-09
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Wrote the chess + dashboards vault docs (doc-parity closed); untangled a three-round publish saga (brand `./svg` never shipped → workshop pin frozen → currentColor wordmark) ending with all 14 packages live and content-verified on npm; built the `/lobby` visual wall + static contact sheet; ran the lobby feasibility audit (69/82 already built) and started the user's visual triage ledger; fixed the `useTagMode` crash that broke the monorepo's reader.

## Changes Made

### Files Modified
- `docs/documentation/04-compositions/08-chess-system.md` + `09-dashboards-system.md` — NEW vault reference docs (component index, data-adapter/injection seams); `01-package-topology.md` `related` + main `INDEX.md` compositions row completed (03/05/06/07 were also missing).
- `packages/brand/package.json` — 0.1.0→0.1.2 across the saga; `src/svg/wordmark-workshop.svg` — 8× `fill="white"` → `currentColor`.
- `packages/workshop/package.json` — 0.1.1→0.1.2 (brand dep `workspace:*`→`workspace:^` so pin-freeze can't recur) →0.1.3; `src/tags/TagModeContext.jsx` — `useTagMode` no-provider crash → inert no-op default (root cause of the monorepo `/workshop` ErrorBoundary crash on published 0.1.2).
- `packages/workshop/src/shell/ShellSidebar.jsx` + `packages/theme/kol-components-workshop.css` — sidebar type flipped from freestyle px onto `kol-helper-*` (user-driven; later superseded by the full type-conform sweep that landed as workshop 0.1.4 + theme 0.7.2).
- `packages/theme/package.json` — 0.7.1→0.7.2 (the de-drift CSS was version-equal/content-different vs npm — third same-version trap of the day; theme+workshop are cascade-coupled and shipped as a pair).
- `showcase/src/pages/Lobby.jsx` (NEW) + route in `App.jsx` + TopBar `Lobby` link — the lobby visual wall: globs repo-root `lobby/*.md` (+`done/`), entries with a one-file demo render LIVE; spec-only entries listed flat. Iterated from shell+reader → stripped wall on user feedback ("just let me see the component").
- `_tmp/lobby-wall.html` + `lobby-wall.png` — static full-page contact sheet (1600×10295) captured off the dev server; the "memory callback" doc.
- `lobby/ButtonGroup.md` + INDEX row — new staged spec (monorepo `@kol/ui` molecule; dynamic-class align bug flagged).

### Features Added/Removed
- npm end-state: **all 14 packages local == npm, content-verified** (brand 0.1.2 currentColor tarball-checked; theme 0.7.2 de-drift marker checked in registry copy). npm auth token now in `~/.npmrc` — no more OTP publishes.
- Lobby feasibility audit: **69/82 queue entries already built** (INDEX stale since 07-03); 6 buildable (viewer-merge, ColorInputRow, Placeholder, Ramp, ButtonGroup, SplitToolButton), 4 reject, 1 park, 1 recipe, 1 infra (TailwindContentSource).

## Current State

### Working
- npm fully green; monorepo unblocked (workshop 0.1.4 has the TagMode fix + type-conform; theme 0.7.2 pairs with it).
- `/lobby` wall live (61 rendered tiles + spec-only list); `_tmp/lobby-wall.html` static sheet.
- Vault docs at parity: all 6 domain systems have dedicated docs (04–09).

### Known Issues
- **Triage ledger open (10 calls, nothing applied):** TextPressure + TypeSample → kol-foundry (real moves); ~9 mark-done file moves to `lobby/done/`; wayfinding taxonomy category (WorkViewToggle/filters/search/header/footer/drawer/DocsToc + AsciiCursor); RotaryDial⇄Slider API marriage; ProsePreview stays in component (recommended, unconfirmed).
- Lobby wall demos mount eagerly (~60) — first paint sluggish; lazy-mount on scroll if it bites.
- Working tree carries everything uncommitted (user manages git).

## Next Steps
1. Apply the triage ledger once the user finishes the visual pass (moves + done/ + taxonomy category).
2. Build order for the feasibility set: shared fullscreen viewer → ColorInputRow → Placeholder/Ramp/ButtonGroup → SplitToolButton.
3. TailwindContentSource packaging decision (compile utilities into pkg CSS vs `@source` contract) — own session, touches ARCHITECTURE §4.
