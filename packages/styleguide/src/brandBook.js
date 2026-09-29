/**
 * brandBook — the brand tool's section registry and the manifest helpers behind it.
 *
 * The brand book as it ran in kol-olina's apps/brand (itself kol-website's apps/brand, copied
 * 2026-09-02): two scrolling pages — BRAND documents the identity, ASSETS holds what you download
 * or reproduce — each a stack of sections. The section ids, eyebrows, titles and ledes below are
 * that app's, verbatim — except the Logos and Branded ledes, which named files in that repo and are
 * left for its manifest to set; anything that was the CLIENT's copy (About, Tone, Look, the logo concept,
 * the colour concept) is not here — it comes from the manifest's `book` field, section by section
 * (`@kolkrabbi/kol-brand-template` schema). A manifest key overrides the default of the same name.
 */

/* `nav` is the sidebar / rail label; a section without one (the hero, the overviews) is not indexed.
 * `copy` marks a section that is ONLY its copy — with none in the manifest it is not rendered. */
export const BOOK_SECTIONS = [
  { key: 'hero', id: 'hero', label: 'brand guidelines', lede: 'Client-facing identity guidelines — chapter-structured for handoff. Mirrors the shape of the deliverable PDF.' },
  { key: 'overview', id: 'brand-overview', label: 'Overview', title: 'Chapters', lede: 'Each chapter is its own page. They read in order, but every one stands alone for handoff.' },
  { key: 'about', id: 'about', nav: 'About', label: '01 — about', copy: true },
  { key: 'tone', id: 'voice', nav: 'Tone', label: '02 — tone', title: 'Tone', copy: true },
  { key: 'look', id: 'look', nav: 'Look', label: '03 — look', title: 'Look', copy: true },
  { key: 'logo', id: 'logos-concept', nav: 'Logo', label: '04 — logos · concept', title: 'The mark', marks: ['wordmark', 'logomark'] },
  { key: 'lockups', id: 'logos-types', nav: 'Lockups', label: '05 — logos · types', title: 'Marks and lockups', lede: 'Logomark, wordmark, and two primary lockups.', marks: ['logomark', 'wordmark', 'lockup-hori', 'lockup-vert'] },
  { key: 'color', id: 'color', nav: 'Color', label: '06 — color', title: 'Palette' },
  { key: 'typography', id: 'typography', nav: 'Typography', label: '07 — typography', title: 'Type' },
]

export const ASSET_SECTIONS = [
  { key: 'assetsOverview', id: 'assets-overview', label: 'Assets', title: 'Downloads and reproduction', lede: 'Everything you download or reproduce. Brand documents the identity; this holds the files and the specs for making them.' },
  { key: 'logos', id: 'logos', nav: 'Logos', label: '01 — logos', title: 'Logos' },
  { key: 'branded', id: 'branded-assets', nav: 'Branded', label: '04 — branded', title: 'Branded assets' },
  { key: 'stationery', id: 'assets-stationery', nav: 'Stationery', label: '08 — assets · stationery', title: 'Stationery', lede: 'Standard correspondence — business card, envelope, letterhead, email signature. Quiet typography, generous space, monochrome restraint.' },
  { key: 'social', id: 'social-sizes', nav: 'Social', label: '12 — social · sizes', title: 'Post sizes', lede: 'One template at each of the three Instagram aspect ratios — square feed (1:1), portrait feed (4:5), and story / reel (9:16). Editorial photography, restrained typography, a deliberate cadence.' },
  { key: 'profile', id: 'social-profile', nav: 'Profile', label: '13 — social · profile', title: 'Profile', lede: 'Avatar treatment for profile pictures across platforms — round-cropped on burgundy, signature centered.' },
]

/* the two pages, for a view switch */
export const BRAND_VIEWS = [
  { value: 'brand', label: 'Brand' },
  { value: 'assets', label: 'Assets' },
]

const hasCopy = (s) => Boolean(s.lede || s.blocks?.length || s.after?.length)

/* Whether a section has anything to show for this manifest. Copy-only sections need copy; the
 * specimen sections need the data they render. */
function shows(s, brand) {
  if (s.copy) return hasCopy(s)
  if (s.key === 'color') return Boolean(brand?.ramps?.length) || hasCopy(s)
  if (s.key === 'logos') return Boolean(brand?.logos?.length)
  if (s.key === 'social') return Boolean(brand?.social?.templates?.length)
  if (s.key === 'profile') return Boolean(brand?.social?.avatars?.length)
  return true
}

/** One page's sections for a manifest — defaults merged with `brand.book`, the empty ones dropped.
 *  `[{ key, id, nav?, label, title, lede, blocks, after, marks }]` */
export function brandSections(brand, page = 'brand') {
  const defaults = page === 'assets' ? ASSET_SECTIONS : BOOK_SECTIONS
  const name = brand?.meta?.name
  return defaults
    .map((d) => {
      const s = { ...d, ...(brand?.book?.[d.key] ?? {}) }
      if (d.key === 'hero' && !s.title) s.title = name
      if (d.key === 'about' && !s.title && name) s.title = `About ${name}`
      return s
    })
    .filter((s) => shows(s, brand))
}

/** A page's rail / index entries — `[{ id, label }]`. */
export const brandToc = (brand, page) =>
  brandSections(brand, page).filter((s) => s.nav).map((s) => ({ id: s.id, label: s.nav }))

/** The manifest's `meta` in the shape the stationery mocks read (`DEFAULT_BRAND_INFO`). A field the
 *  manifest does not carry is an EMPTY STRING, so the mocks render it blank rather than falling back
 *  to their placeholder values. */
export function brandInfo(brand) {
  const m = brand?.meta ?? {}
  const loc = m.location ?? {}
  return {
    identity: { founder: m.founder ?? '', role: m.role ?? '', established: m.founded ?? '', name: m.name ?? '', nameShort: m.nameShort ?? '' },
    contact: { email: m.email ?? '', phone: m.phone ?? '', web: (m.url ?? '').replace(/^https?:\/\//, '').replace(/\/$/, '') },
    social: { instagram: m.socials?.instagram ?? '', youtube: m.socials?.youtube ?? '', tiktok: m.socials?.tiktok ?? '' },
    studio: { street: loc.street ?? '', postcode: loc.postcode ?? '', country: loc.country ?? '', city: loc.city ?? '', locShort: loc.locShort ?? '' },
    legal: { entity: m.legalName ?? '', kt: '', vat: '' },
    labels: { madeIn: '', handmade: '', handBy: '', manifesto: '' },
  }
}

/* which logo each stationery mock carries — the variants olina's brandBook.jsx drew */
export const STATIONERY_MARKS = { card: 'lockup-hori', envelope: 'logomark', letter: 'wordmark', signature: 'logomark', avatar: 'logomark' }

/* The Branded table — the five stationery pieces the mocks draw. */
export const BRANDED_ASSET_ROWS = [
  { item: 'Business card · front',  aspect: '85.6 / 53.85 (ID-1)', surface: 'paper',     status: 'mocked',  note: 'StationeryMocks.BusinessCardFront' },
  { item: 'Business card · back',   aspect: '85.6 / 53.85',         surface: 'ink',       status: 'mocked',  note: 'StationeryMocks.BusinessCardBack' },
  { item: 'Envelope · DL',           aspect: '220 / 110',           surface: 'paper',     status: 'mocked',  note: 'StationeryMocks.Envelope' },
  { item: 'Letterhead · A4',         aspect: '210 / 297',           surface: 'paper',     status: 'mocked',  note: 'StationeryMocks.Letterhead' },
  { item: 'Email signature',         aspect: 'free',                surface: 'paper',     status: 'mocked',  note: 'StationeryMocks.EmailSignature' },
]

/** An in-page anchor click that scrolls instead of setting the hash — the host may route on the hash
 *  (media-hub does; apps/brand keeps its page there), so an anchor must not replace it. */
export function scrollToAnchor(e) {
  e.preventDefault()
  const id = e.currentTarget.getAttribute('href')?.slice(1)
  if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* viewBox → "W × H" */
export const svgDims = (raw) => {
  const m = /viewBox="[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)"/.exec(raw ?? '')
  return m ? `${Math.round(+m[1])} × ${Math.round(+m[2])}` : undefined
}

/* `currentColor` → the resolved ink the table hands over, into a Blob, so a white mark downloads white. */
export function downloadRecolored(raw, color, filename) {
  const blob = new Blob([raw.replace(/currentColor/gi, color)], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
