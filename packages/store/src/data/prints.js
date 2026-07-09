/**
 * @kolkrabbi/kol-store/data — demo print catalog + pricing fixture.
 *
 * A ready-to-drop DEMO adapter for the storefront components (PrintsGrid,
 * ScrollDriftGallery, ProductDetailLayout, PrintBuyButton), mirroring how
 * `@kolkrabbi/kol-chess/data` ships a bundled demo set. It is NOT production
 * data — every commerce specific has been severed to a placeholder:
 *
 *   - CDN_BASE is a placeholder host (`cdn.example.com`), not real infra.
 *   - `paypalLinks` values are empty placeholders — inject your own.
 *   - `buyUrl` / `printOnDemandUrl` are absent, so PrintBuyButton renders
 *     "Coming Soon" until a consumer wires real fulfillment.
 *
 * Real consumers bring their own catalog in this shape (or set CDN_BASE +
 * paypalLinks and reuse this one). The 24-entry catalog, size/edition price
 * matrix and static copy come from the kolkrabbi print store.
 */

// Placeholder CDN host — swap for your own asset base. The `/art-prints/...`
// path shape is preserved so the fixture documents the real catalog layout.
const CDN_BASE = 'https://cdn.example.com/kolkrabbi'

// Responsive artwork widths available per print (used for srcset).
const ARTWORK_WIDTHS = [566, 1132, 1700, 2840]

// Every entry follows the same asset layout keyed on its slug.
function mkPrint(id, name, slug, year) {
  const dir = `${CDN_BASE}/art-prints/print-${slug}`
  return {
    id,
    name,
    slug,
    description: `${name} print`,
    image: `${dir}/artwork/${slug}-artwork-2840.jpg`,
    detailImages: [`${dir}/print/${slug}-print-1700.jpg`, `${dir}/${slug}-certificate.jpg`],
    images: ARTWORK_WIDTHS.map((w) => `${dir}/artwork/${slug}-artwork-${w}.jpg`),
    category: 'Prints',
    year,
    tags: [],
    featured: true,
  }
}

export const prints = [
  mkPrint('print-001', 'Blokk', 'blokk', '2020'),
  mkPrint('print-002', 'Skovia', 'skovia', '2020'),
  mkPrint('print-003', 'Midnight', 'midnight', '2014'),
  mkPrint('print-004', 'Midday', 'midday', '2014'),
  mkPrint('print-005', 'fvv', 'fvv', '2012'),
  mkPrint('print-006', 'Weissensee', 'weissensee', '2016'),
  mkPrint('print-007', 'Tangents', 'tangents', '2020'),
  mkPrint('print-008', 'Faust', 'faust', '2016'),
  mkPrint('print-009', 'Tími I', 'timi-01', '2012'),
  mkPrint('print-010', 'Tími II', 'timi-02', '2014'),
  mkPrint('print-011', 'Tími III', 'timi-03', '2015'),
  mkPrint('print-012', 'Tími IV', 'timi-04', '2013'),
  mkPrint('print-013', 'Mýtar', 'mytar', '2011'),
  mkPrint('print-014', 'Borg', 'borg', '2018'),
  mkPrint('print-015', 'Traum', 'traum', '2015'),
  mkPrint('print-016', 'Ubu Roi', 'uburoi', '2022'),
  mkPrint('print-017', 'Skinnalón', 'skinnalon', '2015'),
  mkPrint('print-018', 'Hornhimna', 'hornhimna', '2023'),
  mkPrint('print-019', 'Himnuhorn', 'himnuhorn', '2023'),
  mkPrint('print-020', 'Himbrak', 'himbrak', '2024'),
  mkPrint('print-021', 'Trölla', 'trolla', '2025'),
  mkPrint('print-022', 'Myrkvi', 'myrkvi', '2019'),
  mkPrint('print-023', 'Frank', 'frank', '2017'),
  mkPrint('print-024', 'Launráð', 'launrad', '2013'),
]

// Pricing by size + edition (EUR) — art price + shipping per region.
export const printPricing = {
  'A3-open': { art: 140, shippingEU: 20, shippingIntl: 32 },
  'A3-limited': { art: 220, shippingEU: 20, shippingIntl: 32 },
  'A2-limited': { art: 320, shippingEU: 35, shippingIntl: 55 },
  'A1-limited': { art: 650, shippingEU: 60, shippingIntl: 95 },
}

// Size + edition options for the PDP "Size & Edition" select.
export const editionOptions = [
  { value: 'A1-limited', label: '594 × 841mm — Limited (8)' },
  { value: 'A2-limited', label: '420 × 594mm — Limited (20)' },
  { value: 'A3-limited', label: '297 × 420mm — Limited (30)' },
  { value: 'A3-open', label: '297 × 420mm — Open Edition' },
]

// Shipping-region options for the PDP "Shipping" select.
export const shippingOptions = [
  { value: 'eu', label: 'EU Shipping' },
  { value: 'intl', label: 'International' },
]

// PayPal payment links by size + edition + shipping region.
// SEVERED — real payment URLs stripped; inject your own per key.
export const paypalLinks = {
  'A3-open-eu': '',
  'A3-open-intl': '',
  'A3-limited-eu': '',
  'A3-limited-intl': '',
  'A2-limited-eu': '',
  'A2-limited-intl': '',
  'A1-limited-eu': '',
  'A1-limited-intl': '',
}

// Static copy for the PDP detail tabs.
export const printInfo = {
  overview: {
    description:
      'This is an unframed archival art print, produced using museum-grade materials and professional printing standards. Each print is made to order, carefully inspected, signed, and shipped with protective packaging.',
  },
  edition: {
    intro:
      'Each print is part of a limited edition. Once an edition is sold out, it will not be produced again in any size.',
    counts: { '594x841': 8, '420x594': 20, '297x420': 30 },
    artistProofs: 'Not for sale',
  },
  materials: {
    paper: 'Hahnemühle [100% cotton]',
    weight: '308gsm',
    printType: 'Archival Giclée Print [Pigment Ink]',
    certificate: 'Signed with Certificate of Authenticity & embossed seal',
  },
  shipping: {
    intro:
      'Prints ship in protective tubes within 5-10 business days. If you are based in Iceland, please reach out directly to arrange pickup or delivery and skip shipping charges.',
    vatNote: 'Artwork is VAT-exempt (Iceland).',
  },
}

// Distinct filter facets derived from the catalog.
export const filterData = {
  categories: [...new Set(prints.map((p) => p.category))].sort(),
  years: [...new Set(prints.map((p) => p.year))].sort((a, b) => b - a),
  featured: prints.filter((p) => p.featured),
}

/** Find a print by its URL slug. */
export const getPrintBySlug = (slug) => prints.find((p) => p.slug === slug)

/** Format a whole-unit currency amount (defaults to EUR / de-DE). */
export function formatPrice(amount, currency = 'EUR', locale = 'de-DE') {
  if (typeof amount !== 'number') return ''
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * resolvePrintPrice — the size/edition → total price matrix helper. Wire it to
 * ProductDetailLayout's `computePrice`:
 *
 *   computePrice={({ edition, shipping }) => resolvePrintPrice(printPricing, edition, shipping)}
 *
 * Returns PriceDisplay props ({ amount, currency, locale, secondary }) with the
 * shipping-region total and an "art + shipping" breakdown, or null for an
 * unknown edition.
 */
export function resolvePrintPrice(pricing, edition, shippingRegion, { currency = 'EUR', locale = 'de-DE' } = {}) {
  const entry = pricing?.[edition]
  if (!entry) return null
  const shippingCost = shippingRegion === 'eu' ? entry.shippingEU : entry.shippingIntl
  const total = entry.art + shippingCost
  const fmt = (n) => formatPrice(n, currency, locale)
  return {
    amount: total,
    currency,
    locale,
    secondary: `(${fmt(entry.art)} + ${fmt(shippingCost)} shipping)`,
  }
}

export default prints
