# Session: Component taxonomy audit + consolidation (Phases 1–5) + index toggle perf

**Date:** 2026-07-04
**Agent:** Claude Opus 4.8 (1M)
**Summary:** Audited the component categorization (two axes, atomic-vs-Brad-Frost, over-fragmentation), then executed all five plan phases — a definitions doc, an `Atomic⇄Function` grouping toggle, sub-part de-fragmentation, dead-code + variant-merge cleanup, and enforcement/sync — and fixed a 150ms toggle-lag on the `/components` index.

## Changes Made

### Docs (`docs/documentation/02-components/`)
- **`00-taxonomy.md` (NEW, `canonical`)** — the missing definitions doc: the two axes (Tier = build/import structure; Function = closed Material set), the deliberate "not Brad Frost atomic" divergence, the sidebar-grouping model + toggle, the one-page-per-component rule.
- **`02-placement.md`** — shrunk to the placement *runbook* (checklist + worked calls + enforcement); definitions deferred to `00-taxonomy`.
- **`01-inventory.md`** — regenerated to real counts (**42 atoms / 29 molecules / 28 organisms / 10 framework**, was 29/17/3/9).
- **`04-taxonomy-audit-and-plan.md` (NEW → `superseded`)** — the audit + phased plan + execution log; superseded_by `00-taxonomy`.
- `INDEX.md` + reciprocal `related:` links wired.

### Showcase (presentation, non-breaking)
- `lib/component-groups.js` (NEW) — hand-authored sub-part overlay (Menu → Item/Divider/Nest; Accordion → Panel). Never touches `usage-index.json`.
- `lib/grouping.jsx` (NEW) — persisted `Atomic⇄Function` context (default Function).
- `lib/registry.js` — `componentsByFunction` + `groupComponents`; `TOP_LEVEL` excludes members; `DEPRECATED` filter (MenuPopover, QuantityStepper).
- `lib/DocLayout.jsx` — sidebar `Group by` SegmentedToggle.
- `pages/Components.jsx` — grouped by active axis; **lazy-mount demos** behind an `IntersectionObserver` (the perf fix).
- `pages/ComponentPage.jsx` — **Parts** section for member sub-parts. `main.jsx` — GroupingProvider.

### Packages (2 changesets added → 9 held total)
- `MenuPopover.jsx` — deleted dead shadow `MenuItem`/`MenuDivider` (never barrel-exported). Changeset `menu-popover-dead-code` (patch).
- **QuantityStepper merged into QuantityInput** via `controls="split"`; export + files deleted, call-sites migrated. Changeset `quantity-merge` (minor). Phase-4 kept SegmentedToggle/ViewToggle/WorkViewToggle, SearchInput, and Card/Row twins (genuinely distinct — reasons in the plan doc).

### Enforcement
- `scripts/validate-groups.mjs` (NEW) + `pnpm validate:groups` — overlay-integrity lint. Composition manifests regenerated (`usage-index.json` checksum verified unchanged).

## Current State

### Working
- `pnpm build` green · `validate:taxonomy` + `validate:groups` clean · Playwright **0 console errors**.
- Grouping toggle regroups sidebar + index, persists; Menu/Accordion parts render on the parent page.
- Index toggle profiled: **150ms → 0ms** main-thread block (lazy-mount).
- Roster **119 → 113** browsable components.

### Known Issues
- **9 changesets held, unpublished** (7 lobby-batch + these 2). Nothing published.
- Off-repo: also updated the global `CLAUDE.md` "Report shape" rule + `docs/16-claude-agents/{05,06}` in **`~/.dotfiles`** (separate repo) — not a change here.

## Next Steps
1. **Issue #2 — responsive bugs on the showcase pages + site design/UI tasks** (the item parked until the taxonomy work finished). Needs the user to point at specific pages/widths.
2. Publish when wanted: the batched 9 changesets (merge the Version Packages PR).
