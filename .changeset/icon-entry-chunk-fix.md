---
"@kolkrabbi/kol-loader": minor
---

Move the ~2,000 raw SVG strings off the critical path (port of kol-labs-single's 2026-06-19 entry-chunk fix). `Icon` now pulls its maps from `iconData.js` via one dynamic `import()` — the SVG text becomes its own async chunk that streams in parallel with boot instead of bloating the consumer's entry chunk (measured −66% entry gzip in the origin app). API unchanged; on a cold first paint an icon may render as a same-sized empty box for a frame before the chunk lands. Also removes the dead `SVG_ENTRIES` export (zero consumers) — it eager-inlined the entire legacy `svg/` tree into every barrel import; use `ICON_ENTRIES` (keys-only) for galleries.
