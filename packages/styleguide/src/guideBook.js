/* The chapter model behind every brand page — kol-branding's src/template/book/brandBook.js (2026-10-24), carried for
 * `BrandGuide` (2026-10-27) and, since 0.11.0, the one model `BrandBook` and `BrandAssets` read too (the book had its own
 * `shows` and renderer beside this one; user 2026-10-28: two looks for one thing). A page is a chapter list — `BOOK_SECTIONS`,
 * `ASSET_SECTIONS`, kol-brand-template's `GUIDE_SECTIONS`, a client's own — merged with the manifest's `book`. The manifest
 * helpers (brandInfo, the stationery marks, the anchor scroll, the svg helpers) stay in ./brandBook.js. */

/* copy beyond the lede — what makes a specimen chapter worth drawing without its data (the brand book's rule, olina:
 * "their default lede is not enough to show empty frames") */
const hasBody = (s) => Boolean(s.blocks?.length || s.after?.length || s.rules?.length || s.spec || s.dos?.length || s.donts?.length || s.words || s.pairs?.length)
const hasCopy = (s) => Boolean(s.lede) || hasBody(s)

/* Whether a chapter has anything to show for this manifest. The specimen kinds need the data they draw or body copy;
 * a prose row shows with any copy, the lede included. */
export function shows(s, brand) {
  if (s.category) return Boolean(brand?.graphics?.[s.category]?.length)
  const kind = s.kind ?? 'prose'
  if (kind === 'hero' || kind === 'contents' || kind === 'branded' || kind === 'stationery') return true
  if (kind === 'logos-table') return Boolean(brand?.logos?.length)
  if (kind === 'logo' || kind === 'lockups') return Boolean(brand?.logos?.length) || hasBody(s)
  if (kind === 'color') return Boolean(brand?.ramps?.length) || hasBody(s)
  if (kind === 'typography') return Boolean(brand?.type?.families?.length) || hasBody(s)
  if (kind === 'social') return Boolean(brand?.social?.templates?.length) || hasBody(s)
  if (kind === 'profile') return Boolean(brand?.social?.avatars?.length) || hasBody(s)
  return hasCopy(s)
}

/** The guide's chapters for a manifest — the list's rows merged with `brand.book`, the empty ones dropped. */
export function guideSections(brand, sections = []) {
  const name = brand?.meta?.name
  return sections
    .map((d) => {
      const s = { ...d, ...(brand?.book?.[d.key] ?? {}) }
      if (d.kind === 'hero' && !s.title) s.title = name
      if (d.key === 'about' && !s.title && name) s.title = `About ${name}`
      return s
    })
    .filter((s) => shows(s, brand))
}

/** The rail's entries — `[{ id, label }]`. */
export const guideToc = (brand, sections) =>
  guideSections(brand, sections).filter((s) => s.nav).map((s) => ({ id: s.id, label: s.nav }))

/* The ramp stop a pair names (`teal-300`) → its hex, from the manifest's ramps. */
export function stopHex(brand, ref) {
  const m = /^(.*)-(\d+)$/.exec(ref ?? '')
  if (!m) return undefined
  return brand?.ramps?.find((r) => r.id === m[1])?.stops?.find((s) => String(s.stop) === m[2])?.value
}

/* WCAG 2 contrast ratio of two hexes — the number a color chapter's approved pairs carry. */
export function contrast(hexA, hexB) {
  const lum = (hex) => {
    const n = parseInt(hex.replace('#', ''), 16)
    const c = [16, 8, 0].map((sh) => ((n >> sh) & 255) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  }
  if (!hexA || !hexB) return undefined
  const [a, b] = [lum(hexA), lum(hexB)]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
