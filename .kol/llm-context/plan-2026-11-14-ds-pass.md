# Plan — KOL pass: Quick Look, inverse scales, fonts, rails

**Raised:** 2026-11-14, user, during the Folio work. Points verbatim: *"quicklook … doesnt account for media type. there are audio, video, code, text, markdown, pdf and pdf also shows sidebar thumbnail"*; *"right so instead variatns would be file type?"*; *"we are missing fg-inverse scale in figma"*; *"if we are adding fg inverse we should add oq inverse?"*; *"Special Gothic swap or add instead of Right Grotesk"* / *"we could start by adding special gothic instead of schibsted"*; *"we prepare for default to take inter as font as well as mono?"*; rails: *"Both versions should both exist as options"*, *"should float also have a fixed option, like figma"*.
**Status:** BUILT 2026-11-14 — W2.1, W1.1, W3.2 in the library (unpublished); W3.1 in code (kol-typography.css, unpublished, held for his OK — changes every consumer). W4 parked.
**Shape:** W › phase › list.
**Laws carried:** agents load `kol-ds-claude` then `kol-figma`; a code change to a look lands in the Figma library the same turn; Quick Look is not bound to a style; no middot in names; content leaving a page goes to the `_trash` page; agents stop when the build is done (no audit loops on work he watches live).
**How a phase closes:** acceptance line first, gates green, one check at the end.

## W1 — Quick Look by file kind (P: "variatns would be file type")

### 1.1 — QuickLookFrame variants = kind
- Library `QuickLookFrame`: the float switch goes (its float=true variant draws a Scene settings panel by mistake); variants become kind: image, video, audio, PDF (pages + thumbnail rail), markdown, text, code, each drawn from the code's `KindPreview` rendering.
- Acceptance: 7 variants, 0 float switch; each matches a live render of `FileQuickLook` for that kind.

## W2 — The inverse scales (P: "if we are adding fg inverse we should add oq inverse")

### 2.1 — fg-inverse and oq-inverse in the library
- Code has both, 01 to 96 (`kol-base-tokens.css`, `kol-opaque.css`); the library has only `fg-inverse/96`. Add both full scales to the `theme` collection, light and dark values from the code.
- Acceptance: 16 steps each, values equal to the CSS in both modes.

## W3 — Fonts (P: "inter as font as well as mono"; "special gothic instead of schibsted")

### 3.1 — Inter as the default sans in code
- kol-theme `--kol-font-family-sans*` → Inter; the mono stays. The library's `Inter` mode (added 2026-11-14) becomes the default mode after his publish.
- Acceptance: computed font on a showcase page is Inter; mono roles unchanged.

### 3.2 — Special Gothic replaces the Schibsted mode
- In the library `type` collection, the Schibsted mode becomes Special Gothic.
- Acceptance: mode named Special Gothic, every sans variable set to it; Right Grotesk mode untouched.

## W4 — Rails — PARKED: one review board after the Folio comparison is ruled
- Both options: one full-height rail with sections inside, and separate section cards that fold.
- Fixed or floating: docked at the edge like Figma, its panel button snapping it into a floating card.

## Order
W2 → W1 → W3 (3.1 after his publish of the Inter mode). W4 after the Folio rulings.

## Decided 2026-11-14 — the type roles
- Special Gothic for headings and display (website-style display roles), Inter for body, JetBrains Mono for labels and meta. Roboto Flex considered and passed over: one plainer face everywhere loses the display character; Special Gothic's missing italics don't matter in display roles.
- Follow-up: the library's `Special Gothic` mode currently sets every `font/sans*` variable to Special Gothic; it should set only the display cuts (sans-narrow, sans-compact, sans-tight) and keep `font/sans` (body) on Inter.
