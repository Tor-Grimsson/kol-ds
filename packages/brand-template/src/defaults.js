/**
 * House defaults — the baked KOL baseline every client brand starts from.
 *
 * The consolidation move: a client manifest should declare ONLY what differs
 * from the house. Grey, cream, the type families, and the seven-hue palette
 * are shared constants — a new client inherits them via `withHouseDefaults`
 * and overrides deltas (a hue, the identity binding, the type family).
 *
 * Provenance (read from the reasoned source-of-truth, 2026-07-09 brand scan):
 *   - Grey ramp        — copied VERBATIM across every manifest client
 *                        (`--grey-50 #FCFBFB … --grey-900 #131316`). Fixed,
 *                        theme-independent, the slide-deck neutral scale.
 *   - Hue ramps + cream — kol-website/apps/brand `data/color.js` (yellow, red,
 *                        blue, orange, teal) + kol-client-kolkrabbi's skeleton.
 *   - green / purple    — NEW house hues (5 stops, anchored), authored in-family
 *                        to complete the 7-hue set. Hexes provisional — confirm
 *                        against canonical refs before a client ships on them.
 *   - Type families     — Right Grotesk (PP) cuts + JetBrains Mono, the type of
 *                        every manifest client (source: apps/brand typography.js).
 *
 * These are DATA, not renderers. The emitter (`emit-css.js`) turns a merged
 * manifest into the kol-brand-color.css skeleton; the schema (`schema.js`) is
 * the contract they all conform to.
 */

/* ── Fixed neutral — copied verbatim everywhere. Rarely overridden. ────────── */
export const HOUSE_GREY = {
  id: 'grey', label: 'Greyscale',
  note: 'Fixed 10-stop neutral (theme-independent) — the slide-deck scale. Copied verbatim across every manifest client. Emits as --grey-NN, not --kol-color-*.',
  stops: [
    { stop: 50,  value: '#FCFBFB', note: 'Paper.' },
    { stop: 100, value: '#EBEBEB' },
    { stop: 200, value: '#DBDBDB' },
    { stop: 300, value: '#A3A3A4' },
    { stop: 400, value: '#5B5B5D' },
    { stop: 500, value: '#363639' },
    { stop: 600, value: '#2E2E30' },
    { stop: 700, value: '#242427' },
    { stop: 800, value: '#1B1B1E' },
    { stop: 900, value: '#131316', note: 'Ink. Page bg in dark mode.' },
  ],
}

/* ── Cream — utility neutral, project-flavored (house baseline = Kolkrabbi). ── */
export const HOUSE_CREAM = {
  id: 'cream', label: 'Cream',
  note: 'Utility neutral, no anchor. Project-flavored — override per client.',
  stops: [
    { stop: 100, value: '#FAF7F0', note: 'Lightest cream.' },
    { stop: 200, value: '#F5F0E6' },
    { stop: 300, value: '#F5EBD8' },
    { stop: 400, value: '#F0E0C0' },
    { stop: 500, value: '#EBD5A9' },
  ],
}

/* ── Seven hue families — the house palette. 5 stops each; anchors vary. ────── */
export const HOUSE_HUES = [
  {
    id: 'yellow', label: 'Yellow', anchor: 300,
    note: 'Pure-yellow lock — no orange contamination.',
    stops: [
      { stop: 100, value: '#FFEA57' },
      { stop: 200, value: '#FFDF43' },
      { stop: 300, value: '#FFCF33', note: 'Anchor — saffron.' },
      { stop: 400, value: '#FFBC1F' },
      { stop: 500, value: '#FFA113' },
    ],
  },
  {
    id: 'red', label: 'Red', anchor: 200,
    note: 'Rust / terracotta. Anchor at 200 (light side).',
    stops: [
      { stop: 100, value: '#CC7762' },
      { stop: 200, value: '#AD5038', note: 'Anchor — rust / terracotta.' },
      { stop: 300, value: '#913F2B' },
      { stop: 400, value: '#662C1E' },
      { stop: 500, value: '#522418' },
    ],
  },
  {
    id: 'blue', label: 'Blue', anchor: 400,
    note: 'Saturated steel into deep navy. Anchor at 400.',
    stops: [
      { stop: 100, value: '#497DA2' },
      { stop: 200, value: '#3F6485' },
      { stop: 300, value: '#314152' },
      { stop: 400, value: '#222D3D', note: 'Anchor — navy.' },
      { stop: 500, value: '#181F29' },
    ],
  },
  {
    id: 'orange', label: 'Orange', anchor: 300,
    note: 'Hybrid: light tints + canonical anchor at 300.',
    stops: [
      { stop: 100, value: '#F5CF81' },
      { stop: 200, value: '#E3A054' },
      { stop: 300, value: '#DF760B', note: 'Anchor — saturated orange.' },
      { stop: 400, value: '#A54209' },
      { stop: 500, value: '#7C2900' },
    ],
  },
  {
    id: 'teal', label: 'Teal', anchor: 300,
    note: 'Cool counterpoint to the warm dominant.',
    stops: [
      { stop: 100, value: '#9BCCCD' },
      { stop: 200, value: '#6FB6B7' },
      { stop: 300, value: '#49A0A2', note: 'Anchor — cool counterpoint.' },
      { stop: 400, value: '#387E7F' },
      { stop: 500, value: '#275A5B' },
    ],
  },
  {
    id: 'green', label: 'Green', anchor: 300,
    note: 'NEW house hue — foliage green, no yellow lean at mid. Hexes provisional.',
    stops: [
      { stop: 100, value: '#8FC2A1' },
      { stop: 200, value: '#5CA87B' },
      { stop: 300, value: '#2E8B57', note: 'Anchor — sea green.' },
      { stop: 400, value: '#1F6B41' },
      { stop: 500, value: '#14492C' },
    ],
  },
  {
    id: 'purple', label: 'Purple', anchor: 300,
    note: 'NEW house hue — royal violet, blue-leaning to sit beside blue. Hexes provisional.',
    stops: [
      { stop: 100, value: '#B49BD6' },
      { stop: 200, value: '#9370C4' },
      { stop: 300, value: '#6D48A8', note: 'Anchor — royal violet.' },
      { stop: 400, value: '#4E3080' },
      { stop: 500, value: '#341F57' },
    ],
  },
]

/* ── Type — Right Grotesk (PP) + JetBrains Mono. The house typeface pair. ──── */
export const HOUSE_TYPE = {
  families: [
    { token: '--kol-font-family-sans',         role: 'Sans body',                       cut: 'Right Grotesk',         weights: [300, 500, 700] },
    { token: '--kol-font-family-sans-narrow',  role: 'Sans top-of-scale (display, H1)', cut: 'Right Grotesk Narrow',  weights: [500, 700] },
    { token: '--kol-font-family-sans-compact', role: 'Sans mid (H2–H6, prose lede)',    cut: 'Right Grotesk Compact', weights: [400, 500, 700] },
    { token: '--kol-font-family-mono',         role: 'Mono everything',                 cut: 'JetBrains Mono',        weights: [400, 500, 600] },
  ],
  // Cuts declared @font-face for the house. Tier-canonical: base, narrow,
  // compact, mono. The rest load for expressive one-offs (Type Lab).
  cuts: [
    { family: 'Right Grotesk',         weights: '300 / 500 / 500i / 700 / 700i', use: 'Body, prose container' },
    { family: 'Right Grotesk Compact', weights: '100i / 400 / 400i / 500 / 700', use: 'Mid headings, prose lede' },
    { family: 'Right Grotesk Narrow',  weights: '500 / 700',                     use: 'Display, H1' },
    { family: 'Right Grotesk Tall',    weights: '400 / 500 / 700 / 900',         use: 'Expressive (Type Lab)' },
    { family: 'Right Grotesk Wide',    weights: '400 / 500 / 700 / 900',         use: 'Expressive (Type Lab)' },
    { family: 'Right Grotesk Spatial', weights: '300 / 400 / 500 / 700 / 900',   use: 'Expressive (Type Lab)' },
    { family: 'Right Grotesk Tight',   weights: '400 / 700',                     use: 'Expressive (Type Lab)' },
    { family: 'Right Grotesk Text',    weights: '400 / 500',                     use: 'Optical-grade body (reserved)' },
    { family: 'JetBrains Mono',        weights: '400 / 500 / 500i / 600',        use: 'Mono — body, helpers, prose code' },
  ],
}

/* ── The default identity binding — house baseline is the Kolkrabbi identity.
 * Role → ramp-stop shorthand ('{ramp}-{stop}'). A client overrides these lines
 * to rebrand; that's the whole "edit N lines" surface. ────────────────────── */
export const HOUSE_IDENTITY = {
  primary:       'yellow-300', // dominant identity color
  onPrimary:     'blue-400',   // ink on primary
  primaryStrong: 'yellow-400', // hover / active
  secondary:     'red-200',    // secondary identity color
  onSecondary:   'cream-100',  // ink on secondary
}

/** The full house baseline as a partial manifest — 7 hues + cream + grey,
 *  the type pair, and the default identity binding. */
export const HOUSE = {
  identity: HOUSE_IDENTITY,
  ramps: [...HOUSE_HUES, HOUSE_CREAM, HOUSE_GREY],
  type: HOUSE_TYPE,
}

/** Canonical output order for ramps: the seven hues, then cream, then grey. */
export const RAMP_ORDER = ['yellow', 'red', 'blue', 'orange', 'teal', 'green', 'purple', 'cream', 'grey']

const isObj = (v) => v != null && typeof v === 'object' && !Array.isArray(v)

/**
 * withHouseDefaults — merge the house baseline UNDER a client manifest so the
 * client only has to declare deltas. Idempotent (merging an already-merged
 * manifest changes nothing).
 *
 *   - ramps   : merged by `id`. A client ramp with a matching id REPLACES the
 *               house ramp; a new id is appended. So override 'yellow', or add
 *               'burgundy', and inherit the rest (incl. grey + cream).
 *   - type    : client `families` / `cuts` replace the house arrays if present.
 *   - identity: client keys override house keys (shallow).
 *   - meta / presence / press / timeline / logos / stationery: client-only,
 *               passed through untouched (no house default beyond empty).
 *
 * @param {object} manifest  a partial client manifest (deltas)
 * @returns {object} the merged manifest
 */
export function withHouseDefaults(manifest = {}) {
  const m = isObj(manifest) ? manifest : {}

  // ramps — union by id, client wins.
  const byId = new Map(HOUSE.ramps.map((r) => [r.id, r]))
  for (const r of Array.isArray(m.ramps) ? m.ramps : []) {
    if (r && r.id) byId.set(r.id, r)
  }

  return {
    ...m,
    identity: { ...HOUSE.identity, ...(isObj(m.identity) ? m.identity : {}) },
    ramps: [...byId.values()],
    type: {
      families: m.type?.families ?? HOUSE.type.families,
      cuts:     m.type?.cuts     ?? HOUSE.type.cuts,
      ...(m.type?.scale ? { scale: m.type.scale } : {}),
    },
  }
}
