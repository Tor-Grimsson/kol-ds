/**
 * brandBook — the brand tool's section registry and the manifest helpers behind it.
 *
 * The brand book as it ran in kol-olina's apps/brand (itself kol-website's apps/brand, copied
 * 2026-09-02): two scrolling pages — BRAND documents the identity, ASSETS holds what you download
 * or reproduce — each a stack of sections. The section ids, eyebrows, titles and ledes below are
 * that app's, verbatim — except the Logos and Branded ledes, which named files in that repo and are
 * left for its manifest to set; anything that was the CLIENT's copy (About, Tone, Look, the logo concept,
 * the color concept) is not here — it comes from the manifest's `book` field, section by section
 * (`@kolkrabbi/kol-brand-template` schema). A manifest key overrides the default of the same name.
 *
 * Since 0.11.0 the two pages render through `BrandGuide`'s chapters (user 2026-10-28: one renderer) — this file is the
 * two lists and the manifest helpers; the model is ./guideBook.js.
 */
import { guideSections, guideToc } from './guideBook.js'

/* `nav` is the sidebar / rail label; a section without one (the hero, the overviews) is not indexed. `kind` names the
 * specimen BrandGuide draws (its SPECIMENS table); a row without one is prose and shows only with copy in the manifest.
 * `part` groups the overview's cards — Brand's three, the groups the site rail already uses (apps/site-hub, 2026-10-24). */
const OVERVIEW = 'Brand overview', LOGOS = 'Logos', FOUNDATIONS = 'Foundations'

export const BOOK_SECTIONS = [
  { key: 'hero', id: 'hero', kind: 'hero', label: 'brand guidelines', lede: 'Client-facing identity guidelines — chapter-structured for handoff. Mirrors the shape of the deliverable PDF.' },
  { key: 'overview', id: 'brand-overview', kind: 'contents', label: 'Overview', title: 'Chapters', lede: 'Each chapter is its own page. They read in order, but every one stands alone for handoff.' },
  { key: 'about', id: 'about', part: OVERVIEW, nav: 'About', label: '01 — about' },
  { key: 'messages', id: 'key-messages', part: OVERVIEW, nav: 'Key messages', label: '01 — about · key messages', title: 'Key messages' },
  { key: 'tone', id: 'voice', part: OVERVIEW, nav: 'Tone', label: '02 — tone', title: 'Tone' },
  { key: 'look', id: 'look', part: OVERVIEW, nav: 'Look', label: '03 — look', title: 'Look' },
  { key: 'logo', id: 'logos-concept', part: LOGOS, kind: 'logo', nav: 'Logo', label: '04 — logos · concept', title: 'The mark', marks: ['wordmark', 'logomark'] },
  { key: 'lockups', id: 'logos-types', part: LOGOS, kind: 'lockups', nav: 'Lockups', label: '05 — logos · types', title: 'Marks and lockups', lede: 'Logomark, wordmark, and two primary lockups.', marks: ['logomark', 'wordmark', 'lockup-hori', 'lockup-vert'] },
  { key: 'color', id: 'color', part: FOUNDATIONS, kind: 'color', nav: 'Color', label: '06 — color', title: 'Palette' },
  { key: 'typography', id: 'typography', part: FOUNDATIONS, kind: 'typography', nav: 'Typography', label: '07 — typography', title: 'Type' },
]

export const ASSET_SECTIONS = [
  { key: 'assetsOverview', id: 'assets-overview', kind: 'contents', label: 'Assets', title: 'Downloads and reproduction', lede: 'Everything you download or reproduce. Brand documents the identity; this holds the files and the specs for making them.' },
  { key: 'logos', id: 'logos', kind: 'logos-table', nav: 'Logos', label: '01 — logos', title: 'Logos' },
  /* kol-website's Assets page (BrandAssetsGraphicsAndPatterns, 2026-10-27): the manifest's `graphics` — names from
     kol-component's set by category, `{ abstract: [...], patterns: [...] }`. The Patterns page there carried a second
     block, the cards (`graphics-patterns`); it rides under Patterns, off the rail, as it did. Ledes named repo paths,
     so they are the manifest's to set, as Logos' is. */
  { key: 'graphics', id: 'graphics', kind: 'graphics', category: 'abstract', nav: 'Graphics', label: '02 — graphics', title: 'Graphics' },
  { key: 'patterns', id: 'patterns', kind: 'graphics', category: 'patterns', nav: 'Patterns', label: '03 — patterns', title: 'Patterns' },
  { key: 'graphicsPatterns', id: 'graphics-patterns', kind: 'graphics-cards', category: 'patterns', label: '16 — graphics · patterns', title: 'Patterns' },
  { key: 'branded', id: 'branded-assets', kind: 'branded', nav: 'Branded', label: '04 — branded', title: 'Branded assets' },
  { key: 'stationery', id: 'assets-stationery', kind: 'stationery', nav: 'Stationery', label: '08 — assets · stationery', title: 'Stationery', lede: 'Standard correspondence — business card, envelope, letterhead, email signature. Quiet typography, generous space, monochrome restraint.' },
  { key: 'labels', id: 'labels', nav: 'Labels', label: '09 — labels', title: 'Labels' },
  { key: 'packaging', id: 'packaging', nav: 'Packaging', label: '10 — packaging', title: 'Packaging' },
  { key: 'mockups', id: 'mockups', nav: 'Mockups', label: '11 — mockups', title: 'Mockups' },
  { key: 'social', id: 'social-sizes', kind: 'social', nav: 'Social', label: '12 — social · sizes', title: 'Post sizes', lede: 'One template at each of the three Instagram aspect ratios — square feed (1:1), portrait feed (4:5), and story / reel (9:16). Editorial photography, restrained typography, a deliberate cadence.' },
  { key: 'profile', id: 'social-profile', kind: 'profile', nav: 'Profile', label: '13 — social · profile', title: 'Profile', lede: 'Avatar treatment for profile pictures across platforms — round-cropped on burgundy, signature centered.' },
  { key: 'generators', id: 'generators', nav: 'Generators', label: '14 — generators', title: 'Generators' },
  { key: 'deck', id: 'slide-deck', nav: 'Slide deck', label: '15 — slide deck', title: 'Slide deck' },
]

/* the two pages, for a view switch */
export const BRAND_VIEWS = [
  { value: 'brand', label: 'Brand' },
  { value: 'assets', label: 'Assets' },
]

/** One page's sections for a manifest — the page's list on the guide's one model (guideBook.js), the empty ones dropped. */
export const brandSections = (brand, page = 'brand') => guideSections(brand, page === 'assets' ? ASSET_SECTIONS : BOOK_SECTIONS)

/** A page's rail / index entries — `[{ id, label }]`. */
export const brandToc = (brand, page) => guideToc(brand, page === 'assets' ? ASSET_SECTIONS : BOOK_SECTIONS)

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
