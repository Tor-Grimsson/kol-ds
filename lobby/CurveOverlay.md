---
component: CurveOverlay
source: kol-monorepo/apps/brand/src/editor/modes/type/CurveOverlay.jsx#L1-L115
date: 2026-07-03
status: draft
deps: []
---

# CurveOverlay

## Purpose
An SVG overlay that draws an easing/morph curve as a dashed line over a frame, and — in `custom` mode — a two-handle cubic-bezier editor (Figma/After-Effects style) with tangent lines back to the endpoints. It's a reusable **easing/curve-editor primitive**: store-free, purely prop-driven, and non-interactive by itself (the parent owns dragging; the handles just expose `data-role` hooks). Today it visualizes a text-morph blend curve, but the shape is a generic curve editor.

## Anatomy
```
<svg aria-hidden width height viewBox="0 0 W H" class="absolute"
     style={left:0, top:0, zIndex:3, overflow:'visible', pointerEvents:'none'}>

  IF curve === 'custom':
    <path d={cubicPath} fill="none" stroke={STROKE} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.85"/>
    <line x1=0     y1=H  x2={cp1Px.x} y2={cp1Px.y} stroke opacity="0.45"/>   ← tangent from bottom-left endpoint
    <line x1=W     y1=0  x2={cp2Px.x} y2={cp2Px.y} stroke opacity="0.45"/>   ← tangent from top-right endpoint
    <circle cx=0 cy=H r=3/> <circle cx=W cy=0 r=3/>                          ← endpoint dots
    <Handle cx={cp1Px.x} cy={cp1Px.y} role="curve-cp1"/>                     ← draggable
    <Handle cx={cp2Px.x} cy={cp2Px.y} role="curve-cp2"/>

  ELSE (preset curve):
    <polyline points={sampled 48 pts} fill="none" stroke strokeWidth="1.5" strokeDasharray="4 3" opacity="0.85"/>
    <circle at pts[0] r=3/> <circle at pts[last] r=3/>                       ← endpoint dots, no handles
</svg>
```
`Handle` = `<circle r="6" fill={STROKE} stroke="white" strokeWidth="1.5" data-role={role} style={cursor:'grab', pointerEvents:'auto'}>`. The SVG root is `pointerEvents:'none'`; only the two handles opt back in — so the parent's drag system hit-tests them via `data-role`.

## Variants
- **Preset curve** (`curve !== 'custom'`) — a sampled polyline (48 points) through `curveBlend(t, curve, blend, …)`; endpoints marked, no editable handles.
- **Custom curve** (`curve === 'custom'`) — a true cubic-bezier `<path>`, two draggable control-point handles, and tangent lines from the anchored endpoints to the control points.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| width | number (px) | — | viewBox width, x-scale (`x = t·width`) |
| height | number (px) | — | viewBox height, y-scale (`y = (1-v)·height`) |
| curve | string (`'custom'` \| preset name) | — | selects bezier-path+handles vs sampled polyline |
| blend | number 0..1 | — | curve amount fed to `curveBlend` (preset mode) |
| cp1 | `{x:0..1, y:0..1}` | — | first control point (normalized), custom mode |
| cp2 | `{x:0..1, y:0..1}` | — | second control point (normalized), custom mode |

No store, no callbacks — the component only renders positions; the parent drag system mutates `cp1`/`cp2` externally.

## States & interactions
- **Non-interactive root** — `pointerEvents:'none'` on the `<svg>`; the overlay never intercepts canvas events except through the two handles (`pointerEvents:'auto'`).
- **Handles are a seam, not a controller** — each handle carries `data-role="curve-cp1"` / `"curve-cp2"`. A parent drag system (the app's `TypeCanvas`) picks them up by that attribute, computes the new normalized `cp` and passes it back down as props. `cursor:'grab'` is the only affordance the component itself provides.
- **Endpoints are anchored** — bottom-left `(0, height)` = blend 0, top-right `(width, 0)` = blend 1. Only the two control points move (within `[0..1]`).

## Styling
- **Tailwind:** `absolute` on the svg; everything else is SVG attributes/inline style (`left:0 top:0 zIndex:3 overflow:visible pointerEvents:none`).
- **Tokens / color:** stroke = `STROKE = 'var(--ui-warning, #F2C94C)'` — a **monorepo variable, not a KOL token**. Retoken to a KOL warning/accent token in the DS (see DROP). White handle outline is literal `stroke="white"`.
- **Curve math / geometry (the load-bearing part):**
  - **Coordinate convention:** x runs left→right as `t·width`; y is **inverted** — `y = (1 - v)·height` so higher curve value sits higher on screen (blend 0 at the bottom, 1 at the top).
  - **Sampling (preset):** `SAMPLES = 48`; for `i` in `0..47`, `t = i/47`, `v = clamp(curveBlend(t, curve, blend, cp1, cp2))`, point `= {x: t·width, y: (1-v)·height}`; joined into a `<polyline points>`.
  - **Control points → px:** `cpPx = { x: cp.x·width, y: (1 - cp.y)·height }`.
  - **Cubic path (custom):** `M0 {height} C {cp1.x·width} {(1-cp1.y)·height}, {cp2.x·width} {(1-cp2.y)·height}, {width} 0` — anchored bottom-left → top-right with the two control points.
  - Dashed line style: `strokeWidth 1.5`, `strokeDasharray "4 3"`, `opacity 0.85`; tangent lines `strokeWidth 1`, `opacity 0.45`; endpoint dots `r=3`; handles `r=6`.
- **Drag mechanics:** external — the component computes handle positions only; the parent maps pointer → normalized `cp`. Document the `data-role` contract as the drag seam.
- **App-specific bits to DROP:**
  - **`STROKE` = `var(--ui-warning, …)`** → a KOL token (e.g. a `--kol-*` warning/accent). No monorepo-only vars in the DS.
  - **`curveBlend` / `clamp`** (imported from `./curveMath`) — the easing evaluator + its supported preset names are app math. Options: (a) accept an **`easing` function prop** `(t)=>v` so the DS primitive is math-agnostic, or (b) accept **pre-sampled points**, or (c) port `curveMath` as a DS util if the preset set is worth owning. Prefer (a) — keeps the primitive generic. `curve`'s preset string values are defined by that module; don't hardcode them into the DS.
  - The `TypeCanvas` **parent drag system** stays in the app; the DS ships the `data-role` handle contract as its interaction seam (or optionally an `onControlPointChange` callback wrapper for a batteries-included variant).

## Dependencies
None (DS). Pure SVG + React; internal `sampleCurve`/`Handle` helpers. Depends on the app's `curveMath` (`curveBlend`, `clamp`) and the app-provided `--ui-warning` var — both dropped/parameterized above.

## Recreation notes
- **Tier:** molecule — a self-contained SVG curve-editor primitive. Reusable anywhere an easing/curve needs editing (motion, gradients, type-morph).
- **Controlled prop seam:** already store-free (`{width, height, curve, blend, cp1, cp2}`). Make it fully generic by adding the `easing`/pre-sampled-points seam (replacing `curveBlend`) and a KOL stroke token (replacing `--ui-warning`). Expose the `data-role` handle contract — or wrap it in an optional `onControlPointChange` for consumers that don't have a parent drag system.
- **Promote whole vs decompose:** promote whole. The two branches (sampled polyline vs bezier + handles) belong together; the inverted-y convention and handle contract are the primitive.
- **Text casing:** no user-facing text at all (`aria-hidden` overlay) — nothing to author.
