---
component: MenuDropdownItem (label span)
source: kol-fxr — editor menubar, Settings → "Show grid" (any label with descenders)
staged: 2026-08-12
status: draft
deps: [MenuItem]
---

# MenuItemDescenderClip — menu labels clip their descenders

## Purpose
Menu dropdown labels with descenders (g / y / p) render cut off at the bottom — "Show grid" loses the tail of its g. The label must show the full glyph.

## Current behaviour
- `MenuItem.jsx`'s `MenuDropdownItem` label span is `flex-1 truncate` — `truncate` means `overflow: hidden`.
- The row is typed `kol-helper-12`, which is **`line-height: 1`** by the mono type protocol (helper = single-line chrome).
- A 1-em line box has no room below the baseline, so the overflow clip cuts every mono descender. The row itself is `h-8 items-center` — there is vertical room to spare; only the span's line box is starved.

## Ask
Give the truncating span a line box tall enough for descenders — e.g. a line-height ≥ ~1.3 on the span (the h-8 centered row absorbs it, zero layout shift). Your call whether that's a span-level utility or a protocol note that `truncate` + `kol-helper-*` never combine.

## States & interactions
No behaviour change — truncation/ellipsis keeps working; only the vertical clip goes.

## Dependencies
None.

## Recreation notes
kol-fxr replicated the idiom in three of its own toolbar dropdowns and stopgapped them with `leading-normal` on the span (its own JSX). The DS's MenuDropdownItem is the one consumers can't touch (no-shims), so the menubar items stay clipped until the atom fixes it.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-component@0.35.0** (registry-verified).
`leading-normal` on the truncating span — and the same defect swept across the
packages: MenuDropdownItem, MenuDropdownNest, ColorInputRow (label + token),
FieldRow hint, RecordManager saveState. Six spans, five files; no
`truncate`+`kol-helper-*` combination remains. Adoption is kol-fxr's (its three
local `leading-normal` stopgaps can stay — same fix, its own JSX).
