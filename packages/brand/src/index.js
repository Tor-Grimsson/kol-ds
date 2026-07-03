/**
 * @kolkrabbi/kol-brand — Kolkrabbi's brand manifest.
 *
 * The first real instance of the brand manifest schema
 * (@kolkrabbi/kol-brand-template). Data ported from the canonical sources:
 * ramps/anchors from kol-brand-color.css (kol-framework), type families from
 * the theme typography reference, identity from the brand app's info registry,
 * logo SVGs from apps/brand — this package is now their published home.
 *
 * PUBLIC PACKAGE — carries public-appropriate facts only. Deliberately NOT
 * ported from the internal registries: personal identifiers (kennitala,
 * birthdate), street address, phone, and the person-scoped press/timeline
 * archive (kol-monorepo docs/kolkrabbi-info — internal, about the founder's
 * art/music practice, not the studio brand). Those fields stay empty or
 * studio-scoped here; fill deliberately if ever wanted in public.
 */
import { defineBrand } from '@kolkrabbi/kol-brand-template/schema'

export { validateBrand } from '@kolkrabbi/kol-brand-template/schema'

export const brand = defineBrand({
  meta: {
    name: 'Kolkrabbi',
    nameShort: 'KOL',
    legalName: 'Kolkrabbi Vinnustofa',
    founded: '2019',
    founder: 'Tór Grímsson',
    role: 'Founder · Designer',
    location: { city: 'Reykjavík', country: 'Iceland', locShort: 'Reykjavík · IS' },
    url: 'https://kolkrabbi.io',
    email: 'hello@kolkrabbi.io',
    socials: { instagram: 'kolkrabbi_', youtube: '@kolkrabbi-io', tiktok: 'kolkrabbi_' },
  },

  /* Semantic identity anchors — the four lines that drive the brand.
   * Literal values are the anchor-stop hexes from kol-brand-color.css. */
  colors: {
    anchors: [
      { token: '--kol-accent-primary', resolvesTo: '--kol-color-yellow-300', value: '#FFCF33', use: 'Dominant identity color (kicker, link, accent-tinted text)' },
      { token: '--kol-accent-on-primary', resolvesTo: '--kol-color-blue-400', value: '#222D3D', use: 'Ink that goes on top of accent-primary' },
      { token: '--kol-accent-secondary', resolvesTo: '--kol-color-red-200', value: '#AD5038', use: 'Secondary identity color' },
      { token: '--kol-accent-on-secondary', resolvesTo: '--kol-color-cream-100', value: '#FAF7F0', use: 'Ink that goes on top of accent-secondary' },
    ],
  },

  /* Five hue families × 5 stops + cream + grey — hex values verbatim from
   * kol-brand-color.css (the CSS stays the runtime source of truth; this is
   * the same data as portable facts). Anchor positions vary per ramp. */
  ramps: [
    {
      id: 'yellow', label: 'Yellow', anchor: 300,
      note: 'Pure-yellow lock — #FF red channel through all stops, no orange contamination.',
      stops: [
        { stop: 100, value: '#FFEA57' },
        { stop: 200, value: '#FFDF43' },
        { stop: 300, value: '#FFCF33', note: 'Anchor.' },
        { stop: 400, value: '#FFBC1F' },
        { stop: 500, value: '#FFA113' },
      ],
    },
    {
      id: 'orange', label: 'Orange', anchor: 300,
      stops: [
        { stop: 100, value: '#F5CF81' },
        { stop: 200, value: '#E3A054' },
        { stop: 300, value: '#DF760B', note: 'Anchor.' },
        { stop: 400, value: '#A54209' },
        { stop: 500, value: '#7C2900' },
      ],
    },
    {
      id: 'red', label: 'Red', anchor: 200,
      stops: [
        { stop: 100, value: '#CC7762' },
        { stop: 200, value: '#AD5038', note: 'Anchor.' },
        { stop: 300, value: '#913F2B' },
        { stop: 400, value: '#662C1E' },
        { stop: 500, value: '#522418' },
      ],
    },
    {
      id: 'blue', label: 'Blue', anchor: 400,
      note: 'Hybrid hue lock — light tints + deep stops, no yellow lean at saturated mid.',
      stops: [
        { stop: 100, value: '#497DA2' },
        { stop: 200, value: '#3F6485' },
        { stop: 300, value: '#314152' },
        { stop: 400, value: '#222D3D', note: 'Anchor.' },
        { stop: 500, value: '#181F29' },
      ],
    },
    {
      id: 'teal', label: 'Teal', anchor: 300,
      stops: [
        { stop: 100, value: '#9BCCCD' },
        { stop: 200, value: '#6FB6B7' },
        { stop: 300, value: '#49A0A2', note: 'Anchor.' },
        { stop: 400, value: '#387E7F' },
        { stop: 500, value: '#275A5B' },
      ],
    },
    {
      id: 'cream', label: 'Cream', anchor: 100,
      stops: [
        { stop: 100, value: '#FAF7F0', note: 'Anchor.' },
        { stop: 200, value: '#F5F0E6' },
        { stop: 300, value: '#F5EBD8' },
        { stop: 400, value: '#F0E0C0' },
        { stop: 500, value: '#EBD5A9' },
      ],
    },
    {
      id: 'grey', label: 'Grey', anchor: 500,
      stops: [
        { stop: 50, value: '#FCFBFB' },
        { stop: 100, value: '#EBEBEB' },
        { stop: 200, value: '#DBDBDB' },
        { stop: 300, value: '#A3A3A4' },
        { stop: 400, value: '#5B5B5D' },
        { stop: 500, value: '#363639', note: 'Anchor.' },
        { stop: 600, value: '#2E2E30' },
        { stop: 700, value: '#242427' },
        { stop: 800, value: '#1B1B1E' },
        { stop: 900, value: '#131316' },
      ],
    },
  ],

  /* Three sans cuts + one mono (theme typography reference). */
  type: {
    families: [
      { token: '--kol-font-family-sans', role: 'Sans body', cut: 'Right Grotesk (base)', weights: [400, 500] },
      { token: '--kol-font-family-sans-narrow', role: 'Sans top-of-scale (display, H1)', cut: 'Right Grotesk Narrow', weights: [500, 600] },
      { token: '--kol-font-family-sans-compact', role: 'Sans mid (H2–H6, prose lede)', cut: 'Right Grotesk Compact', weights: [500] },
      { token: '--kol-font-family-mono', role: 'Mono everything', cut: 'JetBrains Mono', weights: [400, 500] },
    ],
    scale: [
      { cls: '.kol-sans-display-01', family: 'sans-narrow', weight: 600 },
      { cls: '.kol-sans-display-02', family: 'sans-narrow', weight: 600 },
      { cls: '.kol-sans-heading-01', family: 'sans-narrow', weight: 500 },
      { cls: '.kol-sans-heading-02', family: 'sans-compact', weight: 500 },
      { cls: '.kol-sans-heading-03', family: 'sans-compact', weight: 500 },
      { cls: '.kol-sans-body-01', family: 'sans', weight: 400 },
      { cls: '.kol-mono-14', family: 'mono', weight: 400 },
    ],
  },

  /* Package-relative SVG assets (src/logos/) — importable via the
   * "./logos/*" export (Vite: append ?raw for the markup). */
  logos: [
    { id: 'logomark', name: 'Logomark', file: './logos/kol-logomark.svg', use: 'Square/compact contexts, avatars, favicons' },
    { id: 'wordmark', name: 'Wordmark', file: './logos/kol-wordmark.svg', use: 'Text-led contexts, headers' },
    { id: 'lockup-hori', name: 'Lockup · horizontal', file: './logos/kol-lockup-hori.svg', use: 'Default lockup, wide formats' },
    { id: 'lockup-vert', name: 'Lockup · vertical', file: './logos/kol-lockup-vert.svg', use: 'Stacked/narrow formats' },
  ],

  clearspace: { rule: 'Clearspace equals the logomark height on all sides of any lockup.' },

  stationery: { assets: [] },

  presence: {
    site: 'https://kolkrabbi.io',
    pages: [],
    profiles: {
      instagram: 'https://instagram.com/kolkrabbi_',
      youtube: 'https://youtube.com/@kolkrabbi-io',
      tiktok: 'https://tiktok.com/@kolkrabbi_',
    },
    feeds: [],
  },

  /* Studio-scoped public milestones only — the person-scoped press/timeline
   * archive is internal (see header note). */
  press: [],
  timeline: [
    { date: '2019', title: 'Kolkrabbi founded', note: 'Reykjavík design studio + type foundry.' },
    { date: '2026', title: 'KOL design system published', note: '@kolkrabbi/kol-* packages on npm.' },
  ],
})

export default brand
