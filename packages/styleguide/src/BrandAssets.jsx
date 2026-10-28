import { GuideChapters } from './BrandGuide.jsx'
import { ASSET_SECTIONS } from './brandBook.js'

/* taxonomy-ok: organism — the brand book's assets page: the guide's chapters over ASSET_SECTIONS */

/**
 * BrandAssets — The brand book's assets page. the ASSETS page of the brand tool: what you download or reproduce. Logos (the
 * mark table, with the ink toggle, zoom and recoloured download), Graphics and Patterns (the manifest's `graphics`),
 * the branded-asset register, stationery (and `stationery.letterheadB`), social post sizes (photos or the drawn mocks)
 * and profile avatars.
 *
 * `BrandGuide`'s chapters over `ASSET_SECTIONS` (0.11.0 — one renderer; the page's own, carried from kol-olina's
 * apps/brand `pages/assets/*`, is in `_tmp/2026-10-28-brand-book-one-renderer/`). The client's marks, contact details,
 * templates and avatar grounds come from the manifest (`logos`, `meta`, `stationery`, `social`, `graphics`); sections
 * with nothing to show are left out.
 *
 * @param {Object}   brand     a brand manifest (`@kolkrabbi/kol-brand-template` schema)
 * @param {Function} Logo      optional mark component, `<Logo variant="wordmark" />`
 * @param {Object}   logoSources  `{ [logoId]: rawSvg }` — the table's dimensions and downloads, and
 *                             the marks themselves when no `Logo` is given
 */
export default function BrandAssets({ brand, Logo, logoSources }) {
  return <GuideChapters brand={brand} sections={ASSET_SECTIONS} Logo={Logo} logoSources={logoSources} />
}
