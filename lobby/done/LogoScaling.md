---
component: LogoScaling
source: kol-monorepo/apps/brand/src/components/styleguide/LogoScaling.jsx#L1-L67
date: 2026-07-10
status: recreated
target: packages/styleguide/src/LogoScaling.jsx
deps: []
---

# LogoScaling

## Purpose
The responsive logo scale matrix — columns = logo variants, rows = pixel steps
(128 → 8px), each cell rendering the mark at that step so a brand manual shows
where a lockup stops being legible. A fixed internal canvas is scaled to fit the
container so every step stays an exact px size. Part of the LOGO specimen family
(Bucket A).

## Anatomy
```
div.kol-logo-scaling
└─ div (ref)                     relative w-full overflow-hidden; style aspectRatio=W/H
   └─ div (canvas grid)          absolute inline-grid gap-x-12 gap-y-8 items-center
                                 text-emphasis origin-top-left
                                 style: gridTemplateColumns='auto repeat(N,auto)',
                                        width=W, height=H, transform=scale(fit)
      ├─ <div/> (corner)         empty top-left
      ├─ header × N              kol-helper-12 tracking-widest  → variant.label
      └─ per step:
         ├─ px label             kol-helper-12 text-right       → step
         └─ cell × N             [&_svg]:w-full/h-auto; style width=px*widthMul
                                 → variant.node
```

## Variants
Single form. The matrix shape is data-driven by `variants` × `steps`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| variants | Array<{label, node, widthMul}> | `[]` | columns — header label + rendered mark node + per-cell width multiplier |
| steps | number[] | `[128,96,64,48,40,32,24,16,12,8]` | rows (px sizes) |
| canvasWidth | number | `1600` | fixed internal canvas width scaled to fit |
| canvasHeight | number | `1000` | fixed internal canvas height |
| className | string | `''` | extra classes on the wrapper |

## Styling
All Tailwind inline + computed inline styles (dynamic values can't be utilities):
- Fit mechanism: `ResizeObserver` on the ref div sets `scale =
  contentRect.width / canvasWidth`; canvas is `transform: scale(scale)` from
  `origin-top-left`, sized `width/height = canvas*`, wrapper holds the box via
  `aspect-ratio: W / H`.
- Grid: `inline-grid gap-x-12 gap-y-8 items-center`; `gridTemplateColumns:
  'auto repeat(N, auto)'` (inline — column count is dynamic).
- `text-emphasis` sets full ink so injected `fill="currentColor"` marks inherit it.
- Labels: `kol-helper-12` (mono 12px). Column headers add `tracking-widest`; step
  labels add `text-right`.
- Cells: `[&_svg]:w-full [&_svg]:h-auto`, `style width = px * widthMul` → the mark
  scales to the cell.
- Marker class `.kol-logo-scaling` is a bare hook. No CSS block needed.
- **DROPPED** `uppercase` from the column headers — casing authored at call site.

## States & interactions
Reactive to container width only (ResizeObserver → `scale`). Otherwise static.

## Dependencies
None. React hooks (`Fragment`, `useEffect`, `useRef`, `useState`) + native
`ResizeObserver`.

## Asset-coupling replaced
- **DROPPED** `import KolLogo from '../../brand/logos/KolLogo'` and the hardcoded
  `COLUMNS` array (`logomark` / `lockup-vert` / `lockup-hori` / `wordmark` with
  `<KolLogo variant/>`).
- **DROPPED** the module-level `STEPS`, `CANVAS_W`, `CANVAS_H` constants — now
  props (`steps` default keeps the 10-step scale; `canvasWidth/Height` props).
- **DROPPED** the `data-reveal` attribute (kol-client reveal wiring; the DS
  `.reveal*` family was intentionally not ported).
- **REPLACED WITH** a `variants` prop where each column carries a rendered `node`
  (sized to its cell) + `label` + `widthMul`. Same node reused across every step
  row; the cell width drives the render size.

## Recreation notes
Tier: **styleguide organism** (documentation widget). Built, not staged. The
fixed-canvas + `ResizeObserver` scale-to-fit is kept verbatim (it's the whole
point — exact px steps that still fit the column). Redundant `font-mono` dropped
from the step label (`kol-helper-12` is already mono). Column labels pass through
untouched (no text-transform).
