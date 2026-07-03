---
title: Workbench stories backfill — full component coverage
type: log
status: archived
updated: 2026-06-26
description: Backfilled Ladle stories for every remaining KOL component — 50 components / 125 stories, all verified rendering clean.
tags:
  - domain/design-system
  - domain/workflow
  - pattern/component-workbench
repo: kol-design-system
related:
  - "[[workbench/01-using-the-workbench|using the workbench]]"
  - "[[migration/2026-06-26-workbench-adoption|workbench adoption plan]]"
---

# Session: Workbench stories backfill — full component coverage

**Date:** 2026-06-26
**Agent:** Grim (Opus 4.8)
**Summary:** Backfilled stories for every remaining component — was 3 (Button/Icon/Table), now **50 components / 125 stories**. Fanned the work across 7 grounded subagents, then verified all 125 render clean via a full build + a runtime sweep.

## Changes Made
- **47 new `workbench/src/*.stories.jsx`** — atoms, molecules, overlays, primitives, and framework chrome. Every prop grounded in real source + `docs/usage/*`, imported by package name. Router-dependent stories wrapped in `<MemoryRouter>`.
- **`workbench/package.json`** — added `react-router-dom` (app-shell + overlay components need it).
- **`.ladle/config.mjs`** — default theme set to **dark** (matches KOL's `data-theme="dark"`).
- Docs: `01-using-the-workbench.md` (real UI layout, dark-default + Dark Reader notes), `AGENT-CONTEXT.md` (coverage), adoption plan marked `superseded`.

## Current State
### Working — verified
- **Build:** 50 story files, 2539 modules, 0 errors.
- **Runtime sweep:** all **125 stories, 0 failing** — no pageerrors, console errors, or error-boundaries. `pnpm workbench` → `localhost:61000`, opens dark.

### Grounding wins (subagents rejected stale usage-doc props rather than guess)
- **Tag** — dropped nonexistent `color` prop (only `tag--active`/`tag--solid` classes exist).
- **Graphic** — real API is `category`+`name`; real SVG names (`patt-01..16`, `abstract-0x`), not the doc's `pattern-05`.
- **ToggleBracket / Avatar / ColorSwatch** — current source signatures; ignored cross-app props absent here.
- **MenuPopover** — barrel exports only `MenuPopover` (no companion item exports); story authored to the real surface and notes the limit.

## Next Steps
- Optional: per-component props/API tables; or graduate to Storybook for a11y + visual regression (only if a real need shows up).
- The stale `docs/usage/*` props flagged above could be re-mined (`scripts/extract-usage.mjs`) to match current source.
