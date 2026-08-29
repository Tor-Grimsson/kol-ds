# ColumnBrowserResize — drag the browser's height and each column's width

**Staged:** 2026-08-27 · from **kol-r2b2** (user ask, twice — "drag the column to resize height" · "column height drag yes and individual column width drag"; ruling: "that should be a set in ds")
**Change:** kol-component `ColumnBrowser` (+ kol-theme) — the browser's height and every column's width are draggable, Finder-style

## Today

`organisms/ColumnBrowser.jsx:308` — the browser is `h-[528px]`, fixed. `:318` — every column is `w-[260px] shrink-0`; `:118` — the preview column `w-[320px]`. No seam for either; `className` is the only prop that reaches the frame.

## The ask

1. **Height** — a drag handle along the browser's bottom edge (`cursor: row-resize`). Props: `height` / `defaultHeight` (528 today) + `onHeightChange(px)`; min ~240. The consumer persists it (kol-r2b2: per-bucket settings).
2. **Column width, per column** — a drag handle on each column's right edge (`cursor: col-resize`), Finder's: every column keeps its own width. `columnWidth` default 260, min ~160; `onColumnResize(index, px)`. The preview column too (320 today).
3. **Handles** — the column border that is already there is the visual; the hit area is a 6–8px strip on it, invisible at rest, `fg-08` on hover / while dragging. Pointer events (`setPointerCapture`), no library.
4. Native CSS `resize:` (corner grip) was considered at the consumer and rejected by the user — real edge handles, in the DS.

## Anatomy

```
.kol-column-browser (relative, height from prop)
├── .kol-column-browser-column × N (width from state, relative)
│   └── .kol-column-browser-resize-x   (absolute, right edge, col-resize)
├── .kol-column-browser-preview        (same handle)
└── .kol-column-browser-resize-y       (absolute, bottom edge, row-resize)
```

## Recreation notes

Organism-internal state for widths (an array by column index) seeded from `columnWidth`; height controlled-or-uncontrolled like the DS `Slider`. Keep keyboard / cursor behaviour untouched. Showcase: the demo shows both drags.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.113.0 · kol-theme 0.74.0

`ColumnBrowser` resizes Finder-style: a bottom-edge handle (`row-resize`) and one on every column's right edge, the preview's too (`col-resize`) — 8px hit strips on the borders already there, invisible at rest, `fg-08` on hover / while dragging (`.kol-column-browser-resize-x/-y`, kol-theme 0.74.0), pointer capture, no library. `height` / `defaultHeight` 528 / `onHeightChange(px)` (min 240); `columnWidth` 260 (preview 320) / `onColumnResize(index | 'preview', px)` (min 160). Keyboard + cursor untouched; the showcase demo prints both drags. 21 gates clean; verified in source only.

**Remainder here:** none — kol-r2b2: bump kol-component 0.113.0 · kol-theme 0.74.0; persist `onHeightChange` / `onColumnResize` in the per-bucket settings and feed them back as `height` / `columnWidth`.
