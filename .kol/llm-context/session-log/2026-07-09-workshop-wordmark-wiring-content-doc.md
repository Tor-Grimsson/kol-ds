# Session: Workshop wordmark wiring + kol-content vault doc + workshop bump

**Date:** 2026-07-09
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Wired the kol-brand `<Asset>` loader into the kol-workshop package shell so the navbar renders the Kolkrabbi + Workshop wordmarks (render-verified); wrote kol-content's dedicated vault doc (CMS data layer confirmed per-repo, not packaged); bumped `kol-workshop` 0.1.0→0.1.1 so the wiring can publish.

## Changes Made

### Files Modified / Created
- **`packages/workshop/src/shell/ShellLayout.jsx`** — imports `Asset` from `@kolkrabbi/kol-brand/svg`; the brand block now renders `<Asset name="kol-wordmark">` `/` `<Asset name="wordmark-workshop">` (a `brandLogoSrc` prop still overrides). Sized via `[&>svg]:h-5`/`h-4`.
- **`packages/workshop/package.json`** — added `@kolkrabbi/kol-brand` dep; **version 0.1.0 → 0.1.1** (0.1.0 is already on npm, so the wiring wouldn't publish otherwise).
- **`docs/documentation/04-compositions/07-content-system.md`** — NEW: kol-content component index + the "CMS is per-repo" data boundary (doc-parity with foundry/store).

### Features Added/Removed
- Workshop navbar brand block now uses the brand asset loader (both wordmarks), replacing the `brandLogoSrc`-or-text fallback default.

## Current State

### Working
- `/workshop-docs` (the **package** shell) renders both wordmarks via `<Asset>` — DOM-verified: 2 SVGs, Kolkrabbi 68×20 / Workshop 64×16, labeled, 0 page errors.
- `kol-content` ship-ready + doc-complete; CMS `./data` layer deliberately **not** built (per-repo — each consumer owns its Sanity client/queries).
- pnpm workspace finalized — 17 projects, all new packages registered (`content`/`foundry`/`store`/`chess`/`dashboards`/`brand` @ `0.1.0`, `private:false`). Git committed + pushed (`main` up to date with origin).

### Known Issues
- **`kol-workshop@0.1.1` bump is uncommitted** — needs a push for the wordmark wiring to reach npm; `0.1.0` on npm still lacks it.
- **`/workshop-preview`** still uses the old showcase-local `src/workshop/shell/` copy (untouched) — no wordmarks there; the wiring is only in the package shell.
- kol-brand publishes as `0.1.0` (already shipped with the svg loader by the user).

## Next Steps
1. Commit + push the `kol-workshop@0.1.1` bump so the wordmark wiring publishes.
2. Dedicated vault docs for `chess` + `dashboards` (content now has one — closes the doc-parity gap).
3. Retire `/workshop-preview` (old local shell) in favor of `/workshop-docs` (the package).
