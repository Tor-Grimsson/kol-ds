# kol-icons `identity` gains `mirror` — the Mirror app's mark

**Staged:** 2026-10-15 · from a kol-mirror session
**Change:** one icon into `kol-icon-set-interface/identity/`

---

## The case

Mirror (mirror.kolkrabbi.io, formerly Hall of Mirrors) has its own mark, chosen by the user from a
review page (https://claude.ai/artifact/Rb9UYXvfDmzV9Q115HtosQ, row `glitch-0`): **M R over its own
reflection, Right Grotesk Wide Dark, R2B2's two rows with no gap, the reflected row cut at its middle
and slid ±1 — FXR's dith-glitch cut.** Live as the touch icon (middle 60 %, per
`02-icons/05-app-icons.md`) and as the favicon. A KOL app mark with nowhere shared to live, like `fxr`
and `r2b2`.

## The ask

**`identity/mirror.svg`** — ready-made at
`~/dev/projects/kol-mirror/_tmp/2026-10-14-app-icon-proposals/identity-mirror.svg`: the favicon's
paths (outlined from `PPRightGrotesk-WideDark.otf` with opentype.js, in a 24 box) wrapped in
`translate(3 3) scale(0.75)` like `kol-ds`, `fxr`, `r2b2`, `currentColor`. It carries two
`clipPath`s (`mirror-t`, `mirror-b`) for the cut — rename them if the set needs ids namespaced its
own way. Regenerate the inventory.

Sources: `kol-mirror/public/svg/favicon.svg` (the mark) · `public/touch-icons/apple-touch-icon-dark.svg`
(the app-icon size).

## Done when

`mirror` renders in the identity group beside `kol-ds`, `fxr`, `r2b2` at the same optical size.
Nothing comes back to kol-mirror but the receipt.

---

## ✅ Resolution — 2026-10-15

🟢 `closed` — **`@kolkrabbi/kol-icons@0.38.0`**. `identity/mirror.svg` is the `_tmp/` file verbatim except the two clip ids, renamed `mirror-t` → `kol-mirror-t` and `mirror-b` → `kol-mirror-b` (fxr's are `kol-fxr-top` / `-bot`). Rendered beside `kol-ds` · `fxr` · `r2b2` at 96px: same optical size. Cuts regenerated (classified `solid`), inventory 243 → 244.
