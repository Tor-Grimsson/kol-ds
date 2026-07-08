---
"@kolkrabbi/kol-icons": minor
---

Stroke inventory normalized to a single 1.5 weight on the 24-grid: `stroke-width` 2 / 1.12497 / 1.125 / 0.99997 → 1.5 across 293 SVGs (525 attributes) in `src/stroke/`. Geometry untouched — attribute-only rewrite. Deliberate exceptions kept: the stroke-cap diagram glyphs' thick elements (`6`) and `hash-italic-bold` (`2.5`). Kills the visible weight fork where 28% of icons rendered chunky (2.0) and 32 machine-scaled imports rendered anemic (1.125) next to the 1.5 majority.
