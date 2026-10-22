# Plan — Catalog: variant overlay · no-cover card

**Raised:** 2026-10-22, the user, on ui.kolkrabbi.io/apps/catalog (screenshot). Points verbatim:
- P1 *"viewing catalog, to have access to the variants, since this is supposed to be a reference site. like a small overlay dropdown or something?"*
- P2 *"when graphic is missing, the cards arent supposed to break. meaning the text section is supposed to be on the bottom, either ship this with a placeholder of fix text section placement default."*
**Status:** built — 2026-10-22, all but 2.2. Open: 2.2 (TALK); kol-component publish (1.1) waits on his review.
**Shape:** W › phase › list.
**Laws carried:** `media={false}` = no cover declared, `null`/omitted = the MISSING placeholder (ContentCard, content-card-needs-no-cover); every picker axis is a Dropdown with its name as the first row, a divider, then the list, labels capitalised (open-questions Round 6); Tailwind first; scope is the catalog app — no shared overlay for other apps without his say.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## W1 — The card without a cover

### 1.1 — Plate sits at the bottom of the frame (P2) — ✅ built 2026-10-22, not published

- Fix the default, not the app: in `ContentCard`'s fill-card layout (catalog), `media={false}` pushes the text plate to the bottom of the A4 frame (`marginTop: auto`). Today the media box is dropped and the plate rises to the top, which is the screenshot.
- `stack` / `drawer` / `canvas` are untouched; a placeholder in the app alone would leave every other `media={false}` catalog card broken.
- Publish kol-component after his yes.

**Acceptance:** on `/apps/catalog` in GRID, every card's title plate sits flush on the bottom edge of its A4 frame, the empty frame above it; LIST unchanged.

## W2 — Variants on the reference app

### 2.0 — The variants button, seen first — open-questions round (P1b) — ✅ built 2026-10-22

Raised 2026-10-22, the user (screenshot of the empty top-right, and a round + button). Verbatim:
- P1b *"since we use alot of page and section headers, there is usually empty space top right … I think we could also load it like a unique button to indicate its not part of the layout, like f..e fully rounded with slight shadow? like create new button is often in apps? … would be cool to see something?"*

- A new round on the open-questions page with live specimens: the catalog page's top-right with a round, icon-only button floating in it. Built from what ships: `Button iconOnly radius="full"`, a `--kol-shadow-*` token.
- Candidates side by side: icon (`variant-01` · `slider-01` · `layers`), size (`md` · `lg`), tone (`inverted` · `primary`), shadow (`md` · `lg`), each in light and dark. The dark shadow tokens are a white haze (`rgba(255,255,255,…)`), so dark needs its own look.
- Inset from the top and right by the page's own padding (`--kol-shell-page-pad`), so the button's right edge lines up with the content's right edge (RECENT · SAVED, LIST · GRID).
- Clicking a specimen opens the panel under it, so the open state is judged too.

**Acceptance:** the round shows every candidate in both themes at the catalog's real top-right position; he picks one.

### 2.1 — Variant overlay (P1) — ✅ built 2026-10-22

- Placement and button come from 2.0: a fixed round button top-right of `apps/catalog`, over the empty space beside the page header, not part of the layout. It opens a small panel holding one Dropdown per CatalogPage axis: **Preset** (catalog · shelf) · **Card** (catalog · file · slide · article · showcase) · **Row** (catalog · file · slide) · **List** (grid · stack) · **Width** (bleed · capped) · **Media** (none · missing).
- **Media** shows both no-picture states side by side with W1: `none` = `media={false}`, `missing` = the placeholder.
- App-local, `PreviewCard`'s `AxisPicker` idiom; nothing published.

**Acceptance:** each dropdown changes the live page without a reload; picking Preset `shelf` gives three capped columns of slide cards; Media `missing` draws the dashed placeholder in every card.

### 2.2 — Same overlay on the other reference apps — TALK

- Whether every `apps/*` reference page gets this overlay (and so whether it becomes a shared piece) is his call.

## W3 — The Content Card page in the showcase

Raised 2026-10-22, the user, on `/components/content-card` (screenshot). Verbatim:
- P3 *"the content card page showcase also sucks , wrong width and missing variant or missing properties. I was looking for the card that had the download gsap animation hover and icons for favorite, trash and download"*

The card he was after is `ContentCard variant="slide"`: the download is `ActionButton chrome="media"` on the cover, star + trash sit in the plate. `CatalogPage preset="shelf"` builds those from `onDownload` · `onFavourite` · `onDelete`. The page never shows it — `slide` is not in the picker.

### 3.1 — The picker lists the real kinds (P3) — ✅ built 2026-10-22

- Variants become the five kinds plus canvas: **File · Catalog · Slide · Article · Showcase · Canvas**. Today the picker lists the old alias names (default · print · work · typeface) and has no `slide`.
- `slide` shows the shelf card with cover, live download ActionButton, star and trash; print's flip moves under Catalog as a `flip` specimen.

**Acceptance:** picking Slide shows the 16:9 card; hovering the cover shows the download control, clicking it runs its confirm animation; star toggles; trash confirms.

### 3.2 — Width (P3) — ✅ built 2026-10-22

- Drop the `max-w-[48rem]` cap on every specimen grid so the cards fill the preview panel; each variant keeps its own column count.

**Acceptance:** at 1600 wide the specimens span the preview panel edge to edge, no empty band on the left or right.

### 3.3 — Missing properties (P3) — ✅ built 2026-10-22

- Add a Props axis on the picker for the props no specimen shows today: `media={false}` (no cover, needs W1), `control` / `controlStart`, `flip`, `fade`, `fit`, `ratio`.
- The Props table on the same page is checked against `ContentCard.jsx`'s signature, row for row.

**Acceptance:** every prop in `ContentCard`'s signature appears in the Props table, and each one in the list above can be shown live from the picker.

## Built notes — 2026-10-22

- 3.3's picker is the preview's existing `states` axis (`specimens · no cover · corner controls · fit · ratio · fade`), not a new "Props" control.
- 3.3's table: docgen recorded a destructured prop only when it had a default. `scripts/extract-api.mjs` now declares every destructured prop and pairs a file's definitions by name first. All tables: 1126 → 2450 rows, none lost; 13 tables (ColumnBrowser, ChessHero, AddLayerButton, BrandBook …) had been showing a helper's props and now show the export's.
- 2.0's panel draws its chrome inside the portal with the pane's `data-theme`; the dropdowns' own lists still open in the page theme.
- Round 16 is open: the pick (slider · lg · inverted · shadow-lg) is what 2.1 ships; a different pick is a two-line change in `apps/catalog/src/App.jsx`.
