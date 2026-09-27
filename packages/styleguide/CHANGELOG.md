# @kolkrabbi/kol-styleguide

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
