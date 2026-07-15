---
component: SpectrumGrid
source: kol-monorepo/apps/brand/src/components/styleguide/SpectrumGrid.jsx#L1-L82
date: 2026-07-03
status: draft
deps: []
---

# SpectrumGrid

## Purpose
A matrix view of the whole ramp system — rows = ramps, columns = stops (50→900).
Each cell is a colored tile showing its stop number (contrast-corrected) + hex.
Hex values are **resolved live from CSS custom properties** (`--{ramp}-{stop}`) at
mount, so the theme file stays the single source of truth. Part of the color-specimen kit.

## Anatomy
```
div.kol-spectrum-grid                     (CSS grid: 100px + repeat(10, 1fr))
├─ .kol-spectrum-grid-head (display:contents)
│  ├─ .kol-spectrum-grid-corner           (empty top-left)
│  └─ .kol-spectrum-grid-stop-label × S   (column headers: stop numbers)
└─ .kol-spectrum-grid-row × R (display:contents)
   ├─ .kol-spectrum-grid-row-label        (ramp name)
   └─ .kol-spectrum-grid-cell × S         (bg = hex)
      ├─ .kol-spectrum-grid-cell-stop     (stop number)
      ├─ .kol-spectrum-grid-cell-marker   (brand-anchor dot, optional)
      └─ .kol-spectrum-grid-cell-hex      (hex readout)
```

## Variants
- **loading** — before vars resolve: `.kol-spectrum-grid--loading` placeholder, `aria-busy`.
- **resolved** — the full matrix.
- Per-cell **brand-anchor** marker when `(ramp, stop)` matches a `brandAnchors` entry.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| ramps | string[] | — | rows; each resolves `--{ramp}-{stop}` |
| stops | number[] | `[50,100,…,900]` | columns |
| brandAnchors | Array<{ramp, stop}> | `[]` | cells that get the canonical-anchor dot |

## Styling
Exact CSS (`kol-framework.css:1034-1137`):
- Grid: `grid-template-columns:100px repeat(10,minmax(0,1fr)); gap:4px; width:100%`. `head`/`row` are `display:contents`.
- Stop/row/cell labels: `font-family:var(--kol-font-family-mono,monospace)`; stop-label `11px` `color:var(--kol-fg-48)`; row-label `12px/500` `color:var(--kol-surface-on-primary)`.
- Cell: `aspect-ratio:5/3; border-radius:4px; padding:6px 8px; transition:transform 120ms ease`. `cell-stop` `12px/700`; `cell-hex` `9px opacity .78`.
- Anchor marker: 10×10 `border-radius:50%; background:currentColor; opacity:.85`.
- Inline (JS): `background:{hex}`, `color:{#000|#fff}` chosen by `isLight()` perceptual luminance (0.299R+0.587G+0.114B > 0.6).
- Responsive `@media(max-width:900px)`: cols → `72px repeat(10,…)`, gap 2px, `cell-hex` hidden.
- **DROP:** `text-transform:uppercase` on stop-label + the `::first-letter` uppercase on row-label (author casing at call site — no auto-transform). The inline `#000/#fff` contrast text is fine to keep (computed, not brand color).

## States & interactions
- Cell **hover** → `transform:scale(1.04)`.
- `title` attr per cell: `{ramp}-{stop}  {hex}  · brand anchor`.

## Dependencies
None (self-contained; reads `getComputedStyle(document.documentElement)`).

## Recreation notes
Tier: **organism** (documentation widget). Two things:
1. Swap the inline `getComputedStyle` read for the shared **`resolveCssVar`** util (see `ColorRamp` spec) so all token-doc widgets share one resolver.
2. Reconcile with `ColorRamp` — both render live token chips; SpectrumGrid is the matrix, ColorRamp the single row. Keep the `isLight`/contrast-label helper (or promote it to a DS color util). Column/row labels authored in the case they render.
