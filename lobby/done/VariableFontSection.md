---
component: VariableFontSection
source: kol-monorepo/apps/web/src/routes/foundry/components/VariableFontSection.jsx#L1-L91
date: 2026-07-03
status: draft
deps: [FoundrySection, VariableFontDisplay, GlyphAnimator]
---

# VariableFontSection

## Purpose
The **animated variable-weight axis playground**: a specimen block that auto-oscillates a variable font's `wght` axis via `requestAnimationFrame` (bouncing between `minWeight` and `maxWeight`), pauses the moment the user scrubs the weight slider, and renders through the DS `VariableFontDisplay` molecule. A `FoundrySection` header sits above it with a Roman/Italic dropdown. This is the "watch the weight breathe, then grab the slider" demo.

## Anatomy
- `<section className="w-full py-12 lg:py-16">`
  - `<div className="max-w-[1400px] mx-auto flex flex-col gap-8">`
    - `FoundrySection` — `icon="foundation" size="sm"`, `badgeText`, controlled Roman/Italic dropdown (`selectedStyle`/`setSelectedStyle`, gated by `showDropdown`)
    - `VariableFontDisplay` — `text`, `weight`, `onWeightChange={handleSliderChange}`, `minWeight`, `maxWeight`, `isAnimating`, `onToggleAnimation`, `fontStyle` (`selectedStyle==='italic' ? 'italic' : 'normal'`), `fontFamily`

## Variants
No named variants. Forks: `showDropdown` gates the style dropdown and seeds `selectedStyle` (`showDropdown ? 'italic' : 'roman'`); `isAnimating` toggles the rAF loop vs a static slider-driven weight.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| fontFamily | string | `'TGMalromur'` | `font-family` on the `VariableFontDisplay` specimen |
| badgeText | string | `'Málrómur Aa'` | `FoundrySection` title |
| text | string | `'Variable'` | the big specimen word |
| minWeight | number | `300` | lower bound of the oscillation + slider min |
| maxWeight | number | `900` | upper bound of the oscillation + slider max |
| showDropdown | bool | `true` | show the Roman/Italic dropdown; seed initial `selectedStyle` |

## Styling
- No own visual styling beyond the section/container (`w-full py-12 lg:py-16` → `max-w-[1400px] mx-auto flex flex-col gap-8`); the specimen chrome (giant text, pills, sliders, play/pause) is all inside `VariableFontDisplay`.
- **The rAF animation params** (the reusable core — effect keyed on `[isAnimating, minWeight, maxWeight]`):
  - `direction = 1`, `currentWeight = weight` (captured at effect start), `lastTime = Date.now()`.
  - loop `animate()`: `delta = Date.now() − lastTime`; **only step when `delta > 16`** (~60fps throttle).
  - step: `currentWeight += direction * 2` (2 units/frame); clamp + **ping-pong**: at `>= maxWeight` set to `maxWeight`, `direction = -1`; at `<= minWeight` set to `minWeight`, `direction = 1`.
  - `setWeight(currentWeight)`, `lastTime = now`, then `animationRef.current = requestAnimationFrame(animate)`.
  - cleanup: `cancelAnimationFrame(animationRef.current)`.
- **Slider scrub pauses**: `handleSliderChange(value)` → `setIsAnimating(false)` then `setWeight(value)`. There is no resume-on-release; playback only restarts via the play/pause toggle.
- **`wght` mapping**: note `VariableFontDisplay` applies the weight through **`fontWeight: weight`** (CSS weight → the font's `wght` axis), *not* `font-variation-settings` — width, when present there, uses `fontVariationSettings: 'wdth' N`. This section only drives weight.
- **Play/pause**: `onToggleAnimation={() => setIsAnimating(!isAnimating)}` → the `PlayPauseButton` inside `VariableFontDisplay`.
- **App-specific bits to DROP:**
  - **`badgeText='Málrómur Aa'` + `text='Variable'` + `icon="foundation"`** — app copy/defaults; make neutral in the DS.
  - **Crude `Date.now()`/`delta > 16` throttle** — replace with the `performance.now()` interval-accumulator pattern from `GlyphAnimator.js` (see notes); the current one drops the sub-interval remainder and can jitter.
  - **No reduced-motion guard** — the loop runs unconditionally. The DS version must honor `prefers-reduced-motion` (start paused / no auto-animate).
  - **Weight-only** — `minWidth`/`maxWidth`/`width` exist on `VariableFontDisplay` but this section never wires them; a general DS "axis playground" should parameterize the animated axis (wght/wdth/…) rather than hardcode `wght`.

## States & interactions
- **Auto-animate play/pause**: `isAnimating` state; the rAF loop mounts/tears down with it. Toggle via the display's play/pause button.
- **Axis scrub**: dragging the weight slider fires `handleSliderChange` → **pauses** (`setIsAnimating(false)`) and sets the exact weight. Scrub always wins over animation.
- **Roman/italic switch**: `selectedStyle` (`setSelectedStyle`) from the header dropdown → mapped to `VariableFontDisplay`'s `fontStyle` (`italic`/`normal`).
- **Glyph select / metrics overlay**: none — this is a running-text weight demo, not a glyph inspector.
- State held: `weight` (init `400`), `isAnimating` (init `true` — **auto-plays on mount**), `selectedStyle`, `animationRef`.

## Dependencies
`VariableFontDisplay` from `@kol/ui` (the DS foundry molecule — composes `Slider`, `Pill`, `PlayPauseButton`). `FoundrySection` (app header → DS `SpecimenSectionHeader`). No font-parsing dep: weight is applied as a CSS value, nothing here reads the parsed font.

## Recreation notes
- Tier: **organism** (stateful animation controller composing the `VariableFontDisplay` molecule + header).
- Font-parsing dep: **none** — pure CSS `wght` animation; no `FontLoader`/opentype.js. (Contrast `GlyphMetricsGrid`, which needs the parsed font for its overlay.)
- **Reconciliation vs `packages/fontviewer` — neither util fits, but both inform:**
  - `GlyphAnimator.js` animates a **glyph *sequence*** (cycles characters over `font.glyphs`), not an axis — wrong target. **But** its rAF loop is the pattern to steal: `performance.now()` timing, an `interval` accumulator (`this.lastFrameTime = currentTime − (elapsed % interval)`), `requestAnimationFrame(this.animate.bind(this))`, clean `start()`/`stop()`. Retarget it from `currentIndex`-over-glyphs to **value-over-range with ping-pong direction**, replacing this section's cruder `Date.now()/delta>16` throttle.
  - `VariationAxes.js` emits variation settings from **input events** (sliders → `"${tag}" ${val}` string) but has **no animation loop** at all.
  - Net: the auto-oscillator here is **novel** — no package util does axis auto-animation. Promotion target: a small reusable hook `useAxisAnimation({ axis:'wght', min, max, step, running })` (or a `AxisAnimator` class mirroring `GlyphAnimator`'s shape) that owns the ping-pong + rAF, honors `prefers-reduced-motion`, and feeds `VariableFontDisplay`. That hook is the actual high-value extraction from this component.
  - Standardize the axis output so it composes with `VariationAxes`/`FontControlsPanel`: emit `{ wght: n }` (object) and let the render boundary decide `fontWeight` vs `font-variation-settings`.
- Text casing at call site: `badgeText`, `text`, and dropdown labels render verbatim — no `text-transform`.
