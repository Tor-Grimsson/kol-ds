---
title: Showcase rebuilt as a shadcn-style docs site + loader icon inventory
type: log
status: archived
updated: 2026-07-01
description: Rebuilt the showcase into a shadcn-style docs site — data-driven component pages, one-file demos, live token reference, ported icon inventory — and fixed the loader's drifted icon registry.
tags:
  - domain/design-system
  - domain/workflow
  - pattern/component-docs
repo: kol-design-system
related:
  - "[[session-log/2026-07-01-first-npm-publish|first npm publish]]"
  - "[[workbench/01-using-the-workbench|using the workbench]]"
---

# Session: Showcase rebuilt as a shadcn-style docs site + loader icon inventory

**Date:** 2026-07-01
**Agent:** Grim (Opus 4.8)
**Summary:** Rebuilt `showcase/` from a drifting hand-built gallery into a shadcn-style docs site with a single data-driven component-page pipeline, plus fixed the loader's stale hardcoded icon registry. Long, iterative session — the throughline was a process correction: **port the real implementation / read the actual source / verify against the reference, never reinvent.**

## The architecture (one path, no duplicates)

- **`lib/DocLayout.jsx`** — the shadcn chrome: full-bleed top bar (nav / search / GitHub / theme) + component sidebar + centred content + on-this-page TOC. Every component page wears it.
- **`pages/ComponentPage.jsx`** — the **generic** component doc, route `/components/:slug`. Renders any component from registry + `DEMOS` + `DOC_DATA`. No per-component page files.
- **`demos/*.jsx`** (45 files) — **one-file demos, shadcn model**: each is a real component file, rendered for Preview AND shown as its own `?raw` source for Code. Preview + code can't drift.
- **`lib/demos-registry.js`** — globs `demos/*.jsx` twice (module + `?raw`) → `{ Component, source }`. The auto-index (replaces the old render + hand-typed `code` `demos.jsx`).
- **`lib/component-docs.js`** — `DOC_DATA`: per-component `usage` / `examples` / `api`, props read from real source. 43 entries.
- Pages: **Home** (shadcn hero + live bento wall), **Foundations** (live token reference — colour/opacity/surfaces/ramps/type/radius/shadow, read via `getComputedStyle`, built on `.kol-grid`/`.kol-swatch`), **Icons** + **IconsVariants** (ported from the brand app: `SegGroup` control bar + `ContentFilters`, glob-driven).

## Loader package change (needs publish)

- `@kolkrabbi/kol-loader`: added `ICON_ENTRIES` + `ICON_INDEX` globbed from the on-disk stroke set (862 icons / 21 folders); `ICONS` is now an alias of `ICON_INDEX` — the hand-maintained **341-name registry that had drifted is removed**. Changeset staged (`.changeset/loader-icon-inventory.md`, minor).

## Also
- **2 real bugs fixed** via source-reads: `ColorSwatch` uses `hex` not `color`; `Tag` `solid` is a boolean not `variant="solid"`.
- **Cleanup:** deleted `demos.jsx`, `ComponentPreview.jsx`, `BadgeDoc.jsx`, `OneFileDemos.jsx`, `ComponentDoc.jsx` + dead routes (`/badge-doc`, `/c/:slug`, `/demos`). Migrated Home/registry/Components grid onto `demos-registry`.
- **Process rule written to memory** (`port-dont-reinvent-showcase-pages`): read the ACTUAL source file, copy verbatim adapting only data, verify against the live reference before "done".

## Current state
- 43 components fully documented (preview + install + usage + API); ~12 (framework chrome, `GRAPHICS`/`GRAPHIC_RAW` data exports, portal `FullscreenOverlay`/`ExitPreview`) render header+install+usage, no preview by design.
- All pages serve, 0 compile errors. Demos authored by 4 parallel subagents from real source, then merged.
- Root cause of recurring drift diagnosed as structural: showcase reimplemented pages instead of thinly rendering the packages (matches the June Path-B / src-first note). Fix applied at the app level (one page/one chrome/one demo system); the deeper src-first restructure remains an open option.

## Next steps
- **Publish loader:** commit + push + merge the Version PR → CI publishes `kol-loader@0.2.0` (+ patch-bumps `component`/`framework`). Showcase is `private`, never publishes.
- **Only remaining drift vector = `DOC_DATA` API tables** (hand-authored). Durable fix: generate from source with `react-docgen`.
- Optional: authored demos for the ~12 preview-less components; `/components` index could adopt `DocLayout` chrome for full consistency.
