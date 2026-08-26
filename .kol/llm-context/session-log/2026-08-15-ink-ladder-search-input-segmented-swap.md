# Session: the ink ladder, the search input, and the segmented swap

**Date:** 2026-08-15
**Agent:** Grim (Haiku 4.5)
**Summary:** Second half of the Content Set day — every card and row put on one
three-rung ink ladder with real hover and zoom states, `SearchInput` unified and
reproduced against the live site, and the segmented strip's two states swapped.

## Changes Made

### Files Modified

**component**
- `molecules/ContentText.jsx` — the ink ladder across all 12 ramps; recursive
  renderer gains a `trailing` flag so a trailing stack right-aligns; `['line']`
  kind removed (dead)
- `molecules/SearchInput.jsx` — one type system and both glyph ladders correctly
  split (SOLO trigger / ADJACENT in-field); `iconSize` and `fieldHeight` seams;
  bare at rest; glyph held until the collapse finishes; Escape + click-away
- `molecules/ContentRow.jsx` — thumbs stretch to the row height with the width
  pinned; `thumbZoom` per variant; article row gains a hover
- `molecules/ContentMedia.jsx` — `zoom`, and `frame` / `border` / `bg` / `ring`
  split into four distinct edge treatments
- `molecules/ContentCard.jsx` — `drawer` layout; rest colours moved to custom
  properties so hover can win
- `organisms/ContentFilters.jsx` — composes `SearchInput`; `layoutPlacement`;
  filter groups take `stack`; count joins the strip; 16-in-32 glyph pairing
- `atoms/Divider.jsx` — vertical variant centred and sized to what it separates
- `atoms/IconFrame.jsx` — unchanged, but its `iconSize` law is what
  `SearchInput` copied

**theme**
- `kol-typography.css` — display rungs 600 → 500 with 0.04em tracking
- `kol-theme.css` — house curve balanced; `--kol-gap-wall-{grid,list}`
- `kol-components-molecules.css` — `.kol-expand`, `.kol-media-zoom`,
  `.kol-card-drawer`, `.kol-row`, `.kol-card-plate`, the segmented swap
- `kol-components-atoms.css` — inline-control rest/hover; `.kol-icon-outline`

**content · shell · icons · dashboards**
- `WorkViewToggle` pinned to 36/16 · `PageHeader` rebuilt with a `size` scale
  and an eyebrow · `filter.svg` keyline-corrected · dashboards icons off the
  translucent tier

### Features Added/Removed
- The three-role ink ladder, applied to every ramp
- Hover on every interactive card and row; zoom on the image-led ones
- `iconSize` / `fieldHeight` — the seams that let the DS reproduce its own
  shipped surfaces

## Current State

### Working
- 6 rows and 18 cards verified in the browser: 0 without a state, 0 with more
  than one emphasis
- `/work` reproduced with an empty measured diff
- 20 gates clean, showcase build clean

### Known Issues
- ⚠️ **Nothing is retired.** All ten absorbed components still export.
- ⚠️ The `TRACKS` minimums are my derivation, not a ruling.
- ⚠️ `RAMP.print.row` / `BOX.print` are dead — print's row renders as catalog.
- ⚠️ The segmented swap reverses the 2026-08-12 "selected = dark tile" reading
  on every strip in the estate, not just this surface.

## Next Steps
1. The retirement wave — deprecation aliases, then consumer migration.
2. `GridCard` names two unrelated DS components across ~70 call sites.
3. Fold the `iconSize` / `fieldHeight` seams into `05-control-chrome.md` — the
  square and the glyph being separate decisions is a law now, not a local fix.
