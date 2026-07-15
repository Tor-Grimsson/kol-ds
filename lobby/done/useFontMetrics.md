# Lobby spec — `useFontMetrics` (BUILT 2026-07-10)

> Status: **built** this session. Lives at `packages/foundry/src/useFontMetrics.js`,
> exported from the package barrel. This spec is the record of what it is and where
> it came from, not a to-do.

## Purpose

The reusable, parse-only font-metric layer for the foundry. A React hook that
loads a real font with **opentype.js** and exposes its face metrics plus
text→outline geometry. It is the engine that upgrades what `GlyphMetricsGrid`
can show: per-glyph advance/bounding-box readouts and true glyph **outline path
data** (`<path d>`) for any string, at any size/tracking, wrapped to a box.

## Provenance (read-only sources)

Ported from the kol type-editor (repo on disk: `kol-ds-fxr`, formerly
`kol-design-editor`):

| Source file | What was taken |
|---|---|
| `src/editor/modes/type/fontLoader.js` | async fetch → `opentype.parse`, promise cache keyed per cut, graceful fetch failure |
| `src/editor/modes/type/textOutline.js` | `renderOpts` (tracking → letterSpacing + ligature clear), `wrapLine` greedy soft-wrap, `textOutlinePaths` CSS half-leading baseline math |

Generalised off the editor's `layer` object into plain args. The editor's
`applyCase` (from `./cuts`) was **deliberately dropped** — casing is a content
concern (KOL no-auto-casing rule); text is measured and outlined verbatim.

## API

```js
const {
  status,            // 'idle' | 'loading' | 'ready' | 'unavailable' | 'error'
  opentypeAvailable, // false only when the optional peer is absent
  font,              // parsed opentype Font | null
  metrics,           // { unitsPerEm, ascender, descender, capHeight, xHeight } | null
  error,
  getAdvanceWidth,   // (text, size, { tracking }) => number
  getGlyphMetrics,   // (char, size?) => { advanceWidth, boundingBox, ...px } | null
  getOutlinePaths,   // (text, { size, tracking, lineHeight, align, boxWidth, boxHeight }) => string[]
} = useFontMetrics(fontUrl, { buffer, cacheKey })
```

- `fontUrl` — same-origin `.ttf`/`.otf` to fetch + parse.
- `options.buffer` — pre-fetched bytes (e.g. an upload); skips the fetch, same parse path.
- Also exports the pure helpers `extractFaceMetrics`, `buildOutlinePaths`, `glyphMetricsOf`.

## Graceful degradation (the load-bearing behavior)

opentype.js is an **optional peer** (already declared on the package). It is
resolved via a cached dynamic `import('opentype.js')`. Absent it, the hook
settles to `status: 'unavailable'`, `font: null` — and every helper returns an
empty/zero result instead of throwing. This mirrors `GlyphMetricsGrid`'s overlay
simply not drawing.

## Metric fallback chains

Same chains `GlyphMetricsGrid` uses so incomplete fonts degrade, never throw:
`unitsPerEm ← font.unitsPerEm ?? 1000`, `ascender ← os2.sTypoAscender ??
hhea.ascender ?? 800`, `descender ← os2.sTypoDescender ?? hhea.descender ??
-200`, `capHeight ← os2.sCapHeight ?? 700`, `xHeight ← os2.sxHeight ?? 500`.

## Dependencies / CSS

- **Optional peer:** `opentype.js` (already optional on `@kolkrabbi/kol-foundry`). No new deps.
- **CSS:** none — the hook renders nothing.

## Verification

- `node --check useFontMetrics.js` → OK (pure JS, no JSX).
- Bracket-balance tokenizer → BALANCED.

## Follow-up (not blocking)

`GlyphMetricsGrid` still carries its own inline `FontLoader` class (it needs the
FontFace injection the hook doesn't do). A future consolidation could have the
grid consume `useFontMetrics` for the parse half and keep only the FontFace
injection locally — left out of this session to keep the change additive.
