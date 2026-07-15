---
component: Canvas
source: kol-monorepo/apps/brand/src/editor/shell/Canvas.jsx#L1-L252
date: 2026-07-03
status: draft
deps: []
---

# Canvas

## Purpose
The editor's aspect-ratio stage. A letterboxed frame (dashed guide border + mono ratio label) that hosts children in a **fixed 1080-virtual-pixel coordinate space** and scales the whole layer to fit the viewport via a single CSS `transform`. Because children always render at 1080px-wide logical coords, a `168px` element is always `168/1080` of the frame regardless of zoom or viewport size — the scale seam is the only place real pixels enter. Opt-in Space+drag panning over an oversized grid backdrop. The DS has **no** canvas/stage primitive; this is the reference for one. Three parts live in one file: `CanvasFrame` (the scale layer), `Canvas` (the letterbox), `PanViewport` (the pan wrapper).

## Anatomy
```
Canvas  (default export — letterbox + optional pan)
└─ [PanViewport]                         ← only when panEnabled
   └─ letterbox div  (containerType:size, flex center/start)
      └─ sizing div  (width: min(100cqw-48, (100cqh-48)*ratio))
         └─ CanvasFrame  (relative, aspect-ratio:ratio, bg:bgColor)
            ├─ guide border  (absolute inset-0, 1px solid guideColor@24%, z-2, pointer-events-none)
            ├─ label span    (top:6 left:8, mono 10px, guideColor@70%, z-2)     ← "1:1" / "Custom · 1.33"
            └─ scale layer   (absolute, w:1080 h:1080/ratio, transformOrigin TL, scale(scale), z-1)
               └─ children                                                        ← rendered in virtual 1080 coords
```
`PanViewport` when active:
```
viewport  (relative, w/h-full, overflow-hidden, select-none, cursor grab/grabbing when panning)
└─ translate layer  (absolute inset-0, translate(pan.x,pan.y), pointer-events none while Space held)
   ├─ kol-grid-bg    (absolute, left/top -200%, w/h 500% — oversized so panning never reveals an edge)
   └─ children (the letterbox)
```

## Variants
- **Bare frame** (`CanvasFrame`) — no outer letterbox; sizes to parent (`width:100%; aspect-ratio:ratio`). Parent owns width/height. Exported for consumers that place the frame themselves.
- **Letterboxed** (`Canvas`, default) — container-query letterbox centers/top-aligns the frame with 48px viewport gutter.
- **panEnabled** — wraps the letterbox in `PanViewport` (Space+drag). Off → returns the bare letterbox, no viewport/grid.
- **align** — `center` (default) or `start` (top-align in the letterbox).
- **Custom ratio** — `aspect='custom'` + `customRatio` → label becomes `Custom · N.NN`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| aspect | string (aspect id) | first entry | selects ratio+label from the aspects table |
| customRatio | number | — | numeric ratio + `Custom · N.NN` label when `aspect==='custom'` |
| bgColor | string | `transparent` (frame) / `#0E0E11` default | frame background fill |
| guideColor | string | `#F5F3EF` | dashed border (@24%) + label (@70%) color via `color-mix` |
| align | `center`\|`start` | `center` | vertical placement of frame in letterbox |
| panEnabled | bool | `false` | wraps in Space+drag `PanViewport` |
| children | node | — | rendered in the 1080-virtual scale layer |

## States & interactions
- **Scale (ResizeObserver)** — `CanvasFrame` measures its own rendered width; `scale = width / 1080`. Recomputed on mount, on every resize, and when `ratio` changes. Scale layer renders only once `scale > 0` (avoids a flash at 0).
- **Pan (Space-held)** — global `keydown`/`keyup` on `window`; `Space` (unless focus is in INPUT/TEXTAREA/contentEditable) sets `spaceHeld` and `preventDefault`s page scroll. Cursor flips `grab`; at rest it's left unset so a consumer's tool cursor shows through.
- **Drag** — `mousedown` while `spaceHeld` starts a drag; `mousemove`/`mouseup` bound on `window`; `pan = { clientX - start.x, clientY - start.y }`. Cursor `grabbing` while dragging. `keyup` on Space cancels any in-flight drag.
- **Pointer suppression** — while `spaceHeld`, the translate layer sets `pointer-events:none` so layer-level mousedowns don't fire mid-pan.
- **Pan transition** — `transform 120ms ease-out` at rest, `none` while dragging (no lag).

## Styling
- **Scale math** (load-bearing): `CANVAS_VIRTUAL_W = 1080`; `virtualH = 1080 / ratio`; scale layer `{ width:1080px, height:virtualH, transformOrigin:'top left', transform:scale(width/1080) }`.
- **Letterbox sizing**: outer `containerType:'size'` + flex; inner `width: min(calc(100cqw - 48px), calc((100cqh - 48px) * ratio))` — container-query units pick the larger-fitting dimension with a 48px gutter. `items-start`/`items-center` from `align`.
- **Frame**: `relative w-full`, inline `aspectRatio:ratio`, `background:bgColor`. Guide border `border:1px solid; borderColor: color-mix(in srgb, guideColor 24%, transparent)`. Label `font-family: var(--kol-font-family-mono)`, 10px, `letterSpacing:0.1em`, `color: color-mix(... 70%)`. Z-order: guide+label `z-[2]`, scale layer `z-[1]`.
- **Pan grid**: `kol-grid-bg` two-tier ruled backdrop (`--kol-grid-step:32px`, major every 4, tinted `--kol-surface-on-primary` @2%/@4%), positioned `-200% / 500%` so it always overhangs.
- Tailwind utilities: `relative w-full h-full overflow-hidden select-none absolute inset-0 flex items-center justify-center pointer-events-none`.
- **App-specific bits to DROP:**
  - **`import { ASPECTS } from './aspects'`** — the static ratio/label table is app config, not DS state. Make it a prop (`aspects` array of `{ id, label, ratio }`) with a sensible DS default; `resolveAspect` becomes a lookup over the passed array.
  - **`kol-grid-bg`** app CSS class — the source already declares the grid/dark backdrop "the consumer's responsibility." Keep that: expose a `backdrop` slot (or accept the grid as `children` of the viewport) rather than hardwiring the app's grid class into the DS.
  - **`CANVAS_DEFAULTS` `#0E0E11`** dark bg — that's the brand editor's surface, not a DS default. Default to `transparent` and let the token/theme own the dark stage.

## Dependencies
- None from the DS. Pure React (`useEffect`/`useRef`/`useState`) + `ResizeObserver`.
- Reads CSS vars `--kol-font-family-mono` (label), and via `kol-grid-bg`: `--kol-surface-on-primary`, `--kol-grid-*`. No DS components.

## Recreation notes
- Tier: **organism** — a compound stage primitive; nothing in the DS overlaps it. Ship it as the DS canvas/stage.
- The **prop/slot seam replacing editor state**: the component is already prop-driven (no store import) — good. The one coupling is the imported `ASPECTS` table → hoist to an `aspects` prop (+ default). The dark bg and grid backdrop → `backdrop` slot / token, not baked in.
- Keep the three-part split (`CanvasFrame` scale layer / `Canvas` letterbox / `PanViewport`) — each is independently useful; export all three so a consumer can place a bare frame or compose their own viewport.
- Preserve the 1080-virtual-pixel contract verbatim — it's the whole point; document it as the coordinate contract for anything rendered inside (`SelectionOverlay` shares it).
- Text casing: the ratio label comes from the `aspects` table entry (`'1:1'`, `'Custom'`) authored at the data layer — no `text-transform` in the component. Keep it that way.
