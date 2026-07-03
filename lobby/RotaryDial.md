---
component: RotaryDial
source: kol-monorepo/apps/web/src/components/workshop/molecules/RotaryDial.jsx#L1-L154
date: 2026-07-03
status: draft
deps: []
---

# RotaryDial

## Purpose
A drag-to-set rotary knob molecule. Vertical mouse drag maps to a 0–100 value; the whole SVG dial rotates over a 270° sweep (−135° to +135°). Controlled input with a local visual-state buffer for smooth rotation, and RAF-throttled parent updates. Used in the workshop as a synth-style parameter control.

## Anatomy
```
div.flex.flex-col.items-center.gap-2          ← column wrapper
├── div (dial, ref, size×size, rotate(angle))  ← rotating knob, mousedown target
│   └── svg (size×size, overflow visible)
│       ├── circle  outer dashed ring (stroke, dasharray "4 4")
│       ├── circle  inner solid fill disc
│       └── line    pointer, vertical, from center to top of inner disc
├── div  label      (only if `label`)          ← "A" / "B" …
└── div  value %    (only if `label`)          ← "42%"
```

## Variants
None (single form). Conditional rendering only: the `label` text row and the `value%` row both render **only when `label` is truthy**. A dial with no label renders the knob alone.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| label | string | — | text under the dial; also gates whether label + value% rows show |
| value | number | 0 | controlled value 0–100; drives rotation & the `%` readout |
| onChange | function | — | called with rounded 0–100 on drag (RAF-throttled) and on release |
| size | number | 80 | dial px size; derives outerRadius, innerRadius, viewBox |

## Styling
- Wrapper: `flex flex-col items-center gap-2`.
- Dial div: `relative cursor-pointer select-none`; inline `width/height = size`, `transform: rotate(${angle}deg)`, `willChange: isDragging ? 'transform' : 'auto'`.
- SVG: inline `overflow: visible`.
- Outer ring circle: `fill="none"`, `stroke="currentColor"`, `strokeWidth={2}`, `strokeDasharray="4 4"`, class **`text-fg-24`** (currentColor source).
- Inner disc circle: `fill="currentColor"`, class **`text-fg-96`**.
- Pointer line: `stroke="var(--kol-surface-primary)"` (so it reads as a notch cut into the disc), `strokeWidth={2}`, `strokeLinecap="round"`.
- Label div: **`kol-mono-xs text-fg-64 uppercase`** — note the `uppercase` here is a source utility; per KOL no-auto-transform rule, DROP `uppercase` and author the label string already-cased at the call site.
- Value div: **`kol-mono-xs text-fg-96`**, renders `` `${value}%` ``.
- Geometry math: `outerRadius = size/2`, `innerRadius = (size*0.7)/2`, `strokeWidth = 2`; outer ring `r = outerRadius - strokeWidth`; pointer `y2 = outerRadius - innerRadius + 4`.
- KOL tokens: `text-fg-24`, `text-fg-96`, `text-fg-64`, `kol-mono-xs`, `var(--kol-surface-primary)`.
- **App-specific bits to DROP:** none functionally — no fetch/router/context. Only the `uppercase` label utility should be dropped in favor of call-site casing.

## States & interactions
- **Idle:** dial shows `value` mapped to angle; `willChange: auto`.
- **Dragging (`isDragging`):** set on `mousedown` (captures `startY` + `startValue`). `window` `mousemove`/`mouseup` listeners attached only while dragging. Movement is **absolute from drag start**, not incremental: `totalDeltaY = startY - clientY`, `valueDelta = totalDeltaY * 0.5` (2px ≈ 1 unit), clamped 0–100, `Math.round`. `localValue` updates immediately for smooth rotation; `onChange` is RAF-throttled (one queued call at a time). `willChange: transform` during drag.
- **Release (`mouseup`):** clears dragging, cancels any pending RAF, fires a final `onChange(Math.round(localValue))`.
- `localValue` re-syncs to the `value` prop via effect whenever **not** dragging (so external updates land, but a drag isn't clobbered).
- No hover/focus/disabled/keyboard states in source. Cursor is `cursor-pointer`; text is `select-none`.

## Dependencies
- No DS components composed (pure React + SVG). Related DS atoms for cross-linking: Slider / Stepper / QuantityStepper occupy the same "numeric input" family but are not used here.

## Recreation notes
- Tier: **molecule**.
- Becomes props: `value`, `onChange`, `label`, `size` (already the full surface). Consider exposing `min`/`max`/`sensitivity` (currently hardcoded 0/100 and `0.5`) and the sweep range (currently −135°→+135°, 270°) as props if the DS wants a general knob; otherwise keep the synth defaults.
- Tokens map straight over: `text-fg-24` (ring), `text-fg-96` (disc + value), `text-fg-64` (label), pointer uses `var(--kol-surface-primary)`. No hex, no swaps needed.
- Keep the local-value-vs-prop dual state and RAF throttle — they are the reason rotation stays smooth while parent updates stay cheap.
- **Drop `uppercase`** from the label class; author label casing at the call site (no auto text-transform).
- Keyboard/a11y is absent in source — a DS-grade knob should add arrow-key increment + `role="slider"` / `aria-valuenow`, but flag as an addition, not a port.
- Consider migrating window listeners to Pointer Events for touch support (source is mouse-only).
