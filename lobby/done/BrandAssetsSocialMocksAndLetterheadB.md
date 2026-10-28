# BrandAssets: Social takes only images, Stationery has no LetterheadB — kol-website's Assets page carries both

**Staged:** 2026-10-27 · from a kol-website session
**Change:** small — two seams in `BrandAssets.jsx` (`packages/styleguide/src`)

---

## The problem, in one case
`BrandAssetsGraphicsAndPatterns` (0.9.0) closed the section gap; two content gaps still hold kol-website `apps/brand`'s `/assets` off `BrandAssets`:

1. **Social** (`#social-sizes`) — `BrandAssets` maps `brand.social.templates` `{ caption, ratio, src }` to an `<img>`. kol-website renders the studio's own drawn mocks, not photos (`apps/brand/src/pages/assets/Social.jsx`, brand pass 2026-10-14):
   - `Post · 1:1 square` → `<PostPhoto />`
   - `Post · 4:5 portrait` → `<PostEditorial />` in an `aspect-[4/5]` box
   - `Story · 9:16` → `<StoryPhoto />`
   kol-styleguide already exports all three (`SocialMocks.jsx`).
2. **Stationery** (`#assets-stationery`) — after the four-card grid, kol-website carries a second row: `<AssetCard caption="Letterhead, A4 [B]"><LetterheadB /></AssetCard>`. `BrandAssets` stops at the grid; `LetterheadB` is already exported.

## The fix
- A social template may carry a node instead of a `src` — e.g. `{ caption, ratio, mock: 'PostPhoto' | node }` rendered in place of the `<img>` (and without the wordmark overlay the photo template adds).
- `stationery.extra` (or a `letterheadB: true` flag) on the manifest renders the `LetterheadB` card under the grid with its caption.

## Definition of done
- [ ] kol-website's manifest can reproduce Social (three drawn mocks, captions verbatim) and the `Letterhead, A4 [B]` card on `BrandAssets`
- [ ] kol-ds-ui's `apps/brand` and `apps/brand-hub` updated to the new seams (VOYAGER's Social on the mocks, the LetterheadB card shown)
- [ ] published; kol-website's `/assets` moves onto `BrandAssets` with nothing lost

## ✅ RESOLUTION — 2026-10-27 · kol-styleguide@0.10.0

BrandAssets takes drawn social mocks and the second letterhead. A brand.social.templates row may carry mock instead of src: 'PostPhoto' | 'PostEditorial' | 'StoryPhoto' (kol-styleguide's mocks, wearing the brand's logomark) or a node; ratio boxes a mock that does not size itself, and no wordmark overlay is drawn. brand.stationery.letterheadB: true adds the 'Letterhead, A4 [B]' card (LetterheadB) in its own row under the stationery grid. VOYAGER (voyager-fixture) carries both, so apps/brand-hub's /assets shows the three mocks and the B card; apps/brand-sections (the old apps/brand) shows LetterheadB in its stationery set.

**Remainder here:** none — kol-website bump kol-styleguide to 0.10.0; social.templates: [{ caption: 'Post · 1:1 square', mock: 'PostPhoto' }, { caption: 'Post · 4:5 portrait', mock: 'PostEditorial', ratio: '4 / 5' }, { caption: 'Story · 9:16', mock: 'StoryPhoto' }] and stationery.letterheadB: true on your manifest; move /assets onto BrandAssets.

