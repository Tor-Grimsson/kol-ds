---
component: ContentFiltersEqualColumns
source: kol-fxr/src/pages/LibraryPage.jsx (filterGroups) · kol-component/src/organisms/ContentFilters.jsx renderFilterGroup
staged: 2026-08-27
status: draft
deps: [ContentFilters, Tag]
---

# ContentFiltersEqualColumns — the group columns are equal, never content-width

## Purpose

`renderFilterGroup` sizes a group by its chip count: ≤ 6 values → "stacked",
`shrink-0`, the column is as wide as its widest chip; more → `min-w-0 flex-1`.
With that default the FIRST group column comes out narrow while the rest
flow — the user has called it out on every ContentFilters surface today
("only the first column is narrow… it's not only library, it's content
filters everywhere"). Ruled: **group columns are equal width by default.**

## Variants

- Default → every group `min-w-0 flex-1` (what `stack: false` forces today),
  chips wrapping inside the column.
- `stack: true` stays the opt-in for a group that should hug its chips.

## Props

| prop | type | default | controls |
|------|------|---------|----------|
| `group.stack` | boolean | **`false`** (was: `values.length <= 6`) | content-width column, opt-in |

## Styling

Column: `flex min-w-0 flex-1 flex-col gap-3`; chips: `flex flex-wrap gap-2`
(the `pr-12` right room stays on the fluid form). Nothing else moves.

## Recreation notes

The 0.101 "short groups stack" default was a per-page ruling (WorkListing)
written into the organism. Flip the default, keep the seam. kol-fxr passes
`stack: false` on every group as the interim; delete on ship.

## Also — the category label is the eyebrow role (same ruling, 2026-08-27)

`renderFilterGroup`'s `<h4>` wears `labelClassName = 'kol-helper-12 text-fg-96'`
+ an inline `text-transform: uppercase`. Every section/category label in the
app tier is `kol-eyebrow` now (Settings shortcuts, the labs rail, the
randomiser's cards); the tag categories are the one holdout — "I say the same
shit about tags categories". Default `labelClassName` → `kol-eyebrow
text-fg-96` (the role carries the uppercase; drop the inline transform).
`CatalogPage` forwards nothing here, so consumers on it cannot reach the label
— the default is the fix.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.104.1

Group columns are equal width by default — every group min-w-0 flex-1, chips wrapping inside; stack: true is the opt-in to hug. The 0.101 short-group default was the WorkListing page's ruling written into the organism — reverted. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-fxr bump kol-component 0.104.1; drop stack: false from every group.

---

---
component: ContentFiltersEqualColumns
source: kol-fxr/src/pages/LibraryPage.jsx (filterGroups) · kol-component/src/organisms/ContentFilters.jsx renderFilterGroup
staged: 2026-08-27
status: draft
deps: [ContentFilters, Tag]
---

# ContentFiltersEqualColumns — WITHDRAWN as filed; one item stands

## ⚠️ The column ask is withdrawn (same day)

Filed as "group columns equal by default". **Wrong** — the kol-fxr agent
misread the user. The ruling is the shape /prints already renders: the FIRST
group hugs its chips (narrow) and every group after it flows across the rest
of the row. That IS the organism's current default (≤ 6 chips → `shrink-0`,
more → `flex-1`), so nothing changes there. kol-fxr pins it explicitly
(`stack: i === 0`) so chip counts never flip the shape. Do not touch the
column sizing.

## What stands — the category label is the eyebrow role

`renderFilterGroup`'s `<h4>` wears `labelClassName = 'kol-helper-12 text-fg-96'`
+ an inline `text-transform: uppercase`. Every section/category label in the
app tier is `kol-eyebrow` now (Settings shortcuts, the labs rail, the
randomiser's cards); the tag categories are the one holdout ("I say the same
shit about tags categories"). Default `labelClassName` → `kol-eyebrow
text-fg-96` (the role carries the uppercase; drop the inline transform).
`CatalogPage` forwards no `labelClassName`, so consumers on it cannot reach
the label — the default is the fix.

## ✅ Withdrawal answered — 2026-08-27 · kol-component@0.104.2

0.104.1's equal columns reverted to the ≤ 6 hug default (the /prints shape); the category label defaults to `kol-eyebrow text-fg-96`.
