# Session: shadcn-style showcase presentation + shadcn⇄KOL comparison

**Date:** 2026-06-15
**Agent:** Grim (Opus 4.8)
**Summary:** Rebuilt the showcase Components surface into a shadcn-style docs presentation (per-component pages, Preview/Code tabs, grouped sidebar), and authored a full shadcn vs KOL gap analysis.

## Changes Made

### Files Modified
- `showcase/src/lib/demos.jsx` — reshaped `DEMOS` from render-fns to `{ render, code }` per component (canonical snippet co-located with live demo so they can't drift); added 7 demos harvested from `kol-monorepo/apps/brand` (Textarea, TransparentX, ToggleBracket, ViewToggle, PropertyInput, LabeledControl, ThemeToggle). ThemeToggle imported as a **named** export from `@kolkrabbi/kol-framework` (no `./ThemeToggle` subpath in the exports map).
- `showcase/src/pages/Components.jsx` — rewritten from a flat mined-usage card grid into a linked overview grid grouped by category; cards link to per-component pages.
- `showcase/src/sidebars.config.js` — `NAV_TREE` now generates `/components` children as category groups (each component a route leaf) from the registry; gave every top-level entry a unique `id` (SideNav's `isActivePage` compares `id`).
- `showcase/src/App.jsx` — added `/components/:slug` route → `ComponentDoc`.

### Files Added
- `showcase/src/lib/ComponentPreview.jsx` — shadcn primitive: bordered Preview/Code tab card + copy-to-clipboard.
- `showcase/src/lib/registry.js` — single source of truth joining `usage-index.json` + `DEMOS` + authored descriptions; exports `COMPONENTS`, `getComponentBySlug`, `componentsByCategory`, `slugify`, `CATEGORY_*`.
- `showcase/src/pages/ComponentDoc.jsx` — per-component page: breadcrumb · live preview · install/import · mined real-world usage · prev/next pager.
- `docs/benchmark/INDEX.md` — `type: audit` shadcn⇄KOL comparison + prioritized gap/opportunity analysis (framework-conformant).

### Features Added/Removed
- Showcase now presents like shadcn/ui: grouped component sidebar, per-component routes, Preview/Code + copy, prev/next paging — while keeping KOL's distinctive mined-usage reference.
- Source monorepo (`kol-monorepo/apps/brand`) was read-only; demos were copied out and rewritten to `@kolkrabbi/*` specifiers. Nothing in the monorepo changed.

## Current State

### Working
- All showcase imports verified against real package exports (component + framework + loader). One bug caught and fixed (ThemeToggle subpath → named import).
- Registry drives nav, index, and pages in lockstep (55 components; 25 with live previews).
- Comparison doc conforms to `docs/_framework` (audit archetype, `domain/` tags, single-doc folder).

### Known Issues
- **Not built / not browser-verified this session** (per working rules — user validates live via `pnpm --filter showcase dev`). HMR-ready but no smoke test run.
- Per-component **props/API tables** not yet generated (shadcn has them; data is extractable from package source — see comparison Finding 6 / Rec 4).
- Components without a `DEMOS` entry (overlays, menus, Table, etc.) show no live preview — page falls back to mined usage. Intentional, but expandable.

## Next Steps
1. Smoke-test the showcase in-browser; spot-check a per-component page (e.g. `/components/button`) + the grouped sidebar.
2. Act on the comparison's top recommendations if desired: (a) a11y baseline + shared behavior hooks, (b) add `cn()`/tailwind-merge + `asChild`.
3. Generate per-component props/API tables for the doc pages from package source.
