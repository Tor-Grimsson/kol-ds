# SliderCoarsePointerHeight — the fader is a 24px target with the wrong touch-action

**Staged:** 2026-09-01 · from **kol-mirror**
**Nature:** two one-line rules in `kol-theme`. Measured in a browser at 390 × 844.
**Version seen:** kol-theme **0.121.0**, kol-component 0.152.0

## What

`.slider-black` (kol-theme `kol-components-atoms.css:681`) on a coarse pointer:

| | measured | platform floor |
|---|---|---|
| Input box height | **24px** | 44px |
| `touch-action` | **`auto`** | `pan-y` for a horizontal rail |

Both matter, and the second is the one that makes a fader **not work at all**
rather than merely be small: inside a scrolling container — kol-mirror's mobile
studio sheet, kol-monitor's `StageParams` — `touch-action: auto` lets the
scroller claim any drag a few degrees off horizontal, so the thumb does not move
and the sheet scrolls instead.

## You have already made this exact jump once

The rule carries its own reasoning:

> `/* 24px, not 2px (the touch floor, user ruling 2026-08-26 — see ToggleSwitch
> above). The INPUT is the hit target and it was exactly the track's 2px; the
> drawing is unchanged: the 2px track centres inside the box by the UA's own
> align-self on the runnable track, and the thumb stays pinned to the track.
> **The row (.control-slider) is already 24px, so nothing moves.** */`

That last sentence is the whole ask. The row is 24px **on a desk**. On a phone
the row is 44 — kol-mirror's `VariantControls` passes `rowHeight={44}` and every
other control type in it obeys. The reasoning that took 2 → 24 takes 24 → 44 on
a coarse pointer, and by the rule's own argument **the drawing does not change**:
the track is a 2px pseudo-element the UA centres in the box, and the thumb stays
pinned to it.

## Asked shape

```css
.slider-black { touch-action: pan-y; }

@media (pointer: coarse) {
  .slider-black { height: 44px; }
}
```

`pan-y`, not `none`: the vertical gesture must still reach the scroller or the
sheet stops scrolling wherever a fader sits under the thumb.

Precedent for the gate: **kol-theme 0.117.0**, `OverlaySearchFieldZoomsIOS` —
"the coarse-pointer 16px floor covers the chrome-less field". Same shape, same
media query, different control.

## Why a consumer cannot do this

`Slider` forwards `style` to the `.control-slider` **wrapper**, not the input
(`size` is track LENGTH, not height), and `touch-action` **does not inherit** —
so the wrapper cannot pass it down. There is no prop that reaches the
`<input type="range">`.

## What kol-mirror is carrying meanwhile

Two rules in `src/styles/mirror-overrides.css`, a descendant selector into an
unstylable child, marked for deletion when this ships:

```css
.control-slider input.slider-black { touch-action: pan-y; }
@media (pointer: coarse) { .control-slider input.slider-black { height: 44px; } }
```

## Second consumer

kol-monitor's mobile plan (`.kol/llm-plan/10-mobile-version.md` §4) names
`StageParams` — "DS `Slider` rows fed by a headless CV module" — as **the**
instrument on a phone. It hits this the moment that plan's step 4 runs.

## Not asks

- `RotaryDial` on touch. It is a rotary drag and a genuinely different problem;
  not measured, not guessed at here.
- The dual-thumb rail. Its inputs take `pointer-events: none` and are a separate
  hit-testing story — say the word and we will measure it on the loop trimmer.

## ✅ RESOLUTION — 2026-09-01 · kol-theme@0.122.0

Both rules, plus the one your measurement implied: .slider-black gets touch-action: pan-y (on the input, where it has to be — you were right that no prop reaches it and it does not inherit), and under (pointer: coarse) the input lifts 24 → 44 by the 24px rule's own argument. The ROW lifts with it: .control-slider is a fixed 24px, so a 44px input inside it would overflow the row — mirror never saw that because VariantControls passes rowHeight=44 inline, but monitor's StageParams will not, and a fix that only works with a consumer override is the override wearing a DS badge. Your inline rowHeight still wins. Desk untouched. Not touched, as you said: RotaryDial and the dual-thumb rail — measure the loop trimmer and file it. Delete the two rules in mirror-overrides.css on the bump. Verified in the published tarball.

**Remainder here:** none — kol-mirror bump kol-theme@0.122.0; delete the two .control-slider input.slider-black rules in src/styles/mirror-overrides.css; re-measure the fader in the studio sheet at 390×844 — expect 44px box, thumb moves on a near-horizontal drag, sheet still scrolls vertically.

