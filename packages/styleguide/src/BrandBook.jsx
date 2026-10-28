import { GuideChapters } from './BrandGuide.jsx'
import { BOOK_SECTIONS } from './brandBook.js'

/* taxonomy-ok: organism — the brand book's identity page: the guide's chapters over BOOK_SECTIONS */

/**
 * BrandBook — The brand book's identity page. the BRAND page of the brand tool: the identity, one scrolling page of chapters
 * (About · Tone · Look · Logo · Lockups · Color · Typography) under a hero and a chapter index.
 *
 * `BrandGuide`'s chapters over `BOOK_SECTIONS` (0.11.0 — one renderer; the book's own, carried from kol-olina's
 * apps/brand `pages/brand/*`, is in `_tmp/2026-10-28-brand-book-one-renderer/`). The copy comes from the manifest
 * (`brand.book`, `brand.ramps`, `brand.type`, `brand.logos`); sections with nothing to show are left out.
 *
 * @param {Object}   brand     a brand manifest (`@kolkrabbi/kol-brand-template` schema)
 * @param {Function} Logo      optional mark component, `<Logo variant="wordmark" />`
 * @param {Object}   logoSources  `{ [logoId]: rawSvg }` — drawn when no `Logo` is given
 */
export default function BrandBook({ brand, Logo, logoSources }) {
  return <GuideChapters brand={brand} sections={BOOK_SECTIONS} Logo={Logo} logoSources={logoSources} />
}
