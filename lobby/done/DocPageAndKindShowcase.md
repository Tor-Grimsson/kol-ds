# DocPageAndKindShowcase — one plate for every document, the frontmatter block, the overlay's edges, and all 14 kinds on show

**Staged:** 2026-08-27 · from **kol-r2b2** `src/FileList.jsx#L73-L97` (`DocPage`) · `#L99-L187` (`MediaLightbox`) · `src/DocFrontmatter.jsx` · `src/lib/frontmatter.js` · `src/index.css#L34-L65` (user rulings 2026-08-27)
**Change:** kol-component `KindPreview` (+ a `DocPage` / `DocFrontmatter`), kol-framework `.kol-overlay`, kol-theme — and **a showcase page rendering every kind**

## Rulings

**(1) Documents share one plate.** markdown · text · code · JSON · YAML render on the same page (`.r2b2-doc` locally):
- Overlay: an A-series page — `height: 85vh; width: calc(85vh / 1.41421); max-width: calc(100vw - 10rem)`, `background: var(--kol-fg-04)`, `border-radius: var(--kol-radius-sm)`, `padding: 24px`, scrolls inside (`overflow-y: auto; overflow-x: hidden`), `overflow-wrap: anywhere`.
- Column: the same document zoomed `0.5`, `padding: 24px`, on the frame (no plate); the children reset `zoom: 1` so it never compounds.
- The code block **inside the page**: `background: transparent; border: 0; width: 100%`, wrapper `margin: 0` — "yaml should follow json in the way it scales": the block hugged short lines and sat as a second, darker plate.
- `KindPreview`'s `max-w-[70ch] max-h-[78vh]` (prose) and `max-w-[80ch] …` (code) wrappers are neutralised in the page (`div:has(> .kol-prose)`, `div:has(> .kol-codeblock-wrapper)` → `max-width: none; max-height: none; overflow: visible`) — the page is the bound. Prose `max-width: none; margin: 0; padding: 0`; tables `max-width: 100%`, cells `overflow-wrap: anywhere; word-break: break-word`; `pre` `white-space: pre-wrap`.

**(2) Frontmatter above markdown prose.** `DocFrontmatter` — the workshop `DocsFrontmatter` ported: eyebrow `FRONTMATTER`, icon + label keys, mono values, tags as `Tag` chips, arrays stacked, a hairline below, then the prose. `parseFrontmatter` verbatim from the workshop engine. Today it is a second fetch of the same URL; `KindPreview` should parse and render it itself.

**(3) The overlay's edges.** The lightbox prev / next arrows are `fixed` at the viewport edges (`left-6` / `right-6`, `top-1/2 -translate-y-1/2`), never inside the sheet, and every overlay body stops `10rem` short of the edges (`max-w-[calc(100vw-10rem)]`) so nothing runs under them. Was: `absolute` to the sheet → the arrows sat inside the plate / page and centred on sheet + caption ("too low").

**(4) `kol-framework.css` overlay clash.** The framework ships its own `.kol-overlay` / `.kol-overlay-sheet` (inverse 88 % scrim, 100 %-wide sheet) that beat the theme's; kol-r2b2 overrides `.kol-overlay { background: var(--kol-surface-primary) } .kol-overlay-sheet { width: auto; max-width: 100% }`. Resolve in the framework so the theme's flat scrim and click-away hold.

**(5) Showcase — every kind, 14 total, "where we can view properly".** One page in the showcase with each `KIND_LABEL` kind — image · video · audio · markdown · JSON · YAML · text · code · HLS playlist · font · archive · HLS segments · system · file (other) — shown **in the column preview and in the overlay**, plus the `VideoSheet` and both `AudioSheet` variants (`PlaybackBarAndAudioSheet`). The user asked for this three times this session.

## Recreation notes

`DocPage` = the page plate (overlay / column presentations) holding `DocFrontmatter` (markdown only) + `KindPreview`'s prose or code — a molecule `KindPreview` reaches for when the kind is a document, so consumers pass nothing. The `.r2b2-*` rules above become theme rules under `.kol-doc-page` (or the names you choose); kol-r2b2 drops `src/DocFrontmatter.jsx`, `src/lib/frontmatter.js` and the `index.css` block on return.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.114.0 · kol-theme 0.75.0 · kol-framework 0.29.0

(1) `DocPage` — one plate for every document: `KindPreview` renders markdown · text · code · JSON · YAML on `.kol-doc-page` (base plate; in `.kol-overlay` the A-series page 85vh × 85vh/√2 inside the 10rem gutters, scrolling; in `.kol-column-browser-preview` zoomed 0.5, children reset); the code block inside is transparent, borderless, full width; `KindPreview`'s own max-w/max-h wrappers are gone. (2) `DocFrontmatter` (the workshop block, ported) renders markdown's frontmatter above the prose from the same fetch — `parseFrontmatter` exported (`utilities/frontmatter`). (3) `MediaViewer`'s arrows are `fixed` at `left-6` / `right-6`, every slide stops `10rem` short. (4) The framework's `.kol-overlay` / `-sheet` / `-close` rules are retired (kol-framework 0.29.0) — the theme's FullscreenOverlay holds; your `index.css` override goes. (5) `/sets/preview/kind-preview` — all 14 kinds, column preview + overlay, the bar and both audio sheets. 21 gates clean; verified in source only.

**Remainder here:** none — kol-r2b2: bump kol-component 0.114.0 · kol-theme 0.75.0 · kol-framework 0.29.0; drop `src/DocFrontmatter.jsx`, `src/lib/frontmatter.js`, `DocPage` in `FileList.jsx` (render `KindPreview` bare) and the `.r2b2-doc` + `.kol-overlay` blocks in `index.css`; the lightbox arrows go `fixed` like `MediaViewer`'s.
