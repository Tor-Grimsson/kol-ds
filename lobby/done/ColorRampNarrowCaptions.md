---
component: ColorRampNarrowCaptions
source: kol-branding/src/pages/Foundations.jsx (Ramp) — ColorRamp with 10–12 static colours
staged: 2026-10-22
status: draft
deps: [ColorRamp, ColorSwatch]
---

# ColorRampNarrowCaptions

## Purpose
`ColorRamp` lays chips out as `repeat(min(n,10), minmax(0,1fr))`. At 390 a 10-step ramp gives ~30px columns, and the captions (`kol-helper-10`, name + value like `highlight-cider`, `#001141`) are not truncated, so they run past the column and widen the page (22px horizontal scroll measured on kol-branding's Foundations · Colour combinations at 390).

## Anatomy
Unchanged — the caption block under each chip.

## Variants
None.

## Props
None new. Optionally a `minChip` (px) floor that makes the row scroll inside itself instead of shrinking.

## Styling
- Caption spans: add `truncate` + `max-w-full` (or `min-w-0` on the chip column) so a caption never exceeds its track.
- Or: below `sm`, fewer columns per row (wrap the ramp to 5 per row) — breakpoint rule 6, first collapse at `sm`.

## States & interactions
None.

## Dependencies
ColorRamp, ColorSwatch.

## Recreation notes
Consumer workaround today: wrap in `overflow-x-auto` with a 560px min width. Remove once ColorRamp owns narrow widths.

## Resolution — 2026-10-22 · kol-component 0.289.0

- `ColorRamp`: grid columns from `--ramp-cols` (sm up, max 10) and `--ramp-cols-narrow` (min(n,5), below sm); chip column `min-w-0`, both caption spans `max-w-full truncate`.
- Verified at 390: a 10-step static ramp lays out 5 a row, page overflow 0; at 1280 it is 10 across. Specimen added to the showcase preview.
