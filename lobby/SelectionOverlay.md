---
component: SelectionOverlay
source: kol-monorepo/apps/brand/src/editor/compose/SelectionOverlay.jsx#L1-L84
date: 2026-07-03
status: draft
deps: []
---

# SelectionOverlay

## Purpose
Pure transform chrome for a selected box: a dashed outline, 8 named resize handles, and a `W × H` dimension label. Positioned absolutely in the **same 1080-virtual coordinate space** its target lives in (pairs with `Canvas`'s scale layer). Each handle carries a `data-handle="NW|N|NE|E|SE|S|SW|W"` attribute so a parent's pointer router can start the right resize mode. It renders no interaction logic of its own — it's the visual bounding-box/handles primitive; the drag math lives in the consumer.

## Anatomy
```
box wrapper  (absolute; left/top = x/y, width/height = w/h; pointer-events-none; z-100)
├─ outline    (absolute inset-0; outline: 1px dashed accent; outlineOffset 0)
├─ handles ×8 (absolute; data-handle=DIR; 10px white square, 1px accent border;
│              positioned calc(pct% - 5px); cursor per-direction; pointer-events auto)
└─ label      (absolute; left 0, top 100%, mt 6; mono 10px accent on rgba(0,0,0,.6);
               2×6 pad, radius 2; "W × H" rounded)
```
Handle grid (fractional positions `x`/`y` of the box, and resize cursor):
```
NW(0,0 nwse)   N(.5,0 ns)   NE(1,0 nesw)
 W(0,.5 ew)                  E(1,.5 ew)
SW(0,1 nesw)   S(.5,1 ns)   SE(1,1 nwse)
```

## Variants
- **showHandles** (default `true`) — render the 8 resize handles.
- **showLabel** (default `true`) — render the `W × H` dimension label.
- Handles + label are independent — outline-only, outline+label, or full chrome.
- **Null render** — returns `null` when the target has no positional box (source guards `!layer || layer.x == null` for cover-type layers).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| box | `{ x, y, w, h }` | — | virtual-coord position + size of the chrome (was `layer`) |
| showHandles | bool | `true` | render the 8 resize handles |
| showLabel | bool | `true` | render the `W × H` dimension label |

## States & interactions
- **Static chrome** — no internal state; recomputes purely from `box`.
- **Handle hit-testing** — each handle is `pointer-events:auto` (the wrapper and outline are `pointer-events:none`), so only the 10px squares are grabbable; the parent reads `e.target.dataset.handle` to pick the resize direction.
- **Per-direction cursor** — corner handles `nwse`/`nesw-resize`, edge handles `ns`/`ew-resize`.
- **Dimension readout** — `Math.round(w) × Math.round(h)` in virtual pixels; updates live as the consumer mutates `box` during a drag.

## Styling
- **Handles**: `HANDLE_SIZE = 10` (virtual px); positioned `left: calc(${hx*100}% - 5px)`, `top: calc(${hy*100}% - 5px)` so they center on the corner/edge. `background:white`, `border:1px solid var(--kol-accent-primary)`.
- **Outline**: `outline: 1px dashed var(--kol-accent-primary)`, `outlineOffset:0` (outline not border, so it doesn't consume box size).
- **Label**: `font-family: var(--kol-font-family-mono)`, 10px, `letterSpacing:0.04em`, `color: var(--kol-accent-primary)`, `background: rgba(0,0,0,0.6)`, `padding:2px 6px`, `borderRadius:2`, `whiteSpace:nowrap`.
- **Z / pointer**: wrapper `zIndex:100`, `pointerEvents:none`; handles override to `auto`.
- All inline styles (no Tailwind, no CSS classes). Coords are unitless numbers → px, matching the virtual space.
- **App-specific bits to DROP:**
  - The **`layer` prop** (an editor layer model with `.x/.y/.w/.h` plus unrelated fields) → reduce to a plain **`box` = `{ x, y, w, h }`**. Keep the `x == null` null-guard but express it as "no box → render nothing."
  - The `data-handle` values are fine to keep as the public contract, but the DS component should not assume any particular parent router — it just emits the attribute.

## Dependencies
- None. Pure inline-styled React.
- Reads CSS vars `--kol-accent-primary` and `--kol-font-family-mono`.

## Recreation notes
- Tier: **molecule** — a reusable bounding-box / transform-handles overlay. Useful anywhere a rectangle needs selection chrome (crop UI, layout guides, any transform tool).
- The **prop/slot seam replacing editor state**: swap the `layer` model for a flat `box` prop. The component stays presentational — resize/drag behavior stays in the consumer, which reads `data-handle` to dispatch.
- Consider exposing `handleSize`, `accentColor`, and a `labelFormatter(box)` so the DS version isn't locked to px or the accent token — but keep the current defaults.
- Shares the 1080-virtual coordinate contract with `Canvas`; document that pairing so consumers place it inside the same scale layer.
- Text casing: the label is a computed `W × H` string — no user copy, no casing concern.
