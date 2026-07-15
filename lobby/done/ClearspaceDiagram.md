---
component: ClearspaceDiagram
source: kol-monorepo/apps/brand/src/components/styleguide/ClearspaceDiagram.jsx#L1-L38
date: 2026-07-10
status: recreated
target: packages/styleguide/src/ClearspaceDiagram.jsx
deps: []
---

# ClearspaceDiagram

## Purpose
The layered logo-construction overlay for a brand manual — stacks a construction
grid + an x-height / clearspace keyline over the logo mark in one box, with a
`framework` flag that shows/hides the two guide layers. Consumed by `LogoCard`
and directly on logo-anatomy pages. Part of the LOGO specimen family (Bucket A).

## Anatomy
```
div.kol-clearspace-diagram            (relative w-full h-full)
├─ span (grid layer)      absolute inset-0 [&_svg]:w-full/h-full   ← framework && grid
├─ span (keyline layer)   absolute inset-0 [&_svg]:w-full/h-full   ← framework && keyline
└─ span (logo layer)      absolute inset-0 [&_svg]:w-full/h-full   ← always
```
Later layers paint on top: grid (bottom) → keyline → logo (top).

## Variants
- **framework off** (default) — logo only.
- **framework on** — grid + keyline + logo, when both overlay nodes are supplied.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| logo | ReactNode | — | base mark layer; renders nothing if absent |
| grid | ReactNode | `null` | construction-grid overlay layer |
| keyline | ReactNode | `null` | x-height / clearspace guide layer |
| framework | bool | `false` | reveal the grid + keyline overlays |
| className | string | `''` | extra classes on the box |

Named export `hasFramework({ grid, keyline })` → `Boolean(grid && keyline)` — the
injected-node equivalent of the monorepo `hasFramework(variant)`; consumers gate
a clearspace toggle on it.

## Styling
All Tailwind inline — no CSS block needed:
- Box: `relative w-full h-full`.
- Each layer: `absolute inset-0 [&_svg]:w-full [&_svg]:h-full` (const `LAYER`).
- `[&_svg]` arbitrary variant stretches a descendant `<svg>` to fill — works for
  wrapped nodes (`<span><svg/></span>`, e.g. kol-brand `<Asset>`); direct-svg
  nodes should be pre-sized by the consumer.
- Marker class `.kol-clearspace-diagram` is a bare consumer hook (no rule).

## States & interactions
Stateless / presentational. The `framework` flag is owned by the parent
(`LogoCard`'s toggle drives it).

## Dependencies
None. Pure layer-stacking primitive over injected nodes.

## Asset-coupling replaced
- **DROPPED** `import { GRAPHIC_RAW } from '@kol/component'` and the module-level
  `DIAGRAMS` registry that parsed `diagram-{layer}-{variant}` SVG filenames into
  `{ layers: { grid, x, logo }, canvas }` keyed by variant.
- **DROPPED** the `variant` prop + the viewBox regex that read canvas dims from
  the grid SVG.
- **DROPPED** the three `dangerouslySetInnerHTML` string injections.
- **REPLACED WITH** three injected ReactNode props — `logo`, `grid`, `keyline`
  (was `x`) — rendered as children. The consumer owns the mark AND the
  construction geometry (a generic grid can't align to an unknown mark), so the
  DS stays asset-agnostic.

## Recreation notes
Tier: **styleguide primitive** (organism-adjacent). Built, not staged. "Overlay
geometry as props" = the grid / keyline / logo layers are the props; the stacking
geometry (absolute inset-0 layering + framework gate) is the default behavior. No
brand SVG registry, no baked mark. `x` layer renamed `keyline` for clarity. No
text rendered, so no casing concern.
