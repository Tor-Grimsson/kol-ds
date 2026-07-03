---
"@kolkrabbi/kol-component": minor
---

Graphic: move the ~4.8 MB of raw illustration SVGs (several wrap embedded base64 rasters) behind a single dynamic `import()` (`graphicData.js`) — the same entry-chunk fix as kol-loader's Icon. The consumer's entry chunk no longer carries the graphic payload; it streams as its own async chunk. `GRAPHICS` (inventory) is now built from a keys-only glob and stays synchronous. Removes the dead `GRAPHIC_RAW` export (zero consumers; it forced the eager inline). On a cold first paint a graphic may render as a same-sized empty box for a frame.
