---
component: Slider · RotaryDial
source: kol-mirror/src/components/atoms/Slider.jsx (the whole local component) · kol-mirror/src/styles/components.css#L36-L181 (its skin) · consumers at kol-mirror/src/components/hall-of-mirrors/RecorderUnit.jsx + SymphonyMixer.jsx
staged: 2026-08-30
status: draft
deps: [Slider, RotaryDial, Input]
---

# SliderDualThumbAndPlayhead

## The ask

Three seams on `molecules/Slider`, so kol-mirror can retire its local slider the
way it retired its local dropdown:

1. **`variant="dual"`** — two thumbs on one track (in/out marks) plus an
   optional draggable **playhead**.
2. **`readout`** — the value display is currently an editable `<Input>` and
   there is no way to get a plain one or none at all.
3. **`defaultValue` + alt-click reset**, on Slider *and* RotaryDial.

## Why it is not a nice-to-have

**This is the Dropdown situation, one component later.** kol-mirror carries
`atoms/Slider.jsx` next to the DS's `molecules/Slider.jsx` at **10 import
sites**, and only **2 of those files** need anything the DS lacks
(`SymphonyMixer.jsx`, `RecorderUnit.jsx`). The other 8 are running a private
copy of a component the DS already ships.

The duplication is not hypothetical drift — it is already verbatim. Mirror's
`.mirror-slider-minimal` and this repo's `.control-slider` are the same eight
declarations including the 24px height; `.mirror-slider-track` and
`.slider-black` are identical down to the `margin-top: -5px` on the thumb, with
**one** intentional difference: mirror wants the track at
`--kol-surface-on-primary` rather than `fg-64`, which `--kol-slider-track`
already exposes. Mirror's third rule, `.mirror-slider` (the bordered pill), is
this repo's `default` variant, retired here 2026-07-08 and still alive there.

So a consumer is maintaining a copy of DS CSS to get one feature the DS does not
have. Every one of those lines is a rule that will not move when kol-theme does.

## Contract

### 1 · `variant="dual"`

| | |
|---|---|
| props | `value` / `value2`, `onChange` / `onChange2`, `label1` / `label2` |
| clamping | the in-thumb never passes the out-thumb and vice versa — clamp in the component, not the consumer |
| labels | when `label1`/`label2` are given they replace the formatted values above the track ends; absent, the row is not rendered |
| thumbs | the two must be **visually distinct** — mirror draws in-mark hollow (surface fill + 1.5px `surface-on-primary` border) and out-mark solid, so you can tell which end you grabbed |
| stacking | both inputs overlay one track with `pointer-events: none` on the input and `auto` on the thumbs — the only way two native ranges share a track |

### 2 · The playhead

| | |
|---|---|
| props | `playhead` (number in `min…max`, `null` = none) · `onPlayheadChange(next)` |
| drag | pointer-down on the marker seeks continuously until pointer-up |
| click | clicking anywhere on the track seeks — the marker is not the only target |
| colour | **a token, not a hex.** Mirror hardcodes `#2dd4bf`; that is the defect this move should end, not carry |
| absent | no marker, no track cursor, no listeners |

### 3 · `readout` and the reset

`Slider`'s docstring calls itself *"the LINEAR VARIANT of RotaryDial … both
implement the shared value-control contract"*. Two places where they do not:

| | |
|---|---|
| `readout` | `'input'` (today's editable `<Input variant="filled">`, the default — nothing moves) · `'value'` (a plain right-aligned `kol-helper-12` span, which is RotaryDial's own display-only readout) · `'none'` |
| why | mirror runs ~23 sliders in a 24px-row mixer inside a ~300px shelf. A filled input chip at every one is a different control, and it is the reason the 8 easy call sites still cannot move |
| `defaultValue` | alt-click the control resets to `defaultValue ?? min`. **On both Slider and RotaryDial** — mirror has it on its local copies of each, and a reset that works on the knob but not the fader is the contract splitting again |

## Recreation notes

- Prior art, working for months: `kol-mirror/src/components/atoms/Slider.jsx` —
  the dual branch is ~45 lines, the playhead drag ~18. The clamping is the
  `Math.min(n, v2)` / `Math.max(n, v1)` pair on the two `onChange`s.
- The dual track is a `position: relative` box with an absolutely positioned
  2px rule, the playhead, then the two range inputs at `inset: 0`.
- The playhead's `left` is `calc(6px + (100% - 12px) * ratio)` — half a thumb
  in from each end, so the marker lines up with where a thumb centre can
  actually reach.
- Mirror's skin is at `src/styles/components.css#L36-L181`; the parts worth
  taking are the two thumb treatments, not the track rules, which are already
  this repo's.

## What this closes on the consumer side

`kol-mirror/src/components/atoms/Slider.jsx` and every `.mirror-slider*` /
`.mirror-range-*` rule retire to `_tmp/`, and 10 call sites move to the DS
component. One of the retiring rules reads `--kol-bg-surface-primary`, a token
this repo has never defined — the in-thumb has been living on a hardcoded
`#0e0e11` fallback and stays black in light mode. It is not worth fixing in a
file that is leaving.

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-component 0.133.0** + **kol-theme 0.97.0**. All three seams.

**1 · `variant="dual"`** — `value`/`value2`, `onChange`/`onChange2`,
`label1`/`label2`. Clamping is the component's (`Math.min(n, v2)` /
`Math.max(n, v1)`), so no caller re-fixes it. Two native ranges over one rail;
`.kol-slider-range` takes `pointer-events: none` and its thumbs take it back.
Thumbs are visually distinct as specced — `--in` hollow (surface fill, 1.5px ink
ring), `--out` solid.

**2 · The playhead** — `playhead` / `onPlayheadChange`. Drag seeks continuously
to pointer-up; **the whole rail seeks on pointer-down**, not just the 3px
marker. `null` renders nothing and attaches no listeners. Its colour is
`--kol-slider-playhead`, defaulting to `--kol-accent-primary`: the hardcoded
`#2dd4bf` is exactly the defect this move ends, so it was not carried.

**3 · `readout` + reset** — `'input'` (default, unchanged) · `'value'` (plain
right-aligned `kol-helper-12` span, RotaryDial's own) · `'none'`.
`defaultValue` + alt-click reset landed on **Slider AND RotaryDial** — on the
dial it is handled at pointer-down before the drag starts, so an alt-click never
also nudges.

### One thing in the prior art that was not carried

`kol-mirror/src/components/atoms/Slider.jsx` calls `useMemo` **after** its early
`return` for the dual branch, so hook order changes with `variant`. It survives
only because no call site switches variant at runtime. Every hook here runs
before the branch.

### Verified

Six sliders on `/components/slider` — both readout modes, `none`, the dual pair,
and the dual-with-playhead. Rendered, zero console errors, 23 gates clean.
⚠️ Pointer verification (drag, alt-click) is source-correct but not
screen-tested; the DOM was not driven.

**Remainder here:** none.
