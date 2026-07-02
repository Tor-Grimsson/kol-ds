/**
 * Color system — data + reasoning.
 *
 * Single source of truth for the /reference color surface. Two top-level
 * groups:
 *
 *   BRAND_COLORS_SECTIONS  — identity layer: aliases · hue ramps · cream · grey
 *   UI_COLORS_SECTIONS     — chrome layer:    surface · state · absolute ·
 *                            fg-* opacity primitives · fg-* class families
 *
 * Architecture: docs/kol-migration/locked/color-system.md
 *
 * Pattern (consumed by src/pages/Reference.jsx, mirrors typography.js):
 *   { id, label, title, intro, reasoning?, tables: [{ caption, columns, rows }] }
 *
 * `columns` is a string key resolved by COLOR_COLUMNS in Reference.jsx
 * (JSX render funcs can't live in pure data files; that's the bridge).
 */

/* ============================================================================
 * BRAND_RAMPS — shared definition consumed by Reference, Styleguide, Demo
 * ============================================================================ */

export const BRAND_RAMPS = [
  {
    id: 'brand-yellow', label: 'Yellow', anchor: 300,
    stops: [100, 200, 300, 400, 500],
    note: 'Pure-yellow lock — `#FF` red channel through all stops, no orange contamination.',
    rowNotes: {
      100: 'Lightest tint.',
      300: 'Anchor — saffron. Brand primary.',
      500: 'Deepest yellow before orange territory.',
    },
  },
  {
    id: 'brand-red', label: 'Red', anchor: 200,
    stops: [100, 200, 300, 400, 500],
    note: 'Rust / terracotta. Anchor at 200 (light side) per source refs.',
    rowNotes: {
      100: 'Light rust.',
      200: 'Anchor — rust / terracotta. Brand secondary.',
      500: 'Deepest rust.',
    },
  },
  {
    id: 'brand-blue', label: 'Blue', anchor: 400,
    stops: [100, 200, 300, 400, 500],
    note: 'Saturated steel descending into navy. Anchor at 400 — canonical brand navy.',
    rowNotes: {
      100: 'Saturated steel blue.',
      200: 'Bridge — saturated → desaturated.',
      400: 'Anchor — navy. Ink on brand-primary.',
      500: 'Deepest navy.',
    },
  },
  {
    id: 'brand-orange', label: 'Orange', anchor: 300,
    stops: [100, 200, 300, 400, 500],
    note: 'Hybrid hue lock — light tints + deep stops, no yellow lean at saturated mid.',
    rowNotes: {
      100: 'Light cream-orange.',
      300: 'Anchor — saturated orange.',
      500: 'Deepest orange.',
    },
  },
  {
    id: 'brand-teal', label: 'Teal', anchor: 300,
    stops: [100, 200, 300, 400, 500],
    note: 'Cool counterpoint to the warm dominant. Anchor at 300; tints derived from anchor.',
    rowNotes: {
      100: 'Light pastel teal.',
      300: 'Anchor — cool counterpoint to the warm dominant.',
      500: 'Deepest teal.',
    },
  },
  {
    id: 'cream', label: 'Cream',
    stops: [100, 200, 300, 400, 500],
    note: 'Utility neutral, no anchor.',
    rowNotes: {
      100: 'Lightest cream.',
    },
  },
  {
    id: 'grey', label: 'Greyscale',
    stops: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    note: 'Fixed 10-stop neutral (theme-independent) — the slide-deck scale. Theme-aware opaque greys use --kol-oq-*.',
    rowNotes: {
      50:  'Paper.',
      900: 'Ink. Page bg in dark mode.',
    },
  },
]

const HUE_RAMPS = BRAND_RAMPS.filter(r => r.id.startsWith('brand-'))
const CREAM_RAMP = BRAND_RAMPS.find(r => r.id === 'cream')
const GREY_RAMP  = BRAND_RAMPS.find(r => r.id === 'grey')

// Ramp ids stay semantic (brand-*/cream/grey) for filtering; token names follow
// the DS palette convention: hues + cream → --kol-color-*, grey stays fixed.
const rampTokenBase = (id) =>
  id.startsWith('brand-') ? id.replace('brand-', 'kol-color-')
  : id === 'cream'        ? 'kol-color-cream'
  : id /* grey — fixed deck scale, unchanged */

const rampToRows = (ramp) => ramp.stops.map(s => ({
  token: `--${rampTokenBase(ramp.id)}-${s}`,
  note:  ramp.rowNotes?.[s] || (s === ramp.anchor ? 'Anchor.' : ''),
}))

/* ============================================================================
 * Brand · aliases — semantic identity tokens (4 lines that drive the brand)
 * ============================================================================ */

const aliasRows = [
  { token: '--kol-accent-primary',      resolvesTo: '--kol-color-yellow-300', use: 'Dominant identity color (kicker, link, accent-tinted text)' },
  { token: '--kol-accent-on-primary',   resolvesTo: '--kol-color-blue-400',   use: 'Ink that goes on top of accent-primary' },
  { token: '--kol-accent-secondary',    resolvesTo: '--kol-color-red-200',    use: 'Secondary identity color' },
  { token: '--kol-accent-on-secondary', resolvesTo: '--kol-color-cream-100',  use: 'Ink that goes on top of accent-secondary' },
]

/* ============================================================================
 * UI · surface — page chrome, mode-flipping pairs
 * ============================================================================ */

const surfaceRows = [
  { token: '--kol-surface-primary',    light: '#FAFAFA', dark: '#121215', use: 'Page background' },
  { token: '--kol-surface-on-primary', light: '#121215', dark: '#FAFAFA', use: 'Text on page (text-auto)' },
  { token: '--kol-surface-secondary',  light: '#F2F2F2', dark: '#19191D', use: 'Raised surface (cards, panels)' },
  { token: '--kol-surface-tertiary',   light: '#FFFFFF', dark: '#0E0E11', use: 'Elevated tier' },
  { token: '--kol-surface-inverse',    light: '#0E0E11', dark: '#FCFBF8', use: 'Inverted panel (.bg-surface-inverse)' },
  { token: '--kol-surface-on-inverse', light: '#FCFBF8', dark: '#0E0E11', use: 'Text on inverse panel' },
]

/* ============================================================================
 * UI · state — error / warning / info / success
 * ============================================================================ */

const stateRows = [
  { state: 'error',   sample: 'Submission blocked', token: '--ui-error',   dark: '#B91C1C', light: '#DC2626', use: 'Destructive, blocking, invalid' },
  { state: 'warning', sample: 'Attention needed',   token: '--ui-warning', dark: '#EAB308', light: '#CA8A04', use: 'Caution, attention required' },
  { state: 'info',    sample: 'Heads up',           token: '--ui-info',    dark: '#1D4ED8', light: '#2563EB', use: 'Neutral system message' },
  { state: 'success', sample: 'Confirmed',          token: '--ui-success', dark: '#15803D', light: '#16A34A', use: 'Confirmation, completion' },
]

/* ============================================================================
 * UI · absolute — theme-invariant primitives
 * ============================================================================ */

const absoluteRows = [
  { token: '--kol-color-absolute-black', note: 'Strict black. Sunken role (e.g., marquee bg).' },
  { token: '--kol-color-absolute-white', note: 'Strict white. On-imagery cream button text.' },
]

/* ============================================================================
 * UI · fg-* opacity primitives — 14-stop foreground ramp
 *
 * --kol-fg-NN tokens are color-mix expressions over --kol-surface-on-primary;
 * they auto-flip on .bg-surface-inverse via the surface-context redeclaration
 * in kol-color.css. The ink-hierarchy descriptors (subtle/mute/meta/body/
 * strong/emphasis) live under typography — they alias these primitives.
 * ============================================================================ */

const fgPrimitiveRows = [
  { token: '--kol-fg-01', utility: 'text-fg-01 / bg-fg-01 / border-fg-01', use: 'Barely visible — texture, near-invisible washes' },
  { token: '--kol-fg-02', utility: 'text-fg-02 / bg-fg-02 / border-fg-02', use: 'Faint background tint' },
  { token: '--kol-fg-04', utility: 'text-fg-04 / bg-fg-04 / border-fg-04', use: 'Code block bg, very subtle fill' },
  { token: '--kol-fg-08', utility: 'text-fg-08 / bg-fg-08 / border-fg-08', use: 'Hairlines, dividers, default border (workhorse)' },
  { token: '--kol-fg-12', utility: 'text-fg-12 / bg-fg-12 / border-fg-12', use: 'Soft borders, hover-state bgs' },
  { token: '--kol-fg-16', utility: 'text-fg-16 / bg-fg-16 / border-fg-16', use: 'Faint elements, secondary borders' },
  { token: '--kol-fg-24', utility: 'text-fg-24 / bg-fg-24 / border-fg-24 (≈ text-subtle)', use: 'Disabled hints, lightest descriptor stop' },
  { token: '--kol-fg-32', utility: 'text-fg-32 / bg-fg-32 / border-fg-32',   use: 'Dim labels, quiet UI hints' },
  { token: '--kol-fg-40', utility: 'text-fg-40 / border-fg-40',                            use: 'Outline-button border' },
  { token: '--kol-fg-48', utility: 'text-fg-48 / bg-fg-48 / border-fg-48 (≈ text-meta)',   use: 'Labels, eyebrows, captions' },
  { token: '--kol-fg-64', utility: 'text-fg-64 / bg-fg-64 / border-fg-64 (≈ text-body)',   use: 'Running copy, link default' },
  { token: '--kol-fg-80', utility: 'text-fg-80 / bg-fg-80 / border-fg-80 (≈ text-strong)', use: 'Lede paragraphs, emphasized body, <strong>' },
  { token: '--kol-fg-88', utility: 'text-fg-88 / border-fg-88',                            use: 'Near-emphasis (rarely needed; prefer text-emphasis)' },
  { token: '--kol-fg-96', utility: 'text-fg-96',                                            use: 'Strong text just below full ink' },
]

/* Numeric-suffix class families — same NN suffix, different property prefix. */
const fgFamilyRows = [
  { property: 'text-fg-NN',   example: 'text-fg-08',   hover: 'hover:text-fg-08',   use: 'Foreground ink — paragraph color, link color, currentColor for icons' },
  { property: 'bg-fg-NN',     example: 'bg-fg-12',     hover: 'hover:bg-fg-12',     use: 'Surface tint — panel fills, chip bg, hover overlays' },
  { property: 'border-fg-NN', example: 'border-fg-08', hover: 'hover:border-fg-08', use: 'Borders, dividers, hairlines' },
]

/* ============================================================================
 * Section exports
 * ============================================================================ */

export const BRAND_COLORS_SECTIONS = [
  {
    id: 'brand-aliases',
    label: '01 — brand · aliases',
    title: 'Brand aliases',
    intro:
      "Semantic identity tokens. Pointers to ramp stops; consume these, not the " +
      "raw stops, for brand-tinted surfaces.",
    reasoning:
      "Edit these four lines to rebrand without touching any consumer. Pairs " +
      "(primary + on-primary, secondary + on-secondary) ensure ink-on-fill " +
      "contrast holds across the system.",
    tables: [
      { caption: 'Brand aliases', columns: 'alias', rows: aliasRows },
    ],
  },
  {
    id: 'brand-ramps',
    label: '02 — brand · ramps',
    title: 'Brand ramps',
    intro:
      "Five hue families × 5 stops each (100–500). Anchors marked in the Note " +
      "column. Hex values resolve live from kol-color.css — edit a token there, " +
      "this updates on next render.",
    reasoning:
      "Anchor positions vary per ramp (yellow at 300, red at 200, blue at 400) " +
      "— that's intentional, matching the source design references rather than " +
      "enforcing a symmetry rule. Stops are derived around the anchor, not " +
      "evenly distributed.",
    tables: [{
      caption: 'Brand hue ramps',
      columns: 'ramp',
      rows: HUE_RAMPS.flatMap(rampToRows),
    }],
  },
  {
    id: 'cream',
    label: '03 — brand · cream',
    title: 'Cream ramp',
    intro: "Utility neutral, no anchor. 5 stops (100–500).",
    tables: [
      { caption: 'Cream ramp', columns: 'ramp', rows: rampToRows(CREAM_RAMP) },
    ],
  },
  {
    id: 'grey',
    label: '04 — brand · greyscale',
    title: 'Greyscale',
    intro:
      "Fixed 10-stop neutral (theme-independent) — the slide-deck scale. " +
      "Carries the canvas (60%) and structural ink (30%) of the 60/30/10 ratio. " +
      "Theme-aware opaque greys use --kol-oq-*.",
    tables: [
      { caption: 'Greyscale', columns: 'ramp', rows: rampToRows(GREY_RAMP) },
    ],
  },
]

export const UI_COLORS_SECTIONS = [
  {
    id: 'surface',
    label: '05 — ui · surface',
    title: 'Surface',
    intro:
      "Mode-flipping surface tokens. Light/dark columns show the resolved value " +
      "at each theme.",
    reasoning:
      "Four tiers — primary (page), secondary (cards), tertiary (elevated), " +
      "inverse (flipped panel). Each ships with an on-* companion so contrast " +
      "is contractually paired. .bg-surface-inverse cascades the swap so child " +
      "components inherit inverted ink without re-resolving.",
    tables: [
      { caption: 'Surface', columns: 'surface', rows: surfaceRows },
    ],
  },
  {
    id: 'state',
    label: '06 — ui · state',
    title: 'State',
    intro:
      "System state colors. Mode-flipped (light column shows light-mode hex).",
    reasoning:
      "Deliberately disconnected from the brand ramps — UI states carry " +
      "universal semantic meaning (red = error, yellow = warning) external to " +
      "brand identity. Wiring them through brand colors would either " +
      "compromise the brand or produce weird states.",
    tables: [
      { caption: 'State', columns: 'state', rows: stateRows },
    ],
  },
  {
    id: 'absolute',
    label: '07 — ui · absolute',
    title: 'Absolute',
    intro:
      "Mode-invariant primitives. Don't participate in the surface flip contract.",
    tables: [
      { caption: 'Absolute', columns: 'ramp', rows: absoluteRows },
    ],
  },
  {
    id: 'fg-primitives',
    label: '08 — ui · opacity primitives',
    title: 'Opacity primitives (--kol-fg-NN)',
    intro:
      "14-stop numeric foreground ramp. Each token is a color-mix expression " +
      "over --kol-surface-on-primary, so opacity tokens auto-contrast-flip on " +
      ".bg-surface-inverse without re-declaration at consumer sites.",
    reasoning:
      "Numeric stops (01, 02, 04, 08, 12, 16, 24, 32, 40, 48, 64, 80, 88, 96) " +
      "are mechanical infrastructure — pick by precision (text-fg-08 for a " +
      "hairline divider, border-fg-12 for a soft panel edge). The 5-stop " +
      "ink-hierarchy descriptors (subtle / meta / body / strong / emphasis) " +
      "under Typography alias these primitives for text-only — pick those " +
      "when intent matters more than exact percentage. Two tiers ship: " +
      "standard (fg-NN, on primary surface) and inverse (fg-inverse-NN, on " +
      "inverse surface) plus an absolute tier (fg-absolute-NN, theme-" +
      "invariant black) for one-off use.",
    tables: [
      { caption: 'Numeric primitives — 14 stops, standard tier', columns: 'fg-primitives', rows: fgPrimitiveRows },
    ],
  },
  {
    id: 'fg-families',
    label: '09 — ui · opacity classes',
    title: 'Opacity class families',
    intro:
      "Three property prefixes, same numeric suffix. .text-fg-NN / .bg-fg-NN / " +
      ".border-fg-NN cover ink, fill, and stroke. Hover variants exist for all " +
      "three.",
    reasoning:
      "Three property prefixes — text / bg / border. Ring families " +
      "(numeric and descriptor) were retired 2026-04-30 along with the " +
      "broader bg/border descriptor cleanup. By usage audit: text-fg-* " +
      "(594 refs), border-fg-* (188 refs), bg-fg-* (184 refs) — the " +
      "workhorses of the entire chrome system.",
    tables: [
      { caption: 'Numeric class families', columns: 'fg-families', rows: fgFamilyRows },
    ],
  },
]
