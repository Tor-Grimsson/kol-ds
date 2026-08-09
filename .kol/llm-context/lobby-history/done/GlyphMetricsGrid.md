---
component: GlyphMetricsGrid
source: kol-monorepo/apps/web/src/components/fontviewer/GlyphMetricsGrid.jsx#L1-L353
date: 2026-07-03
status: closed
deps: [Tag, FontLoader, GlyphGrid, GlyphCategory]
staged: 2026-07-03
---

# GlyphMetricsGrid

## Purpose
The **crown jewel** of the specimen kit: a table-style glyph inspector that renders one giant glyph with a **live baseline / x-height / cap-height / ascender / descender overlay** drawn from the font's *real* parsed metrics, beside two clickable uppercase and lowercase glyph grids and a Unicode/decimal/hex readout. Loads any `.ttf`/`.otf` at a `fontUrl` through `@kol/fontviewer`'s `FontLoader` (opentype.js under the hood), reads the OS/2 + hhea tables off the parsed font, and positions the metric lines by scaling font units to the rendered pixel height every frame. Clicking or hovering a grid cell drives the big glyph; `variationSettings` feed straight into `font-variation-settings` so it stays correct under a live variable axis.

## Anatomy
- Root — `flex flex-col lg:flex-row justify-start items-start gap-6 md:gap-8 lg:gap-10 bg-surface-primary`
  - **Left: Glyph Viewer** — `w-full lg:flex-[504]` column
    - label `<div>` "Glyph Viewer" — `kol-mono-text`
    - glyph stage — `self-stretch h-64 md:h-80 lg:h-96 relative rounded-md overflow-hidden`
      - glyph `<span ref=glyphRef>` — absolutely centered, `fontSize: clamp(180px, 25vw, 316px)`, `lineHeight: 1`, inline `fontFamily`/`fontStyle`/`fontVariationSettings`; textContent starts "Loading…", then set imperatively to `displayGlyph`
      - **metrics overlay** `<div ref=overlayRef>` — `absolute inset-0 pointer-events-none` `aria-hidden`; children built imperatively (see Styling)
    - metadata block — `hidden md:inline-flex gap-8`, two `kol-mono-text opacity-80` columns: labels (Font style / Glyph name / Unicode / Decimal / Hex) and values (`Roman`|`Italic`, `displayGlyph`, `U+{hex}`, `{charCode}`, `0x{hex}`)
  - **Right: Dual Grids** — `w-full lg:flex-[832]` column
    - mobile tab row — `flex lg:hidden gap-3`, two `Tag`s ("Uppercase & Latin" / "Lowercase & Extended"), active one gets `is-active`
    - mobile body — `lg:hidden`, renders only the active tab's grid
    - desktop body — `hidden lg:flex lg:flex-col`, renders **both** grids stacked
- `renderGrid(glyphs, title)` — title `<div>` (`kol-mono-text`) + `inline-flex flex-wrap` of cells; each cell `w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 outline outline-offset-[-0.5px] outline-auto`, clickable, hover/selected states.

## Variants
No named variants. Structural forks only: `fontStyle` (`'italic'` vs else → the "Roman/Italic" metadata label and the glyph's inline `font-style`); responsive fork between the mobile single-tab view (`activeTab` state) and the desktop dual-grid view; `variationSettings` presence toggles the axis render on both the big glyph and every grid cell.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| fontUrl | string | bundled `TGMalromurItalicVF.ttf?url` | font file fetched → `arrayBuffer` → `FontLoader.loadFont`; sole dep of the load effect |
| fontFamily | string | `'TGMalromur'` | CSS `font-family` on the big glyph + every grid cell |
| fontStyle | `'normal'\|'italic'` | `'normal'` | inline `font-style`; also the "Roman/Italic" metadata label |
| initialGlyph | string | `'f'` | initial `selectedGlyph` |
| uppercaseGlyphs | string[] | `[...glyphSets.uppercase, ...glyphSets.latin1]` | top grid contents |
| lowercaseGlyphs | string[] | `[...glyphSets.lowercase, ...glyphSets.latinExtended]` | bottom grid contents |
| variationSettings | object | `{}` | axis→value map serialized to `font-variation-settings` (see Styling) |

## Styling
- **The `fontVariationSettings` mapping** (the reusable bit): `Object.entries(variationSettings).map(([axis, value]) => \`"${axis}" ${value}\`).join(', ') || 'normal'` → one string applied inline to the big glyph and every cell. Empty object → `'normal'`.
- **The metrics-overlay math** (inline `render()` inside a `requestAnimationFrame`, re-run on `[fontData, metrics, displayGlyph]`):
  - `overlayRect`/`glyphRect` via `getBoundingClientRect`; `glyphTop = glyphRect.top - overlayRect.top` (overlay-relative coords).
  - `fontSize = parseFloat(getComputedStyle(glyph).fontSize)`; bail if NaN.
  - `scale = fontSize / metrics.unitsPerEm`.
  - `totalHeightUnits = ascender − descender`; `totalPixelHeight = totalHeightUnits * scale`.
  - `baseline = glyphTop + glyphRect.height/2 − totalPixelHeight/2 + ascender * scale`.
  - Five lines at `y = baseline − (metricUnits * scale)`: **Cap Height** (`capHeight`), **Ascender** (`ascender`), **x-height** (`xHeight`), **Baseline** (`y = baseline`, value `0`), **Descender** (`descender`, note descender is negative so the line falls *below* baseline). Skip any non-finite `y`.
  - Each line = a `<div>` `border-top: 1px solid var(--kol-border-default)` at `top:${y}px`, plus a left label (`left:13px`) and right value (`right:13px`) at `top:${y-18}px`, both `opacity:0.8; color: var(--kol-surface-on-primary); font-size:12px; font-family:'PP Right Grotesk Mono', monospace; line-height:12px; user-select:none`. Built with `document.createElement` + `cssText`, `overlay.innerHTML=''` first.
- **Metric extraction** (in `FontLoader.onFontLoaded`, with fallback chains): `unitsPerEm = font.unitsPerEm || fontInfo?.unitsPerEm || 1000`; `ascender = os2.sTypoAscender ?? hhea.ascender ?? 800`; `descender = os2.sTypoDescender ?? hhea.descender ?? -200`; `capHeight = os2.sCapHeight ?? 700`; `xHeight = os2.sxHeight ?? 500`. Stored in `metrics` state.
- **Unicode readout**: `charCode = displayGlyph.charCodeAt(0)`; `unicodeHex = charCode.toString(16).toUpperCase().padStart(4,'0')`; rendered as `U+{hex}` / `{charCode}` / `0x{hex}`.
- Grid cell selected state: `bg-surface-inverse text-auto`; unselected: `bg-transparent text-auto hover:bg-auto/10`; `transition-colors duration-150 cursor-pointer`. Cells carry inline `fontFamily`/`fontStyle`/`fontVariationSettings`.
- Tokens: `--kol-border-default` (line), `--kol-surface-on-primary` (labels), `bg-surface-primary`, `bg-surface-inverse`, `text-auto`, `outline-auto`, `kol-mono-text`.
- **App-specific bits to DROP:**
  - **Bundled default font import** — `import defaultFontUrl from '@kol/fontviewer/src/assets/variFont/TGMalromurItalicVF.ttf?url'` reaches into the fontviewer package's `src/assets`. The DS component must require `fontUrl` (or accept a pre-parsed font) with no baked-in specimen font.
  - **`'PP Right Grotesk Mono'` hardcoded in the overlay label cssText** — swap for the KOL mono type token / `kol-mono` class instead of a literal font-family string.
  - **`glyphSets` default from `@kol/ui/data`** — fine to keep as a data source, but the DS should not silently default `uppercaseGlyphs`/`lowercaseGlyphs` to app glyph sets; make the sets an explicit prop (default can reference the DS's own glyph data).
  - **`is-active` Tag class contract** — the mobile tabs toggle a bare `is-active` string; wire to the DS `Tag`'s real selected/active API rather than a hand-passed className.

## States & interactions
- **Glyph select**: clicking a cell → `setSelectedGlyph(glyph)` (sticky). **Hover**: `onMouseEnter` → `setHoveredGlyph`, `onMouseLeave` on the grid → clear. `displayGlyph = hoveredGlyph || selectedGlyph` drives the big glyph (imperative `textContent` on `[displayGlyph]`) + the overlay re-render + the Unicode readout.
- **Roman/italic switch**: no internal control — driven by the `fontStyle` prop from the parent; changes the metadata label and inline `font-style`.
- **Axis scrub**: none internal — `variationSettings` is a prop; live axis changes flow in from the parent (`GlyphMetricsSection`) and re-render the overlay through the `displayGlyph` dep.
- **Auto-animate**: none here (that lives in `VariableFontSection`).
- Font (re)load keyed only on `[fontUrl]`; `cancelled` flag + `loader.cleanup()` guard teardown.

## Dependencies
`Tag` from `@kol/ui`. `FontLoader` from `@kol/fontviewer` (opentype.js parse + `FontFace` injection). `glyphSets` from `@kol/ui/data`. Relates to (but does **not** currently use) the `@kol/ui/foundry` primitives `GlyphGrid` / `GlyphCategory` — it hand-rolls its grids inline.

## Recreation notes
- Tier: **organism** (font I/O + parsed-metric geometry + dual grids + readout in one block).
- **HEADLINE RECONCILIATION — two metrics renderers must become one.** This component imports `FontLoader` from `@kol/fontviewer` but **re-implements the metrics overlay inline** instead of using the package's `utils/MetricsOverlay.js`. The two diverge and the promotion must merge them:
  - Package `MetricsOverlay` is a class (`new MetricsOverlay(overlayEl)`) with `isVisible` toggle, `render(font, glyphEl)`, class-based DOM (`.metric-line`, `.legend`, `.monospaced`, `.side-bearing-line`), **also draws side-bearing lines + a Small Caps line**, and reads `font.tables.os2.*` **unconditionally** (no fallback — throws on fonts lacking OS/2).
  - The inline version here **adds the fallback chains** (`os2 ?? hhea ?? literal`) making it robust to incomplete fonts, styles with **KOL tokens** (`--kol-border-default`, `--kol-surface-on-primary`) instead of CSS classes, uses **overlay-relative coordinates** (`glyphTop = rect.top − overlayRect.top`) instead of the package's viewport-center math, but **lost the side-bearing lines, the Small Caps line, and the visibility toggle**.
  - Promotion target: fold the fallback extraction + KOL-token styling + overlay-relative coords **into** `MetricsOverlay`, add options for which lines to draw (bearings/small-caps on/off) and a visibility flag, then have `GlyphMetricsGrid` **consume the package class** and delete the inline effect. One renderer, one source of truth.
- Font-parsing dep: **`FontLoader` (opentype.js)** — keep. The parsed `font.tables.os2` / `font.tables.hhea` are the metric source; do not approximate from CSS.
- Grid reconciliation: the inline uppercase/lowercase grids overlap `@kol/ui/foundry`'s `GlyphGrid`/`GlyphCategory`; on promotion, render the grids **through** those primitives (with a `selected`/`onSelect`/`onHover` contract) rather than the bespoke cell markup.
- Text casing at call site: metadata labels, grid titles, and tab labels render verbatim — no `text-transform`; author "Roman"/"Italic"/"Uppercase & Latin" in intended case.
