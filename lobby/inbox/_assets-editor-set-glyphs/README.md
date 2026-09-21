# editor-set glyphs — from kol-fxr

Sent 2026-09-03 for `editor-set-is-behind-its-source`, in answer to the icons ask.

Source: `kol-fxr/src/editor/icons/svg/` — these are the drawings the editor runs today.

| file | for |
|---|---|
| `bool-unite.svg` · `bool-subtract.svg` · `bool-intersect.svg` · `bool-exclude.svg` | the four boolean ops in the tool rail's `BooleanDropdown` |
| `tool-pen.svg` | the pen tool |
| `tool-pattern.svg` | the pattern tool |
| `tool-fold-indicator.svg` | the corner fold `SplitToolButton` currently inlines |

All 24×24 except `tool-fold-indicator.svg`, which is 4×4 by design (it renders at
5px in the corner of a 36px trigger).

All `currentColor`, `stroke-width: 2`, `stroke-linejoin: round`, no alpha anywhere
— they hold the opaque-ink law as drawn. The booleans are the reason that law
matters here: `bool-subtract` and `bool-intersect` are two overlapping shapes,
so an alpha stroke would show the overlap as a heavier seam.

`tool-rect` · `tool-ellipse` · `tool-cursor` · `tool-text` are NOT included —
kol-icon-set-v1 already has `rectangle` · `circle` · `pointer` · `type`, which
are the same marks under DS names. fxr will remap rather than ask you to mint
duplicates.
