# ArticleRendererHomeHeroSelection — four asks, one batch

**Staged:** 2026-10-28 · from kol-website (user's plan, 2026-10-28)
**Files:** `lobby/_assets/ArticleRendererHomeHeroSelection/` — the sources to copy, as they run today

---

## 1. The article renderer — copy web's, don't redesign
kol-content ships `PortableTextRenderer`, which reads a simplified block shape. kol-website's Stack articles never used it: they run their own map over Sanity's real Portable Text (`@portabletext/react`), so there are two renderers and they have drifted, and no other app can render an article.

**The fix:** kol-content takes web's map and blocks as they are (`web-prose/`):
- `core/PortableTextBlog.jsx` — the block/mark/list map (code via `CodeBlock`, headings with `slugify` ids)
- `blocks/` — `ImageBlock` · `VideoBlock` · `QuoteBlock` · `TableBlock` · `StickyNavCard`
- `SanityImage.jsx` is web's image helper — make the image source a prop (`imageUrl(asset, opts)`) so no Sanity client lives in the package

The prose styles are already kol-theme's (`.kol-prose*`); nothing to move there. `@portabletext/react` becomes a peer dependency. Retire or alias the old `PortableTextRenderer` as you see fit.

**Done when:** `import { portableTextComponents, StickyNavCard } from '@kolkrabbi/kol-content'` renders web's `/stack/:slug` identically.

## 2. The site home hero — one flexible component
Three hand-built copies of the same hero: brand's Landing, record's Home, site-hub's Home (a copy of brand's). Web's `/stack` hero overlay is the same wash again (`home-hero/web-stack-hero-overlay.css.txt`).

**The fix:** a kol-framework `SiteHero` (name yours), every part optional so the next site needs no copy:
- `image` (`src` · `srcSet` · `sizes` · `position`) or `media` (any node)
- `mark` (a node or an SVG url, sized by the hero) · `title` · `tagline` · `actions`
- `overlay` (the 32 % light / 80 % dark inverse wash by default; a number or `false`)
- `align` (`center` default, `start`) · `minHeight` (`100dvh` default)

**Done when:** brand's Landing and record's Home are one line each, and `landing.css` has nothing left to hold.

## 3. Selected text — accent is opt-in, never the default
`kol-framework.css:36` paints every site's `::selection` with `--kol-accent-primary`, so brand's selections are yellow. User ruling: accents are opt-in, not default.

**The fix:** the default `::selection` is the neutral pair (white highlight, dark ink in dark mode; its inverse in light), and an app opts into the accent with a class or token.

## 4. Quick Look on private files — send the cookie
`PdfPage` loads with `getDocument({ url })` and `KindPreview` with a plain `fetch`, so a PDF on `private.kolkrabbi.io` (the one sign-in's cookie) answers 401 in Quick Look. Images and downloads work, because the browser sends the cookie for those.

**The fix:** both send credentials — `getDocument({ url, withCredentials: true })`, `fetch(url, { credentials: 'include' })` — when the URL is cross-origin, or behind a `credentials` prop.

## Definition of done
- [ ] kol-content exports web's Portable Text map and blocks
- [ ] kol-framework ships the home hero
- [ ] `::selection` neutral by default, accent opt-in
- [ ] Quick Look PDFs and fetches send credentials
- [ ] published

**Remainder at kol-website once it ships:** web on the package renderer, `components/prose/` to `_tmp/`; brand + record on the hero, `landing.css` + `KolLogo` to `_tmp/`; bump.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-content 0.15.0 · kol-framework 0.61.0 · kol-component 0.310.0**.
1. **Article renderer** — `portableTextComponents` / `createPortableTextComponents({ imageUrl })` + `StickyNavCard` from kol-content: web's map and blocks verbatim (proved by diff; the one change is the image source as a prop). The blocks stay inside the map, not exported — kol-component already has an `ImageBlock` / `VideoBlock` that take a resolved `src`. The map is plain components, so `@portabletext/react` stays your dependency, not a peer here.
2. **`SiteHero`** (kol-framework) — brand's Landing class for class, every part optional, the wash as one rule (`.kol-site-hero-overlay`). site-hub's Home runs on it; walked in both themes.
3. **`::selection` neutral by default** — the page's ink pair inverted; `.kol-select-accent` opts in.
4. **Quick Look credentials** — `PdfPage`, `PdfDocument` and `KindPreview` send the cookie for a registered origin (`registerCredentialedOrigin`); `MediaLibrary` registers its signed-in bucket itself. A registry rather than every cross-origin URL, because a credentialed request to a public CDN with a wildcard origin is refused.
