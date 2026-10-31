---
component: OriginPicker — a 3×3 transform-origin / anchor value picker
source: kol-fxr — src/editor/compose/inspectors/LayerInspector.jsx `AnchorPicker` (hand-built: nine 6 px radio dots on bg-surface-secondary)
staged: 2026-10-31
status: draft
deps: [SegmentedToggle?, AlignmentGrid (not a fit — it fires align actions, it holds no value)]
---

# OriginPicker

## Purpose
The user, 2026-10-31 (kol-fxr plan 49 9.2): *"this kind of stuff would be ironed out if we washed it through KOL DS. WE have to audit how many local control components there are here vs. DS. then we have a shortlist to ship."*

fxr's audit of its local controls: every one now wraps a KOL part except this one. The layer inspector picks a transform origin (which of nine points a layer scales and rotates about) with a hand-built 3×3 grid of radio dots. KOL's `AlignmentGrid` is the nearest part, but it fires align actions and holds no value.

## Asked
- **A value control:** `value: [x, y]` with x, y ∈ {0, 0.5, 1}, plus `onChange([x, y])`. It is a radiogroup of nine, and arrow keys move the selection.
- **On the control ramp:** it sits beside a field at the same `size` (xs · sm · md), on the KOL inks, with the selected point in the accent colour.
- **Accessible names** per point ("left top" … "right bottom").

## Recreation notes
- fxr's call site: `LayerInspector.jsx` Position section, beside the X / Y fields. fxr swaps to the KOL part once it ships and retires `AnchorPicker` to `_tmp/`.
- Acceptance (fxr's): 9 points, one selected; clicking a point or using the arrow keys changes the value; at `size="sm"` its height matches a sm field (±1 px).

## ✅ RESOLUTION — 2026-10-31 · kol-component@0.329.0

kol-component 0.329.0: OriginPicker, a new atom. value [x, y] (each 0, 0.5 or 1), onChange([x, y]), size xs · sm · md, tone, ariaLabel. A radiogroup of nine radios with roving tabindex: arrows move x / y and focus together (no wrap), one tab stop; each point named (left top … right bottom). Heights match the field at every size (xs 22 · sm 26 · md 32, light and dark); dots oq-24 at rest, oq-48 on hover, the selected dot in the accent; no border. Figma: component set OriginPicker (283:1047) on 03-atoms, size × value × state, bound to tone/bg, radius, oq and accent; Code Connect uploaded.

**Remainder here:** none — kol-fxr bump kol-component@0.329.0; LayerInspector's AnchorPicker → OriginPicker, retire AnchorPicker to _tmp/.

