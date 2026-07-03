/**
 * Brand manifest schema — THE contract of the brand-kit tier.
 *
 * The template conforms to it, the scraper feeds it, stationery consumes it,
 * the styleguide renders it. Everything else is a view of this shape.
 *
 * EVERY field is optional — "fill or leave empty" is a requirement of the
 * tier. Renderers must degrade gracefully on missing fields (gaps, not
 * crashes). Validation therefore only checks the TYPES of fields that are
 * present; it never demands presence.
 *
 * @typedef {Object} BrandLocation
 * @property {string} [city]
 * @property {string} [country]
 * @property {string} [locShort]   e.g. "Reykjavík · IS"
 *
 * @typedef {Object} BrandMeta
 * @property {string} [name]        display name, e.g. "Kolkrabbi"
 * @property {string} [nameShort]   e.g. "KOL"
 * @property {string} [legalName]   registered entity name
 * @property {string} [tagline]
 * @property {string} [founded]     year as string, e.g. "2019"
 * @property {string} [founder]     public display name
 * @property {string} [role]        founder's role line
 * @property {BrandLocation} [location]
 * @property {string} [url]         canonical site, e.g. "https://kolkrabbi.io"
 * @property {string} [email]       public contact address
 * @property {Object<string, string>} [socials]  platform → handle
 *
 * @typedef {Object} BrandColorAnchor
 * @property {string} [token]      semantic token, e.g. "--kol-accent-primary"
 * @property {string} [resolvesTo] ramp stop token it points at
 * @property {string} [value]      literal color, e.g. "#FFCF33"
 * @property {string} [use]        one-line usage note
 *
 * @typedef {Object} BrandRampStop
 * @property {number} [stop]       e.g. 300
 * @property {string} [value]      hex, e.g. "#FFCF33"
 * @property {string} [note]
 *
 * @typedef {Object} BrandRamp
 * @property {string} [id]         e.g. "yellow"
 * @property {string} [label]
 * @property {number} [anchor]     the anchor stop number
 * @property {string} [note]
 * @property {BrandRampStop[]} [stops]
 *
 * @typedef {Object} BrandTypeFamily
 * @property {string} [token]      e.g. "--kol-font-family-sans"
 * @property {string} [role]
 * @property {string} [cut]        e.g. "Right Grotesk Narrow"
 * @property {(number|string)[]} [weights]
 *
 * @typedef {Object} BrandTypeStyle
 * @property {string} [cls]        e.g. ".kol-sans-heading-01"
 * @property {string} [family]
 * @property {number} [weight]
 *
 * @typedef {Object} BrandLogo
 * @property {string} [id]         e.g. "wordmark"
 * @property {string} [name]
 * @property {string} [file]       package-relative path to the SVG asset
 * @property {string} [use]        when to use this mark
 *
 * @typedef {Object} BrandPressItem
 * @property {string} [date]       ISO-ish date or year
 * @property {string} [title]
 * @property {string} [outlet]
 * @property {string} [url]
 * @property {string} [note]
 *
 * @typedef {Object} BrandTimelineItem
 * @property {string} [date]
 * @property {string} [title]
 * @property {string} [note]
 *
 * @typedef {Object} BrandPresence   scraper-fed observed footprint (vs. meta = declared identity)
 * @property {string} [site]
 * @property {string[]} [pages]
 * @property {Object<string, string>} [profiles]  platform → url
 * @property {string[]} [feeds]
 *
 * @typedef {Object} BrandManifest
 * @property {BrandMeta} [meta]
 * @property {{ anchors?: BrandColorAnchor[] }} [colors]
 * @property {BrandRamp[]} [ramps]
 * @property {{ families?: BrandTypeFamily[], scale?: BrandTypeStyle[] }} [type]
 * @property {BrandLogo[]} [logos]
 * @property {{ rule?: string }} [clearspace]
 * @property {{ assets?: Array<{ id?: string, name?: string, file?: string }> }} [stationery]
 * @property {BrandPresence} [presence]
 * @property {BrandPressItem[]} [press]
 * @property {BrandTimelineItem[]} [timeline]
 */

/** Type anchor — returns the manifest unchanged; exists so instances get the
 *  BrandManifest JSDoc type and editors autocomplete the fields.
 *  @param {BrandManifest} manifest
 *  @returns {BrandManifest} */
export const defineBrand = (manifest) => manifest

/* validateBrand — shape check for the fields that ARE present. Returns
 * { ok, problems }; never fails on absence (every field is optional). */
const isStr = (v) => typeof v === 'string'
const isArr = Array.isArray
const isObj = (v) => v != null && typeof v === 'object' && !isArr(v)

export function validateBrand(m) {
  const problems = []
  const check = (cond, msg) => { if (!cond) problems.push(msg) }

  if (!isObj(m)) return { ok: false, problems: ['manifest is not an object'] }

  if (m.meta !== undefined) check(isObj(m.meta), 'meta must be an object')
  if (m.meta?.socials !== undefined) check(isObj(m.meta.socials), 'meta.socials must be an object map')
  if (m.colors !== undefined) check(isObj(m.colors), 'colors must be an object')
  if (m.colors?.anchors !== undefined) check(isArr(m.colors.anchors), 'colors.anchors must be an array')
  if (m.ramps !== undefined) {
    check(isArr(m.ramps), 'ramps must be an array')
    for (const r of isArr(m.ramps) ? m.ramps : []) {
      if (r.stops !== undefined) check(isArr(r.stops), `ramp ${r.id ?? '?'}: stops must be an array`)
      for (const s of isArr(r.stops) ? r.stops : []) {
        if (s.value !== undefined) check(isStr(s.value), `ramp ${r.id ?? '?'} stop ${s.stop}: value must be a string`)
      }
    }
  }
  if (m.type !== undefined) check(isObj(m.type), 'type must be an object')
  if (m.type?.families !== undefined) check(isArr(m.type.families), 'type.families must be an array')
  if (m.type?.scale !== undefined) check(isArr(m.type.scale), 'type.scale must be an array')
  if (m.logos !== undefined) check(isArr(m.logos), 'logos must be an array')
  if (m.clearspace !== undefined) check(isObj(m.clearspace), 'clearspace must be an object')
  if (m.stationery !== undefined) check(isObj(m.stationery), 'stationery must be an object')
  if (m.presence !== undefined) check(isObj(m.presence), 'presence must be an object')
  if (m.press !== undefined) check(isArr(m.press), 'press must be an array')
  if (m.timeline !== undefined) check(isArr(m.timeline), 'timeline must be an array')

  return { ok: problems.length === 0, problems }
}
