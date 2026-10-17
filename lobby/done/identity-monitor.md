# kol-icons `identity` gains `monitor` — the Monitor app's mark

**Staged:** 2026-10-17 · from a kol-monitor session
**Change:** one icon into `kol-icon-set-interface/identity/`

---

## The case

Monitor (monitor.kolkrabbi.io) has its own mark, picked by the user on a review page
(https://claude.ai/artifact/C8oBVAazNy89KKy2WuNo1r, row `mon-fxr-m1.25-gap1.5`): **M O N as FXR draws F X R. PP Right
Grotesk Tall Dark, three letters at full height, the M's column a quarter wider than O and N's, a 1.5 gap between
letters, the row cut at its middle and slid ±1 (dith-glitch).** It's live as the touch icon (middle 60 %, per
`02-icons/05-app-icons.md`) and as the favicon. Like `fxr`, `r2b2` and `mirror`, it's a KOL app mark with nowhere
shared to live.

## The ask

**`identity/monitor.svg`**, ready-made at
`~/dev/projects/kol-monitor/_tmp/2026-10-17-app-icon-proposals/identity-monitor.svg`: the favicon's paths (outlined
from `PPRightGrotesk-TallDark.otf` with opentype.js, in a 24 box) wrapped in `translate(3 3) scale(0.75)`, in
`currentColor`. It carries two `clipPath`s for the cut (`te0-t`, `te0-b`). Rename them to the set's
`kol-monitor-` form as you did for mirror. Regenerate the inventory.

Sources: `kol-monitor/public/svg/favicon.svg` (the mark) · `public/touch-icons/apple-touch-icon-dark.svg` (the app-icon size).

## Done when

`monitor` renders in the identity group beside `kol-ds`, `fxr`, `r2b2` and `mirror` at the same optical size.
Nothing comes back to kol-monitor but the receipt.

## ✅ RESOLUTION — 2026-10-17 · kol-icons@0.39.0

`identity/monitor.svg` is monitor's `_tmp/` file verbatim, minus its comment line (the set carries none), with the clip ids namespaced `kol-monitor-t` / `-b` as mirror's were. Cuts regenerated (solid); inventory 245 icons, identity 7. Rendered beside `kol-ds` · `fxr` · `r2b2` · `mirror` at 96 and 24: glyph bounds 23.72 × 23.40 against fxr's 24.55 × 23.37 — the same optical size.

**Remainder here:** none — kol-monitor none — the receipt only.

