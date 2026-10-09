---
component: SegmentedToggle (sunken tone)
source: kol-theme/kol-components-molecules.css — § THE SEGMENTED STRIP, SUNKEN
staged: 2026-10-09
status: draft
deps: [SegmentedToggle]
---

# SegmentedSunkenNoBorder — the sunken strip keeps an invisible 1px border

## Purpose
kol-fxr's labs rail (Generate · Style · Animation, the Morph mode strip) wears `SegmentedToggle` in the sunken tone. User, 2026-10-09: *"there shouldnt be a border in that tone. only divider between the buttons"*, after asking why the strip reads shorter than a `Button size="sm"` beside it.

## Anatomy
```
.kol-seg (height pinned: --kol-ctl-sm = 26, box-sizing: border-box, border 1px)
└─ .kol-seg-cell × n   (+ .kol-seg-cell { border-left } = the divider)
```

## Variants
Sunken tone only (`.kol-seg.kol-tone-sunken`, `.kol-seg.kol-tone-inverse`, `.kol-tone-sunken .kol-seg`, not `--filled`). Default, filled and tonal are untouched.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| — | — | — | a CSS rule; no prop |

## Styling
Today: `border-color: transparent`. The border stays 1px wide, so inside the pinned 26px box the cells are 24px tall and inset 1px on every side; the selected well (`--kol-surface-sunken`) reads 2px short of a Button sm, and its edge sits off the strip's edge.
Ask: `border-width: 0` (or `border: none`) in the same selector. The height pin keeps the outer box at 26; the cells take the full 26. Dividers (`.kol-seg-cell + .kol-seg-cell { border-left: 1px solid var(--kol-oq-08) }`) stay.

## States & interactions
Unchanged. Type is already the Button ladder's (`kol-mono-12` at sm) — not part of this ask.

## Dependencies
`SegmentedToggle` (kol-component), kol-theme.

## Recreation notes
A kol-theme patch. kol-fxr passes nothing — the bump is the whole adoption. Check the other consumers of the sunken strip (kol-client-olina's inspector) render the same 26.

---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-theme@0.171.0`.** The sunken/inverse strip rule
(`kol-components-molecules.css` § THE SEGMENTED STRIP, SUNKEN) sets `border-width: 0` where it
set `border-color: transparent`. The height pin is untouched, so the outer box keeps its ladder
height and the cells take all of it; `.kol-seg-cell + .kol-seg-cell`'s 1px divider stays.
Filled is still excluded; default and tonal are untouched.

Measured in a real render: sunken strip border 0px, cells the full pinned height, second cell's
divider 1px. CSS only — olina's inspector strip inherits the same rule; no prop changed.

For fxr: bump kol-theme to ^0.171.0; look at the labs rail strip beside a Button sm.
