/**
 * @kolkrabbi/kol-brand-template — the placeholder brand.
 *
 * The reference implementation of the brand manifest schema, filled with
 * OBVIOUSLY-DUMMY data ("Norðurljós Vinnustofa"). Two jobs:
 *
 *   1. The SLATE — starting a new client brand? Copy this file into the
 *      client's repo as a local package, fill the fields, delete what you
 *      don't need. Every field is optional; nothing here is required.
 *      Per-client instances NEVER ship to public npm.
 *   2. The DEV FIXTURE — generic styleguide renderers (type specimens,
 *      swatches, spectrum grids) develop and preview against this brand.
 *
 * Values below are placeholders, not recommendations. The schema is the
 * contract: see ./schema.js (re-exported here).
 */
import { defineBrand } from './schema.js'

export { defineBrand, validateBrand } from './schema.js'
export { draftFromScrape } from './adapter.js'

export const brand = defineBrand({
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

  colors: {
    anchors: [
      { token: '--brand-accent-primary', value: '#5B8DEF', use: 'Dominant identity color' },
      { token: '--brand-accent-on-primary', value: '#0E1220', use: 'Ink on top of accent-primary' },
    ],
  },

  ramps: [
    {
      id: 'blue', label: 'Blue', anchor: 300,
      note: 'Placeholder ramp — five stops, anchor at 300.',
      stops: [
        { stop: 100, value: '#C8D9FA' },
        { stop: 200, value: '#8FB1F5' },
        { stop: 300, value: '#5B8DEF', note: 'Anchor.' },
        { stop: 400, value: '#3465C4' },
        { stop: 500, value: '#1F4187' },
      ],
    },
    {
      id: 'grey', label: 'Grey', anchor: 500,
      stops: [
        { stop: 100, value: '#EDEDEF' },
        { stop: 300, value: '#A5A5AA' },
        { stop: 500, value: '#38383D', note: 'Anchor.' },
        { stop: 700, value: '#232327' },
        { stop: 900, value: '#121215' },
      ],
    },
  ],

  type: {
    families: [
      { token: '--brand-font-family-sans', role: 'Sans everything', cut: 'Placeholder Sans', weights: [400, 500, 600] },
      { token: '--brand-font-family-mono', role: 'Mono details', cut: 'Placeholder Mono', weights: [400] },
    ],
    scale: [
      { cls: '.brand-display', family: 'sans', weight: 600 },
      { cls: '.brand-heading', family: 'sans', weight: 500 },
      { cls: '.brand-body', family: 'sans', weight: 400 },
      { cls: '.brand-mono', family: 'mono', weight: 400 },
    ],
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
})

export default brand
