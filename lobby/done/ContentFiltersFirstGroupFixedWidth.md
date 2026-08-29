# ContentFiltersFirstGroupFixedWidth — the first filter group is ONE CATALOG COLUMN wide, not a hug

**Staged:** 2026-08-27 · from **kol-monitor** (user ruling on Home's TYPE column, checked against kol-website `/work` in the inspector)
**Change:** kol-component `ContentFilters` — the first group's column is a SET width, one catalog column; the docs line in `06-content-card-system.md` § the filter-group law and the JSDoc say so

## The problem, in one case

`ContentFiltersFirstGroupHugs` (0.104.3) made the first group `shrink-0` — it
hugs its chips. So the column is as wide as its longest chip happens to be:
78px on monitor's Home (`ENVELOPE`), 92px on kol-website `/work`
(`COLLECTION`), something else on `/prints` and fxr's Library — and the flowing
groups after it start at a different x on every surface, and never over a card
column. The user's ruling, 2026-08-27, with monitor's TYPE column and `/work`'s
side by side:

> "nope not hug, fix a size and announce it in a bulletin" · "if its any
> number of columns, maybe just use one? if columns how wide is one?"

## The fix — the width is ONE CATALOG COLUMN

On `CatalogPage` the grid is `repeat(6, 1fr)` gap 24, so one column is
`(grid width − 5 × 24px) / 6` — a fraction of the content width (≈ 285px at
1880), never a px. The first group sits exactly over the first card; the
flowing groups start exactly over the second.

- The clean form: the filter-group row shares the catalog's grid —
  `grid-cols-6 gap-6`, first group in column 1, the remaining groups flowing
  across `col-span-5` — with the count + LIST/GRID strip placed so it does not
  narrow the row. Today the row is `flex justify-between` with the strip as a
  right sibling, so the groups container is narrower than the grid by the strip
  + `gap-16`; a consumer measuring `100%` inside it comes out short by that.
- Where a page has no 6-column catalog (kol-website `/work` is a list), the
  same fraction on the row's own width — `calc((100% − 120px) / 6)` — so the
  number is one everywhere.
- Every group after the first: unchanged, flowing. `group.className` stays the
  per-group override for the odd page. The by-position rule and the reverted
  misreads (0.101, 0.104.1) stand as written.
- Docs: `docs/documentation/03-components/06-content-card-system.md` § the
  filter-group law — "hugs its chips — it is narrow" → "one catalog column
  wide"; the component JSDoc (`THE FIRST GROUP HUGS ITS CHIPS`) and the
  `renderFilterGroup` comment likewise.
- 160px (`LabelRow`'s label column) was the first candidate this session;
  superseded by the user's "just use one [column]" before filing.
- Announced 2026-08-27 in the LLM_RULES bulletin from kol-monitor, so every
  consumer's agent reads it at init.

## Rejected alternative

A fixed px (160) — lines up with nothing below it. A token (`--kol-filter-col`)
— a second knob for a value the grid already defines.

## Definition of done

- kol-component published; the first group measures one catalog column on
  monitor Home, fxr Library, `/prints` with no consumer `className`; `/work` at
  the same fraction.
- Doc + JSDoc say one catalog column, not hug.
- Remainder for kol-monitor: bump; drop `className: 'w-40'` (the 160 interim —
  a consumer cannot reach the grid width from inside the filter row) from the
  first group of every `filterGroups` (Home · Library ×2 · Create).

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.111.0 · kol-theme 0.73.0

The first filter group wears `.kol-filters-first` — `calc((100cqw − 120px) / 6)`, the `1fr` of `repeat(6, 1fr)` gap 24 — measured on the header row (`.kol-filters-row`, `container-type: inline-size`) so the count/strip beside the groups never narrows it; it sits over the first card and the flowing groups start over the second. A page without a 6-column catalog gets the same fraction of its own row. Components layer — `group.className` still wins on width; `stack: false` on the first still makes it flow. Doc paragraph + JSDoc say one catalog column, not hug. 21 gates clean; verified in source only (no server run, by your rule).

**Remainder here:** none — kol-monitor: bump kol-component 0.111.0 · kol-theme 0.73.0; drop `className: 'w-40'` from the first group of every `filterGroups` (Home · Library ×2 · Create).
