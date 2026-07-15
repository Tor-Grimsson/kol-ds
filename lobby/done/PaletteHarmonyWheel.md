---
component: PaletteHarmonyWheel
source: kol-ds-fxr/src/editor/color/PaletteHarmonyWheel.jsx#L1-L168
date: 2026-07-10
status: shipped
deps: [colorMath]
shipped_to: packages/component/src/molecules/PaletteHarmonyWheel.jsx
---

# PaletteHarmonyWheel

Bucket C port — the color ENGINE the DS lacked. Shipped into `@kolkrabbi/kol-component` (molecule tier), barrel-exported.

## Purpose
A hue ring with a draggable base-hue handle and satellite markers at the active harmony's scheme hues. Dragging (or arrow keys) rotates the base hue; every change emits the full set of harmony colors so the caller never re-derives them. Pure canvas — no KOL component nested.

## Anatomy
- Single `<canvas role="slider">`, sized `size × size` (default 248), HiDPI-aware (`devicePixelRatio` backing store).
- Render (in `useEffect`): 360 thin annulus wedges for the hue ring → grey spokes + colored satellite markers at each unique harmony offset → the big base-hue handle (colored fill, white outline, black halo).
- Pointer + keyboard drive the base hue; the harmony markers follow.

## What changed vs source (DS-ification)
- **Emits colors, not just hue.** Source was a pure hue picker (`onHueChange(hue)`); the palette generation lived elsewhere (PaletteModal). The DS wheel folds in colorMath: `onChange({ hue, colors })` where `colors = harmonyColors(hue, harmony, { saturation, lightness })` — one hex per role offset, tracking the markers 1:1.
- **Data injected.** `harmonies` (scheme table, default the shared `HARMONIES`) and base `saturation`/`lightness` are props, so it stays a pure hue picker — the caller owns S/L. `harmony` accepts an id string OR a harmony object.
- **HARMONIES + `norm` moved out** into the shared `colorMath` support module (hooks/), so the wheel and the generators share one scheme definition. Source defined HARMONIES inline.
- Renamed default export `HarmonyWheel` → `PaletteHarmonyWheel`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| size | number (px) | 248 | square canvas edge |
| hue | number 0–360 | — | controlled base hue |
| harmony | string \| object | `'analogous'` | active scheme (id or object) |
| saturation | number 0–100 | 100 | S of emitted colors |
| lightness | number 0–100 | 50 | L of emitted colors |
| harmonies | Array | HARMONIES | injectable scheme table |
| onChange | ({hue, colors}) => void | — | fires on press / drag / arrow keys |

## Styling / tokens
- **No CSS file, no tokens.** Only Tailwind utilities on the canvas (`cursor-pointer touch-none`). Ring hues, marker outlines (`#FFFFFF`), spokes (`rgba(128,128,128,.4)`) and the handle halo (`rgba(0,0,0,.35)`) are literal color math on purpose — a spectrum is not themeable, and the markers sit on fully-saturated ring hues, not on the surface (same rationale as SpectrumControls).

## Taxonomy note
Placed in molecules/ beside its color-picker siblings; carries a `taxonomy-ok:` exemption because it nests no KOL component (its only import is the colorMath support module in hooks/).

## Dependencies
- React `useEffect`, `useRef`.
- `../hooks/colorMath.js` — `HARMONIES`, `harmonyById`, `harmonyColors`, `normHue`.
