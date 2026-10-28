# @kolkrabbi/kol-styleguide



## 0.13.0 — 2026-10-28

- **`DocumentIndex` opens a folder's files in Quick Look** (DocumentIndexFilesAndIcons049, kol-website 2026-10-28 — the MarkdownPage ticket's point 0.12.0 missed). A row with `file` (from kol-framework's `documentFiles(glob)`) is a card in its part with its kind on the small line — PDF, Image — and opens in the DS Quick Look window (`QuickLookFrame` over the dimmed page, `KindPreview fit="sheet"` as the body: a PDF page by page with its thumbnail rail, an image at its size), ‹ › paging through the folder's files. `Contents` lets a row bring its own `href` and `onClick` for it; page rows are untouched.
## 0.12.0 — 2026-10-28

- **`DocumentIndex`** (plan-2026-10-28-document W5.2): a folder's pages as the brand book's contents cards — `Contents` routed, under a compact `PageHeader` when the index is a page of its own. Born in `apps/document`; it lives here rather than in kol-framework because kol-styleguide peers on kol-framework and the cards are `BrandGuide`'s.
## 0.11.0 — 2026-10-28

- **One brand renderer** (user 2026-10-28: the brand book's Chapters page and the guide's looked like two things). `BrandBook` and `BrandAssets` now render through `BrandGuide`'s chapters (`GuideChapters` over `BOOK_SECTIONS` · `ASSET_SECTIONS`), on the one chapter model (`guideBook.js` — `brandSections` · `brandToc` read it). What changes on screen: the Brand page's Chapters index is the numbered, grouped cards (Brand overview · Logos · Foundations, the site rail's own groups), the Color chapter is the compact ramp strips (and the manifest's approved pairs, if any) instead of the Swatch grid, the Typography chapter is the brand's families instead of KOL's type system, the stationery cards carry captions, and the Assets index is the same cards. Same ids, same rail entries, same props. The book's own renderer (`typeSpecimen.js` with it) is retired to `_tmp/2026-10-28-brand-book-one-renderer/`.

## 0.10.0 — 2026-10-27

- **`BrandAssets` takes drawn social mocks and the second letterhead** (BrandAssetsSocialMocksAndLetterheadB, kol-website 2026-10-27). A `brand.social.templates` row may carry `mock` instead of `src`: `'PostPhoto' | 'PostEditorial' | 'StoryPhoto'` (the kol-styleguide mocks, wearing the brand's logomark) or a node; `ratio` boxes a mock that does not size itself, and no wordmark overlay is drawn. `brand.stationery.letterheadB: true` adds the "Letterhead, A4 [B]" card (`LetterheadB`) in its own row under the stationery grid. Photo templates are unchanged.

## 0.9.0 — 2026-10-27

- **`BrandAssets` carries Graphics and Patterns** (BrandAssetsGraphicsAndPatterns, kol-website 2026-10-27) — kol-website's Assets page, so it adopts `BrandAssets` with no section lost. A manifest's `graphics: { abstract: [...], patterns: [...] }` (names from kol-component's `GRAPHICS`) turns on `#graphics` and `#patterns` between Logos and Branded, each an `AssetTable` with the ink toggle and recoloured download, plus `#graphics-patterns` (the cards, off the rail) under Patterns. No `graphics` → nothing changes. Ledes are the manifest's to set (`book.graphics` · `book.patterns` · `book.graphicsPatterns`), as Logos' is.

## 0.8.0 — 2026-10-27

- **`BrandGuide`** (BrandGuideOutlineTwoVersions, kol-hq 2026-10-27) — kol-branding's guide renderer, carried: one scrolling page, one chapter per row of the `sections` it is handed, every chapter the same anatomy, the specimen by `kind` (contents · logo · lockups · color · typography · logos-table · branded · stationery · social · profile), the chapters on the rail. With `guideSections` · `guideToc`. The outline is kol-brand-template 0.4.0's `GUIDE_SECTIONS`. kol-branding's research line under each chapter stays in kol-branding.

## 0.7.0 — 2026-10-24

- **`./src/*` is open in `exports`** (StyleguideSrcExports, kol-branding 2026-10-24) — the kol-framework pattern, so a forked brand-book composition deep-imports `BrandMark.jsx`, `typeSpecimen.js`, `SocialMocks.jsx` and `StationeryMocks.jsx` by path instead of aliasing `node_modules` in Vite. The raw-JSX contract is unchanged.

- **No `kol-helper-*` on a sentence** (kol-ds-ui `validate:helper-text`, 2026-10-23 — the helper scale is single-line chrome, 01-foundations/03-typography.md:29). Empty states and notes that are sentences wear `kol-mono-*` at the same size; labels are untouched.

## 0.6.0 — 2026-10-02

- **Renamed: `ProfileAvatar` → `BrandAvatar`** — it is the brand's mark in a profile frame, not a second `Avatar`. `ProfileAvatar` is the alias.

## 0.5.3 — 2026-09-30

- Comments and README only: one spelling, `color`.

## 0.5.2 — 2026-09-27

- `AssetTable` — the icon-only link / button ink on `oq-64` (the icon-ink gate's I3).


> Started 2026-08-14 at 0.1.1 — earlier versions shipped without entries (that history
> lives in the repo's session logs). From here every publish adds an entry, and
> breaking or global-surface changes are flagged **BREAKING**.

## 0.5.0

### Minor Changes

- **The brand tool** (brand as a tool, 2026-09-27): `Brand` renders a whole brand book from one brand manifest — BRAND (hero, chapter index, About · Tone · Look · Logo · Lockups · Color · Typography) and ASSETS (Logos table with ink toggle, zoom and recoloured download · Branded · Stationery · Social · Profile), a view switch, and the page's sections on the `DocsToc` rail. `BrandBook` and `BrandAssets` render the pages alone. kol-olina's apps/brand, carried class-for-class; its client copy now comes from the manifest's `book` field (kol-brand-template 0.3.0), and sections with nothing to show are left out. Marks come from a `Logo` component or `logoSources` (id → raw SVG). Helpers: `brandSections`, `brandToc`, `brandInfo`, `BRAND_VIEWS`, `BOOK_SECTIONS`, `ASSET_SECTIONS`.
- New peer: `@kolkrabbi/kol-framework` ≥0.39.0 (`PageHero`, `PageSection`, `.kol-grid`). The `kol-component` peer floor rises to ≥0.188.0 (`DocsToc variant="rail"`).
- One deviation from the port: the chapter-index arrow is inked `text-oq-48`, not `text-meta` (icon-ink law).

## 0.5.1

### Patch Changes

- The brand tool's Logos and Branded sections ship without a default lede. Both were kol-olina's, and named files in that repo (`src/brand/logos/svg/`, `src/components/styleguide/StationeryMocks.jsx`) — wrong for any other brand, and the unbroken path pushed the Assets page past a phone's width. A manifest sets them with `book.logos.lede` / `book.branded.lede`.
