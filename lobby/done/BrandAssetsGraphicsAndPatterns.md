# BrandAssets drops Graphics and Patterns — the two sections kol-website's Assets page carries

**Staged:** 2026-10-27 · from a kol-website session
**Change:** small — two keys in `ASSET_SECTIONS` (`packages/styleguide/src/brandBook.js`) and their render in `BrandAssets.jsx`

---

## The problem, in one case
kol-website `apps/brand` is moving onto the site frame (`08-site-adoption.md` step 4: "the brand pages are kol-styleguide's `BrandBook` and `BrandAssets`"). Its `/assets` page has seven sections — Logos · **Graphics** · **Patterns** · Branded · Stationery · Social · Profile. `ASSET_SECTIONS` has no `graphics` or `patterns` key, so adopting `BrandAssets` drops two rows off the rail and two tables off the page. Brand moved (`BrandBook`, 2026-10-27); Assets stays local until this ships.

What the two sections are, in kol-website today (`apps/brand/src/pages/assets/Graphics.jsx`, `Patterns.jsx`):
- `#graphics` — "02 — graphics" · *Graphics* · an `AssetTable` of kol-component's `GRAPHICS` abstract forms (overlay + recolor + download, same as the logo table).
- `#patterns` — "03 — patterns" · *Patterns* · the same table over the tileable patterns; plus `#graphics-patterns` ("16 — graphics · patterns"), a second Patterns block absorbed into the same page.

## The fix
- `graphics` and `patterns` in `ASSET_SECTIONS` between `logos` and `branded`, ids `graphics` / `patterns`, nav `Graphics` / `Patterns`, shown when the manifest (or kol-component's `GRAPHICS`) has rows.
- `BrandAssets` renders them on `AssetTable`, as the Logos table.

## Definition of done
- [ ] `brandToc(brand, 'assets')` lists Logos · Graphics · Patterns · Branded · … for kol-website's manifest
- [ ] kol-styleguide published with it; kol-website's Assets moves onto `BrandAssets` with no section lost

## ✅ RESOLUTION — 2026-10-27 · kol-styleguide@0.9.0

BrandAssets carries Graphics and Patterns. A manifest's graphics: { abstract: [...], patterns: [...] } (names from kol-component's GRAPHICS) turns on #graphics ('02 — graphics') and #patterns ('03 — patterns') between Logos and Branded, each an AssetTable with the ink toggle and recoloured download (kol-website's graphicRows: 80px preview, packages/component/src/graphics/svg/<category>/<name>.svg path), plus #graphics-patterns ('16 — graphics · patterns', the GraphicCard grid, off the rail) under Patterns — as kol-website's Patterns page carries both. brandToc(brand, 'assets') reads Logos · Graphics · Patterns · Branded · Stationery · Social · Profile. No graphics field → nothing changes. Ledes are the manifest's to set (book.graphics · book.patterns · book.graphicsPatterns), as Logos' is — the old ones named repo paths. Docs: 05-brand/01-manifest.md.

**Remainder here:** none — kol-website bump kol-styleguide to 0.9.0; pass graphics: { abstract: GRAPHICS.abstract, patterns: GRAPHICS.patterns } on the manifest and your two ledes in book; move /assets onto BrandAssets.

