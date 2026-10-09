# kol-icons `identity` gains `fxr`, and the KOL app icon's mark size is written down (60%)

**Staged:** 2026-10-09 · from a kol-website session
**Change:** one icon into `kol-icon-set-interface/identity/` + one documented rule for touch/app icons

---

## The problem, in one case

On the user's home screen R2B2 (media.kolkrabbi.io) and FXR sit side by side. Same 180px PNG, same
`#121215` ground, but the octopus filled the **18×18 keyline square (75%)** — the touch-icon spec
kol-website carried — while FXR's lettering sits in the **middle 60%** (`translate(4.8 4.8)
scale(0.6)`, kol-fxr `public/touch-icons/apple-touch-icon-dark.svg`). Next to each other the octopus
read crowded. The user ruled 60%. kol-website's media icon is re-cut to it today (mark bbox 36–144
of 180, measured; deployed).

Two gaps that made the drift possible:

1. **No written app-icon size.** Each app picked its own; the next one will guess again.
2. **FXR's mark is not in the identity set.** `identity/` holds `kol-ds` · `kolkrabbi` · `metrics`;
   FXR is a KOL app with its own mark and has nowhere shared to live.

## The ask

1. **`identity/fxr.svg`** from `~/dev/projects/kol-fxr/public/favicon/favicon.svg` — the glitch-split
   Right Grotesk Tall lettering (two clip-paths, halves slid ±1). Fit it to the set's keyline the way
   `kol-ds.svg` sits (`translate(3 3) scale(0.75)`), `currentColor`, the favicon's light/dark
   `<style>` dropped — colour is the consumer's. Regenerate the inventory.
2. **The app-icon rule, in the docs** (wherever icons/identity are documented): *a KOL app icon is the
   identity mark in the middle 60% of a 24 grid (14.4 square at 4.8), on `#121215` dark / `#FAFAFA`
   light, exported 180×180 opaque RGB; the dark one is what `apple-touch-icon` links* (iOS darkens a
   light web-clip ground — kol-fxr plan 25 §1). If you'd rather ship a tiny generator or an
   `AppIcon` component than prose, that is better — your call.

## Not asked

No change to favicons (tab icons keep their own fit). No consumer changes — kol-website is done.

## Done when

`fxr` renders in the identity group beside `kol-ds`, at the same optical size; the 60% rule is in a
doc an agent will find by grepping "app icon" or "touch icon".

---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-icons@0.36.0`.** `identity/fxr.svg` — the favicon's glitch-split lettering (both clip-paths, halves slid ±1) wrapped
in `translate(3 3) scale(0.75)` like `kol-ds`, `currentColor`, the light/dark `<style>` dropped; clip
ids namespaced `kol-fxr-top` / `kol-fxr-bot`. Rendered beside `kol-ds`: same height. Cut `solid`
(`extract:icons` clean), icon-ink clean. Inventory regenerated (242 · 27; it also caught up with
0.35.0's `identity` rename).

The rule is `docs/documentation/02-icons/05-app-icons.md` (aliases *app icon* · *touch icon* ·
*apple-touch-icon*): mark in the middle 60 % (`translate(4.8 4.8) scale(0.6)`), `#121215` /
`#FAFAFA`, 180×180 opaque RGB, the dark one linked. Prose, not a generator — one rule, no second
consumer of a tool yet.

For kol-website: nothing.
