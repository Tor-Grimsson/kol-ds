---
component: AssetGrid
source: kol-monorepo/apps/brand/src/components/styleguide/AssetGrid.jsx#L1-L7
date: 2026-07-03
status: draft
deps: []
---

# AssetGrid

## Purpose
A thin responsive N-column grid wrapper. Lays its children out in a fixed 2/3/4-column CSS grid that collapses to 2 cols under 768px and 1 col under 480px. Used to tile asset figures on the styleguide pages. Structurally almost nothing — it maps a `cols` prop to a `kol-asset-grid-{n}col` class and stacks base grid utilities. Overlaps heavily with the DS `Grid`; see Recreation notes for the merge recommendation.

## Anatomy
```
<div class="kol-asset-grid kol-asset-grid-{cols}col grid gap-4 mt-8 [className]">
  {children}
</div>
```
Single `<div>`. `kol-asset-grid` carries no CSS of its own (base `display:grid gap mt` come from Tailwind utilities inline); the `kol-asset-grid-{n}col` class supplies `grid-template-columns` and the responsive collapse.

## Variants
- **cols=2 / 3 / 4** — selects `kol-asset-grid-2col` / `-3col` / `-4col` → `repeat(2|3|4, 1fr)`. Any other value produces a dead class (only 2/3/4 have CSS).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| cols | 2 \| 3 \| 4 | `3` | column count → `kol-asset-grid-{cols}col` |
| children | node | — | grid items |
| className | string | `''` | extra classes appended |

## Styling
- Tailwind utilities (inline, keep): `grid gap-4 mt-8`.
- **`kol-asset-grid-*` CSS to CAPTURE** (from `apps/brand/src/components/framework/kol-framework.css`):
  - `.kol-asset-grid-2col { grid-template-columns: repeat(2, 1fr); }`
  - `.kol-asset-grid-3col { grid-template-columns: repeat(3, 1fr); }`
  - `.kol-asset-grid-4col { grid-template-columns: repeat(4, 1fr); }`
  - `@media (max-width: 768px) { .kol-asset-grid-3col, .kol-asset-grid-4col { grid-template-columns: repeat(2, 1fr); } }`
  - `@media (max-width: 480px) { .kol-asset-grid-2col, .kol-asset-grid-3col, .kol-asset-grid-4col { grid-template-columns: 1fr; } }`
- No inline styles, tokens, transitions, or pseudo-elements. `gap-4`/`mt-8` are hard-coded utility values, not tokens.
- **App-specific bits to DROP:** the `mt-8` top margin is a call-site layout concern (spacing before the grid), not intrinsic to a grid primitive — drop it or make it a prop. `kol-asset-grid` bare class is unused CSS — drop it. No token or data coupling otherwise.

## States & interactions
None. Static layout wrapper — no hover/focus/selected/disabled, no responsive JS (breakpoints are pure CSS media queries).

## Dependencies
None. No DS components, no imports.

## Recreation notes
- Tier: **layout primitive** — but **do not ship as a standalone component.**
- **Merge into DS `Grid`:** this is a `cols` variant of the existing `Grid`, not a new atom. Add a `cols` prop (2/3/4, or open integer) to `Grid` that sets `grid-template-columns: repeat(cols, 1fr)` with the same responsive collapse (→2 under 768px, →1 under 480px), and retire `AssetGrid` at the call sites. Avoid re-introducing a parallel `.kol-asset-grid-*` class family alongside the DS grid.
- If `Grid` already exposes column control, this is purely a call-site swap — no new code, just migrate `cols` + drop the `mt-8`.
- Values that become props/tokens: column count (prop, already is), gap (`gap-4` → DS grid gap token/prop), the responsive breakpoints (bake into the `Grid` variant, keep 768/480). Drop the `mt-8` external margin.
- No text content — no casing concerns.
