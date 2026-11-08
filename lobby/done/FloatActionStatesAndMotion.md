---
component: FloatActionStatesAndMotion
source: kol-shell@0.107.0 FloatActionMenu (+ the float family: NavRailFloat, RailTrigger card, RailFlyout, CommandOverlay surface) — kol-website apps/record (FloatLayout bar.menu)
staged: 2026-11-04
status: draft
deps: [FloatActionMenu, Button variant="float" tone="inverted", float card, kol-animation.css, utilities/motion.js]
---

# FloatActionStatesAndMotion — one state ladder for the + button, and motion for the float family

## The user (2026-11-04, on record and fxr)
*"so default is dark - hover is grey - active is grey and modal is white? that makes no sense?"* · *"normal state - hover - just a slight drop in opacity"* (screenshots beside this file: `-normal.png` the solid white ×, `-hover-today.png` the grey disc it turns into on hover) · *"can we use gsap or some animation to move the + to X? and in general we need animation states. everything is very.. quick, not smooth"*

## 1. The states (the inverted round float button — FloatActionMenu's trigger)
| state | look |
|---|---|
| rest | the solid inverted circle (ink on its ground), float shadow |
| hover | the SAME circle, a slight opacity drop (≈ 0.88) — not the grey fill it gets today |
| pressed | a small scale-down (≈ 0.96), same fill |
| open | the ×, same fill and shadow as rest |
The card it opens wears the one float surface the rail card / RailTrigger card wear — one pair in both themes.

## 2. + → × as motion
The + rotates 45° into the × (one glyph, transformed), instead of the icon swapping; reversed on close.

## 3. Motion across the float family (the general thing)
Enter/leave and state changes ease instead of snapping, from KOL's own motion tokens (kol-animation.css · motion.js), honouring `prefers-reduced-motion`:
- the + card and RailTrigger's card: fade + small scale/translate from the button's side;
- NavRailFloat: expand ↔ collapse (width), hide ↔ show (slide/fade);
- RailFlyout open/close; CommandOverlay (float surface) open/close;
- hover/press transitions on every float button and row.
No GSAP dependency unless the tokens cannot express it — if one is needed, it is the DS's call, once, for every app.

## 4. Flexible, not fixed (the user: keep tickets flexible)
- Every number above is a token, not a literal: `--kol-float-hover-opacity`, `--kol-float-press-scale`, the motion durations and easings — an app or theme retunes them without a release.
- One prop on the float pieces and FloatLayout: `motion` — `true` (default, the tokens) · `false` (no motion) · `{ duration, ease }` to override per app; the + glyph's turn (`rotate` vs. swap) a prop on FloatActionMenu (`iconMotion`).
- The state ladder is a variant table (rest · hover · pressed · open), so a new float button reads its states from it instead of re-styling.

## Recreation notes
- record bumps; nothing to pass. No local motion meanwhile.

## Built

kol-theme 0.212.0 · kol-component 0.341.0 · kol-shell 0.108.0 (2026-11-04). The inverted float ladder: `Button variant="float" tone="inverted"` and FloatActionMenu's round + (`.kol-float-action`) keep their fill — hover `--kol-float-hover-opacity` 0.88, press `--kol-float-press-scale` 0.96, open the × on the same fill; the + carries `--kol-shadow-float` with `variant="float"`. The square inverted Button keeps its oq-inverse-40 · -48 rungs. FloatActionMenu `iconMotion` `'rotate'` (default, the + turns 45° into the × and back) · `'swap'`. Motion, CSS only, from `--kol-float-duration` 200ms · `-duration-rail` 300ms · `--kol-float-ease` (house) · `--kol-float-enter-scale` 0.96 · `-enter-shift` 4px: the + card, RailTrigger's card and RailFlyout fade in and out from the trigger's side (`PopoverPanel motion`); NavRail float eases its width on expand ↔ collapse and FloatLayout's hide ↔ show opens and closes it from 0; the float search modal fades and scales; float buttons and rows ease their hover. `motion` (`true` · `false` · `{ duration, ease }`) on FloatLayout, NavRail float, RailTrigger, RailFlyout, CommandOverlay, TopControlsBar, FloatActionMenu. Reduced motion turns it all off. Checked headless in light and dark (rest · hover · pressed · open measured), the turn and the rail width sampled per frame, reduced motion instant.

## ✅ RESOLUTION — 2026-11-04 · kol-shell@0.108.0

kol-theme 0.212.0 · kol-component 0.341.0 · kol-shell 0.108.0. FloatActionMenu's + and every inverted float button keep their fill: hover --kol-float-hover-opacity 0.88, press --kol-float-press-scale 0.96, open the × on the same fill with the float shadow. iconMotion 'rotate' (default) turns the + 45° into the × and back. CSS-only motion on --kol-float-duration · -duration-rail · -ease · -enter-scale · -enter-shift: the + card, RailTrigger's card, RailFlyout, the float search modal, NavRail float expand/collapse and hide/show, float button and row hover; off under reduced motion. motion prop (true · false · { duration, ease }) on FloatLayout and every float piece.

**Remainder here:** none — kol-website bump kol-shell ≥0.108.0, kol-component ≥0.341.0, kol-theme ≥0.212.0; nothing to pass.

