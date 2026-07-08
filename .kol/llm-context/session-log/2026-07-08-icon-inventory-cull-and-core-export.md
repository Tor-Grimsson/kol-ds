# Session: Icon inventory — stroke normalize, Tier-1 cull, elected core export

**Date:** 2026-07-08
**Agent:** Grim (Opus 4.8 1M; earlier arc Fable 5)
**Summary:** Continued from the 2026-07-07 showcase-fix session into the icon inventory: flipped icon pages to BG-light default, normalized all strokes to 1.5, triaged 2,104 SVGs (0 corrupt — all dupes/quality), executed a Tier-1 mechanical cull, then pivoted (on user direction) from dedup to **electing a usage-driven core of 144** and exported it for Figma.

## Changes Made

### Packages (kol-loader — held changesets)
- `packages/loader/src/stroke/**` — **525 `stroke-width` attributes rewritten to 1.5** across 293 SVGs (was 2 / 1.12497 / 1.125 / 0.99997). Geometry untouched. Kept exceptions: cap-* diagram glyphs (`6`), `hash-italic-bold` (`2.5`). Changeset `icon-stroke-normalize.md`.
- `packages/loader/src/svg/**` + a few `stroke`/`solid` — **369 files deleted** (Tier-1 cull): 361 legacy `svg/` files shadowed by stroke/solid names (unreachable per `Icon.jsx` resolution order) + 8 byte-identical same-name dupes. Inventory 2,104 → 1,735. Changeset `icon-tier1-cull.md`. Restored `stroke/user/social-github.svg` (Tier-1 had deleted a stroke slot that was a byte-copy of its solid mirror — the pair-awareness fix).

### Showcase
- `showcase/src/pages/Icons.jsx` + `IconsVariants.jsx` — icon plate now = the icon canvas exactly (`cell = size`, was `size+16`) so the keyline guides reach the container edge; **BG default flipped dark→light** (`useState(true)`) to match the app's light-mode default.

### New export (NOT in packages — a working deliverable)
- `icon-core-export/{stroke,solid}/<category>/` — the elected 144-icon core copied out for Figma. Files **path-encoded**: `{tree}-{category}-{name}.svg` (e.g. `solid-actions-check.svg`) so Figma groups them correctly. 151 stroke / 148 solid files (7 core names live in >1 category as distinct drawings — all kept, uniquely named). This is a hand-off folder, not a package source.

### Docs / ledgers (.kol/llm-context/backlog)
- `2026-07-07-icon-qa.md` — stroke/geometry QA; steps 1-2 marked executed (1.5 chosen).
- `2026-07-08-icon-cull-ledger.md` — dupe/shadow triage; Tier-1 marked executed.

## Current State

### Working
- Icons page: 880 stroke tiles render, 0 console errors, guides aligned, opens BG-light. Verified live on :5199.
- Elected core = **144** (usage-swept across 8 consumer apps + this repo; read-only, miner untouched). Buckets: 68 cross-app + 76 single-app = core; **rack (109) = kol-video's private set** (95 solo-used) to extract separately; **614 unused** = archive candidates (NOT yet archived — user said hold).
- `icon-core-export/` sitting in repo root, ready for Figma.

### Known Issues
- 4 core names have no solid cut: `bell`, `refresh-cw`, `sum`, `view-list`. Plus 66 "placeholder solids" (solid = byte-copy of stroke) across the inventory — unfinished mirrors, Tier-3 design work.
- Icon-cull ledger's Tier-2 (dupes under different names) and Tier-3 (35 outline-expanded redraws, ~30 refits, ~10 registration fixes) are **not done** — deferred; user is taking the core into Figma to work manually.
- `icon-core-export/` is at repo root — either gitignore it or move under a `_tmp`/exports path; it's a working artifact, not package source.
- Everything uncommitted; 2 new held changesets (stroke-normalize, tier1-cull) join the existing pile.

## Next Steps
1. User works the 144-core in Figma (stroke + solid, categorized, path-named).
2. On return: decide rack (extract to kol-video vs keep namespaced), then archive the 614 unused to `_archive/` (out of globs) — the "elect core" plan's step 3, still pending user OK.
3. Tier-2/Tier-3 icon cleanup (dedupe under different names, redraws) only where it intersects the final core.
4. Housekeeping: gitignore or relocate `icon-core-export/`.
