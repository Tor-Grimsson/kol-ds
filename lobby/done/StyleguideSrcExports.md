---
component: StyleguideSrcExports
source: kol-styleguide/package.json#exports · kol-framework/package.json#exports · kol-branding/vite.config.js#L10-L18
staged: 2026-10-24
status: draft
deps: [BrandMark, typeSpecimen, SocialMocks, StationeryMocks]
---

# StyleguideSrcExports — open `./src/*` in kol-styleguide's exports, as kol-framework does

## Purpose
kol-branding forked the brand-book composition (`Brand`, `BrandBook`, `BrandAssets`, `brandBook.js`) to own its
chapter list (plan 05, 2026-10-24 — user: *"if we start consuming things like that from DS we are fixed in place"*).
The fork keeps every PART on the package — `LogoCard`, `Swatch`, `AssetTable`, `AssetCard` from the barrel — but
the composition also draws four internals that are **not** on the barrel: `BrandMark.jsx`, `typeSpecimen.js`,
`SocialMocks.jsx`, `StationeryMocks.jsx`. `package.json#exports` is `{ ".": "./src/index.js" }`, so a deep import
(`@kolkrabbi/kol-styleguide/src/BrandMark.jsx`) is refused by Node and Vite alike — while `BrandBook.jsx` itself
deep-imports `@kolkrabbi/kol-framework/src/PageHero.jsx`, which kol-framework allows with `"./src/*": "./src/*"`.

## The stand-in
kol-branding resolves the deep path with a Vite `resolve.alias` regex onto `node_modules/@kolkrabbi/kol-styleguide/src/`.
It works and it is a consumer reaching around the package; the first version bump that moves a file breaks it silently.

## The ask
Either, in kol-styleguide:
1. `"./src/*": "./src/*"` in `exports` — the kol-framework pattern, one line, and the raw-JSX contract is the same; or
2. export `BrandMark`, `typeSections`, `BrandAvatar` and the stationery mocks from the barrel, so a forked composition
   can import them by name.

(1) is the smaller change and matches a sibling package. kol-branding then drops the alias (`vite.config.js`).

## Related
- `done/styleguide-barrel-is-unimportable.md` (2026-09-03) — the same exports map, seen from kol-client-olina.
- `done/brand-book-mocks-two-consumers.md` (2026-09-03) — the mocks' move into the package.

## 🟠 ADDRESSED — 2026-10-24 · option 1, in the tree, unpublished

`"./src/*": "./src/*"` added to `packages/styleguide/package.json#exports` — kol-framework's pattern, one line; the raw-JSX
contract is unchanged and the barrel is untouched. Changelog line under Unreleased. Publishes with the next kol-styleguide
wave (the user's `/upig`); on the return kol-branding drops its `resolve.alias` in `vite.config.js` and imports
`@kolkrabbi/kol-styleguide/src/BrandMark.jsx` and the three others by path.

## 🟢 CLOSED — 2026-10-24 · kol-styleguide 0.7.0 live

Published 2026-10-24; registry live. kol-branding bumped to 0.7.0 the same hour, dropped the `resolve.alias` block and
the `fileURLToPath` import, and the three deep imports in `src/template/book/BrandBook.jsx` resolve through `exports` —
build and `check:ui` green on /template/general and /template/guide at 390 · 768 · 1280 (kol-branding-d1's report).
Receipt closed on 0.7.0 in kol-branding's outbox.
