---
component: SpectrumControls
source: kol-monorepo/apps/brand/src/editor/color/SpectrumControls.jsx#L1-L367
date: 2026-07-03
status: draft
deps: []
---

# SpectrumControls

## Purpose
The missing color-**picker** family. The DS ships `ColorSwatch` (a display chip) but nothing that lets a user *choose* a color from a spectrum. This file is three hand-tuned HSV picker widgets that fill that gap:

- **HueStrip** — 1D hue slider (a rainbow bar with a draggable knob).
- **SBSquare** — 2D saturation/value picker (white→hue horizontal, black overlay vertical, a crosshair handle).
- **WheelTriangle** — HSV color wheel: a conic hue ring with an inscribed, rotating HSV triangle for saturation/value.

All three are already fully controlled (`hue/sat/val` in, `onChange*` out) — no store coupling to remove. The file header explicitly forbids atomizing the pieces: the gradients, inset math, handle sizes and barycentric SV geometry are tuned to match a reference design. **Spec them as three WHOLE widgets.** The value of this brief is capturing the color math so the DS can recreate the geometry exactly.

## Anatomy
**HueStrip**
```
<div ref onMouseDown class="relative rounded-[2px] cursor-pointer" style={height:12, background:HUE_GRADIENT}>
  <div class="absolute inset-y-0" style={left:HANDLE_R, right:HANDLE_R}>   ← inset positioning region
    <Handle left={`${hue/360*100}%`} top="50%" />
  </div>
</div>
```
**SBSquare**
```
<div ref onMouseDown class="relative cursor-crosshair w-full h-full" style={background:sb}>
  <div class="absolute" style={inset:HANDLE_R}>
    <Handle left={`${sat}%`} top={`${100-val}%`} />
  </div>
</div>
```
**WheelTriangle**
```
<div class="aspect-square max-h-full max-w-full">
  <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
       class="block cursor-crosshair select-none w-full h-full" onMouseDown={onSvgDown}>
    <defs>
      <clipPath id="kol-wheel-ring-clip">        ← evenodd torus: outer r48 arc + inner r40 arc
      <linearGradient id="kol-wheel-white-fade">  ← userSpaceOnUse, midHB→Vw, white 0→1 opacity
      <linearGradient id="kol-wheel-black-fade">  ← userSpaceOnUse, midHW→Vb, black 0→1 opacity
    </defs>
    <foreignObject clipPath="url(#…ring-clip)"> ← div w/ CSS conic-gradient hue ring
    <polygon fill="hsl(hue,100%,50%)" />        ← solid hue base
    <polygon fill="url(#…white-fade)" />        ← white corner fade
    <polygon fill="url(#…black-fade)" />        ← black corner fade
    <SvgHandle cx=ringHx cy=ringHy r=3.2 />     ← hue handle on ring
    <SvgHandle cx=handleX cy=handleY r=2.0 />   ← sat/val handle in triangle
  </svg>
</div>
```
Shared DOM `Handle` (HueStrip/SBSquare): 14×14 `rounded-full bg-fg`, `translate(-50%,-50%)`, `boxShadow: '0 0 0 1px #000, 0 0 0 2px #505050'`, `pointer-events-none`. `SvgHandle` (wheel): two concentric circles — outer `r+0.5` black stroke (opacity 0.7, width 0.5), inner `r` white stroke (width 1.4).

## Variants
Three independent widgets (not `variant` props of one). Compose them as needed: HueStrip + SBSquare = the classic square picker; WheelTriangle = the ring picker. They do not share a wrapper — the consumer lays them out.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| **HueStrip** | | | |
| hue | number (0–360) | — | knob x-position `hue/360*100%`, and the SBSquare/wheel base hue |
| onChange | (hue:number)=>void | — | fired with `ratio*360` on down/drag |
| **SBSquare** | | | |
| hue | number (0–360) | — | horizontal gradient endpoint `hsl(hue,100%,50%)` |
| sat | number (0–100) | — | handle `left: ${sat}%` |
| val | number (0–100) | — | handle `top: ${100-val}%` |
| onChange | (sat:number, val:number)=>void | — | fired with `(sx*100, (1-sy)*100)` |
| **WheelTriangle** | | | |
| hue | number (0–360) | — | ring handle angle + triangle rotation |
| sat | number (0–100) | — | SV handle barycentric position |
| val | number (0–100) | — | SV handle barycentric position |
| onChangeHue | (hue:number)=>void | — | ring drag (snap-on-click + track) |
| onChangeSV | (sat:number, val:number)=>void | — | triangle drag (grab-with-offset) |

## States & interactions
- **HueStrip / SBSquare drag** — `onMouseDown` sets a `dragging` ref and updates immediately; `window` `mousemove`/`mouseup` listeners (added in `useEffect`) continue/end the drag. Values are always clamped to `[0,1]`.
- **WheelTriangle pointer routing** — `onSvgDown` measures `dist = hypot(vx-50, vy-50)`. If `dist > RING_INNER (40)` → **ring mode**: snap hue to `(atan2(vy-50,vx-50)·180/π + 360) % 360`, then drag tracks cursor angle. Else → **triangle mode**: **grab-with-offset** — stores `{offsetX: handleX-vx, offsetY: handleY-vy}` so the handle doesn't teleport to the cursor; drag applies `cursor + offset`, clamps into the triangle, converts back to sat/val. Fine SV tuning depends on this offset — do not replace it with snap-to-cursor.
- No keyboard support in the source (mouse only). Recreation should add arrow-key nudge + focus ring for a11y (see notes).

## Styling
- **Tailwind:** `relative rounded-[2px] cursor-pointer` (HueStrip), `relative cursor-crosshair w-full h-full` (SBSquare), `aspect-square max-h-full max-w-full` + `block cursor-crosshair select-none w-full h-full` (wheel).
- **KOL tokens:** handle fill `bg-fg`. Everything else is literal color math (hsl/#000/#fff/#505050) — intentional, not themeable.
- **Constants:** `HANDLE_R = 7` insets BOTH the handle positioning region AND the drag hit-test so the knob never spills past the frame edge (center maps to the inset area, not 0/100% of the box). `RING_OUTER = 48`, `RING_INNER = 40`, `TRI_R = RING_INNER = 40`.
- **Color math — HueStrip:** `HUE_GRADIENT = linear-gradient(to right, hsl(0…360,100%,50%))` at 60° stops. Position `= hue/360·100%`; value `= clamp((clientX - left - HANDLE_R) / (width - 2·HANDLE_R)) · 360`.
- **Color math — SBSquare:** `sb = linear-gradient(to bottom, transparent 0%, #000 100%), linear-gradient(to right, #fff 0%, hsl(hue,100%,50%) 100%)`. sat = `sx·100` (left→right), val = `(1-sy)·100` (top→bottom). **The gradient field must stay square-cornered** — put `rounded-[2px] overflow-hidden` on the *wrapper*, never a border-radius on the gradient (corner AA artifacts).
- **Color math — WheelTriangle (HSV geometry):**
  - Center `(50,50)`; `vertexAt(θ) = [50 + 40·cosθ, 50 + 40·sinθ]`.
  - `angleHue = hue·π/180`; `angleWhite = hueAngle - 2π/3`; `angleBlack = hueAngle + 2π/3` → the hue vertex always points at the ring's hue position; white/black vertices trail ±120°.
  - **Barycentric SV:** point `P = a·Vh + b·Vw + c·Vb`, `a+b+c=1`. `value = a + b` (= `1-c`, height from the black edge); `saturation = a/(a+b)` (0 = white side, 1 = hue side). Inverse (sat/val → handle): `a = (sat/100)(val/100)`, `b = (1-sat/100)(val/100)`, `c = 1-val/100`.
  - `clampToTriangle`: clamp negative bary weights to 0 then renormalize `a/b/c` so out-of-triangle drags slide along the edges.
  - Ring handle sits on the band midline `ringR = (48+40)/2 = 44`.
  - **Ring render:** `foreignObject` containing a `<div>` with a CSS `conic-gradient(from 0deg, hsl(0…360,100%,50%))`, clipped to an evenodd two-arc torus path (`kol-wheel-ring-clip`). SVG conic gradients don't exist, hence the foreignObject.
  - **Triangle render:** three stacked polygons on the same points — (1) solid `hsl(hue,100%,50%)`, (2) white-fade linearGradient from `midHB` (mid of Vh–Vb edge, opacity 0) to `Vw` (opacity 1), (3) black-fade from `midHW` (mid of Vh–Vw edge, opacity 0) to `Vb` (opacity 1). All gradients `gradientUnits="userSpaceOnUse"` in viewBox space.
- **App-specific bits to DROP:** essentially none — these are already store-free controlled widgets. The one recreation hazard is the **hardcoded SVG `<defs>` ids** (`kol-wheel-ring-clip`, `kol-wheel-white-fade`, `kol-wheel-black-fade`): mounting two WheelTriangles collides the ids. Uniquify per-instance (`useId()` suffix) in the DS version.

## Dependencies
None. Three self-contained leaf widgets — no DS component composition, only React (`useRef`/`useEffect`/`useCallback`) and the internal `Handle`/`SvgHandle` helpers. They pair naturally with `ColorSwatch` (preview) and hex `Input` at the call site, but don't depend on them.

## Recreation notes
- **Tier:** molecule(s) — three sibling molecules under one `SpectrumControls` (or `color/`) namespace. Promote **whole**, do not decompose. The header's "DO NOT refactor pieces to atoms" is a hard constraint: the `Handle`/`SvgHandle`, gradients and inset constants are tuned as a unit.
- **Controlled prop seam:** already clean — `{hue, onChange}` / `{hue, sat, val, onChange}` / `{hue, sat, val, onChangeHue, onChangeSV}`. The editor's color store wires these; the DS keeps them prop-driven. No store, no context to introduce.
- **Whole vs decompose:** promote all three as-is. If the DS wants a batteries-included `ColorPicker` molecule later, compose it *from* these (HueStrip + SBSquare + hex Input) rather than reimplementing the math.
- **a11y gap to close in the DS:** mouse-only today. Add `role="slider"`, `aria-valuenow/min/max`, focusability and arrow-key nudges without touching the drag/geometry math.
- **Multi-instance:** uniquify the SVG `<defs>` ids (see Styling → DROP).
- **Text casing:** no user-facing text in these widgets — nothing to author.
