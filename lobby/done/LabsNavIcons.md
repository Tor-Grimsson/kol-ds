---
component: LabsNavIcons (kol-icons set additions — batch)
source: kol-labs-single/src/sidebars.config.js#L49-L218
staged: 2026-08-09
status: draft
deps: [Icon]
---

# LabsNavIcons

## Purpose
The labs sidebar's nav-group icons — the glyphs labs.kolkrabbi.io actually renders per category — for the design editor's labs mode, which currently substitutes nearest-match guesses from the curated set (grid for ptrn-dot, desktop for monitor, refresh for cycle…). All 15 names labs uses are absent from kol-icons 0.13.0. **SVG sources collected** in `_assets/2026-08-09-labs-nav-icons/` (copied verbatim from the labs repo's loader shelves).

## The list — name · labs nav entry · source shelf
| name | used by (labs sidebar) | labs source |
|---|---|---|
| `ptrn-dot` | Halftone | `svg/99-rack/` |
| `grid-horizontal` | Scanline (both) | `solid/layout/` |
| `monitor` | CRT | `svg/12-theme-display/` |
| `target-lock` | FX Rack | `stroke/cursor/` |
| `ptrn-checker` | Pattern (both) | `svg/99-rack/` |
| `cycle` | Loops · the Randomize button icon everywhere | `stroke/stats/` |
| `sum` | Math | `stroke/editing/` |
| `a-framed` | Penrose | `stroke/typography/` |
| `dith-flow` | Drift | `svg/99-rack/` |
| `paint-drop` | Soft Forms | `solid/tools/` |
| `ball` | Soft Forms 3D · 3D Scene | `stroke/shapes/` |
| `phone` | Interfaces | `svg/04-communication/` |
| `font-01` | Kinetic · Type | `stroke/typography/` |
| `camera` | Modulation (live) | `svg/07-media/` |
| `aa` | Para Type | `stroke/typography/` |

(`circle` — Refraction/Gradients/Glass — already ships; not in the batch.)

## Recreation notes
- Same conform pass as the TransportIcons resolution: 24-box, 6–18 keyline, `currentColor`, family attribute format; the sources span three shelf dialects (`stroke/` = stroke 1.5, `solid/` + `svg/` = fills), so the solid/fill ones need the usual currentColor sweep.
- `cycle` matters beyond the nav — it is labs' Randomize glyph (`Button iconLeft="cycle"` on every Randomize/Randomise button); the editor currently substitutes `refresh`.
- Suggested groups: the pattern glyphs (`ptrn-dot`, `ptrn-checker`, `dith-flow`) may warrant a `pattern` group; typography ones fit the existing type family; the rest slot per your grouping law.
- Consumer swap ready: the editor's labs `GROUP_ICONS` map switches to these names the release they ship.

---

## Resolution (2026-08-09) — 🟢 closed

Shipped in **`@kolkrabbi/kol-icons@0.14.0`** (published, registry-verified).
**13 minted · 4 mapped**, reviewed frame by frame on the staged `_tmp/`
proposal page; user sign-off "ship it".

- **New `pattern` group (5):** `ptrn-dot` · `ptrn-checker` · `grid-horizontal`
  · `dith-flow` · `dith-drift`. `dith-flow` is the legacy rack **wave** drawing
  (user pointer: `_tmp/legacy-icons/solid/rack/dith-flow.svg`); the labs dash
  drawing survives beside it as `dith-drift` (name is a suggestion — its labs
  consumer is the Drift nav).
- **typography (3):** `a-framed` · `aa` (the labs AA drawing kept, centered in
  the box — a legacy font-02 "Aa" alternative was rejected) · `font-01`.
- **Rest:** `camera` (device — stroke redraw of the Material fill) · `ball`
  (shape-primitives — star filled + bordered on user ruling) · `paint-drop`
  (tools — stroke redraw) · `sum` (code) · `globe` (nav — legacy stroke twin,
  re-gridded r9→r8.5; not in the ticket, added on user ask).
- **NOT minted — dupes of shipped drawings, labs maps the names instead:**
  `target-lock` → `target` · `monitor` → `desktop` · `phone` → `mobile`
  (user: labs wants a mobile icon, not a handset) · `cycle` → `refresh`.
- All conformed to the family dialect: 24-box, stroke 1.5 where stroked,
  `currentColor`; pattern glyphs keep their fills. Inventory regenerated
  **184 · 27**; 19 gates clean.
