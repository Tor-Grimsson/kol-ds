# Session: the homepage review — ten fixes under /kol-goal

**Date:** 2026-08-09
**Agent:** Grim (Fable 5)
**Summary:** A 10-frame homepage review executed end-to-end under the goal loop — the radius scale collapsed to the 4px law at the token, Badge synced onto StatusChip's `--ui-*` ladder, menu floats made content-sized, size ramps pulled out of previews, and every homepage tile header made a link. All LOCAL on HMR — component + theme carry an unpublished delta awaiting sign-off.

## Changes Made

### Packages (UNPUBLISHED — component + theme differ from npm)
- **kol-theme.css** — `--kol-radius-md/lg/xl/2xl` all collapse to **4px** (law comment in place; vars stay resolvable so no consumer var() breaks). Every hard-coded 5/6/8/10/16px container radius in theme swept to `var(--kol-radius-sm)`: `.kol-popover`, `.kol-tooltip`, workshop cards, chess panels, foundry. 16px mini-chips at 3px and `--kol-radius-xs` (2px) untouched — not containers.
- **kol-components-molecules.css** — Badge tones rebuilt on the `--ui-*` ladder with StatusChip's exact formula (`color: var(--ui-X)`; 15% mix on surface-primary); canonical class `.kol-badge-error`, with `-destructive`/`-critical` as alias selectors on the same rule.
- **Badge.jsx** — `error` is the canonical tone variant; `destructive`/`critical` map to it as legacy aliases.
- **ShapeDropdown / MenuItem / SplitToolButton** — menu panels get `w-max` (floats size to CONTENT, the floating-ui contract) — the shape-picker menu had rendered detached from both its rows and its trigger. Dropdown untouched (fused-width law); ColorInputRow's palette grid has its own width; StatusChip panel signed off previously.

### Showcase
- Radius sweep: all `rounded-[var(--kol-radius-md|lg)]` call sites → `rounded`; TiltCard demo `rounded-lg` → `rounded`.
- **inspector-panel** — SegmentedToggle → `size="sm"` beside the sm steppers (DO-NOT-MIX-SIZES ruling).
- **Demos to single instance + toolbar size picker**: SegmentedToggle (`sizes` export), Stepper (rides the same control ladder as Button — sm 4/12·mono-12 · md 6/16·mono-14 · lg 8/20·mono-16), ColorSwatch (one color, three STATES — rest/selected/no-color; sizes 24/32), Badge demo `destructive`→`error`.
- **color-tools block** — recomposed: three labeled ColorInputRows (Fill/Stroke/Effects) lead; shape scope in the footer; TabsRow out.
- **filter-bar** — sort Dropdown → primary (variant prop dropped); results grid 4×2 → **2×2** (4 items).
- **Home.jsx** — every tile header is a Link: blocks → `/blocks/:key`, demos + analytics dashboard cards → `/components/:slug` (via `slugify`); Tile takes `to`.

## Current State

### Working
- All 19 gates clean. Goal file closed (10/10 ticked). Everything rides HMR locally.

### Known Issues
- **UNPUBLISHED delta on component + theme** — publish + bump only on the user's sign-off (mid-review law).
- The giant-menu defect was fixed structurally (`w-max`), not reproduced — browser verification is the user's (no Playwright, standing reprimand).

## Next Steps
1. User eyeballs the homepage; on sign-off, bump + publish component/theme in one wave.
2. Standing (not this repo's): tier re-sort review (user's), fxr adoption 📌, dotfiles/humpty 🔵 receipts.
