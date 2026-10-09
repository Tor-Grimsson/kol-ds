# kol-icons `identity` gains `r2b2` — the media app's new mark

**Staged:** 2026-10-09 · from a kol-website session
**Change:** one icon into `kol-icon-set-interface/identity/`

---

## The case

The media app (media.kolkrabbi.io, home-screen name R2B2) dropped the octopus for its own mark today,
chosen by the user from a review canvas: **R 2 / B 2 as a 2×2, Right Grotesk Wide Dark, plain**
(no FXR cut). It is live as the touch icon (middle 60%, per your new `02-icons/05-app-icons.md`) and
as the favicon. Like FXR in `identity-fxr-and-app-icon-size`, it is a KOL app mark with nowhere shared
to live.

## The ask

**`identity/r2b2.svg`** from `~/dev/projects/kol-website/apps/media/public/favicon/favicon.svg` — the
mark is the paths there (outlined from `PPRightGrotesk-WideDark.otf` with opentype.js; the block fills
a 24 box at 23.4 tall, centred). Fit it to the set's keyline the way `kol-ds.svg` and `fxr.svg` sit,
`currentColor`, the favicon's light/dark `<style>` dropped. Regenerate the inventory.

Reference renders: `apps/media/public/touch-icons/apple-touch-icon-{dark,light}.svg` (the app-icon
size, already conformed to the 60% rule).

## Done when

`r2b2` renders in the identity group beside `kol-ds` and `fxr` at the same optical size. Nothing comes
back to kol-website.

---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-icons@0.37.0`.** `identity/r2b2.svg` — the favicon's two paths wrapped in
`translate(3 3) scale(0.75)` like `kol-ds` and `fxr`, `currentColor`, the `<style>` dropped. Rendered
beside `kol-ds` and `fxr`: same box. Cut `solid` (`extract:icons` clean), icon-ink clean. Inventory
243 · 27.

For kol-website: nothing.
