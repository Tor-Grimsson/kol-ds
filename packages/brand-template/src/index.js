/**
 * @kolkrabbi/kol-brand-template — the placeholder brand.
 *
 * The reference implementation of the brand manifest schema, filled with
 * OBVIOUSLY-DUMMY identity ("Norðurljós Vinnustofa"). Two jobs:
 *
 *   1. The SLATE — starting a new client brand? Copy this file into the
 *      client's repo as a local package, fill the fields, delete what you
 *      don't need. Every field is optional. Colors, type, and the seven-hue
 *      palette are the HOUSE defaults (see ./defaults.js) — a client declares
 *      only what differs and inherits the rest via `withHouseDefaults`.
 *      Per-client instances NEVER ship to public npm.
 *   2. The DEV FIXTURE — generic styleguide renderers (type specimens,
 *      swatches, spectrum grids) develop and preview against this brand.
 *
 * The identity below is a placeholder. The COLOR + TYPE come straight from the
 * house baseline — this fixture overrides only the identity binding (a
 * teal-forward accent, to read as visibly not-Kolkrabbi) to demonstrate the
 * "override only what differs" flow. The schema is the contract: see
 * ./schema.js. Generate the CSS with ./emit-css.js.
 */
import { defineBrand } from './schema.js'
import { withHouseDefaults } from './defaults.js'

export { defineBrand, validateBrand } from './schema.js'
export { draftFromScrape } from './adapter.js'
export {
  HOUSE, HOUSE_GREY, HOUSE_CREAM, HOUSE_HUES, HOUSE_TYPE, HOUSE_IDENTITY,
  RAMP_ORDER, withHouseDefaults,
} from './defaults.js'
export { emitBrandColorCss } from './emit-css.js'

/* The deltas this dummy client declares. Everything else — the 7 hue ramps,
 * cream, the fixed grey, the Right Grotesk + JetBrains Mono type — is inherited
 * from the house baseline. */
export const brand = defineBrand(withHouseDefaults({
  meta: {
    name: 'Norðurljós',
    nameShort: 'NLJ',
    legalName: 'Norðurljós Vinnustofa ehf.',
    tagline: 'Placeholder tagline — replace or delete.',
    founded: '2020',
    founder: 'Jóna Jónsdóttir',
    role: 'Founder · Designer',
    location: { city: 'Akureyri', country: 'Iceland', locShort: 'Akureyri · IS' },
    url: 'https://example.com',
    email: 'hello@example.com',
    socials: { instagram: 'nordurljos_', youtube: '@nordurljos' },
  },

  // Override ONLY the identity binding — inherit all seven house hue ramps,
  // cream, grey, and the type pair. Rebrand = these five lines.
  identity: {
    primary:       'teal-300',
    onPrimary:     'cream-100',
    primaryStrong: 'teal-400',
    secondary:     'orange-300',
    onSecondary:   'blue-500',
  },

  logos: [
    // { id: 'wordmark', name: 'Wordmark', file: './logos/wordmark.svg', use: 'Default lockup' },
  ],

  clearspace: { rule: 'Placeholder — e.g. clearspace equals the logomark height on all sides.' },

  stationery: { assets: [] },

  // Scraper-fed observed footprint (vs. meta = declared identity).
  presence: { site: 'https://example.com', pages: [], profiles: {}, feeds: [] },

  press: [],
  timeline: [
    { date: '2020', title: 'Studio founded', note: 'Placeholder milestone.' },
  ],
}))

export default brand
