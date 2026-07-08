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

/* Inverse tier — married 1:1 to fg-NN. Same 14 stops, inked with
 * --kol-surface-on-inverse for painting ON the inverse surface. */
const fgInverseRows = [
  { token: '--kol-fg-inverse-01', utility: 'text-fg-inverse-01 / bg-fg-inverse-01 / border-fg-inverse-01', use: 'Barely visible — texture, near-invisible washes' },
  { token: '--kol-fg-inverse-02', utility: 'text-fg-inverse-02 / bg-fg-inverse-02 / border-fg-inverse-02', use: 'Faint background tint' },
  { token: '--kol-fg-inverse-04', utility: 'text-fg-inverse-04 / bg-fg-inverse-04 / border-fg-inverse-04', use: 'Code block bg, very subtle fill' },
  { token: '--kol-fg-inverse-08', utility: 'text-fg-inverse-08 / bg-fg-inverse-08 / border-fg-inverse-08', use: 'Hairlines, dividers, default border (workhorse)' },
  { token: '--kol-fg-inverse-12', utility: 'text-fg-inverse-12 / bg-fg-inverse-12 / border-fg-inverse-12', use: 'Soft borders, hover-state bgs' },
  { token: '--kol-fg-inverse-16', utility: 'text-fg-inverse-16 / bg-fg-inverse-16 / border-fg-inverse-16', use: 'Faint elements, secondary borders' },
  { token: '--kol-fg-inverse-24', utility: 'text-fg-inverse-24 / bg-fg-inverse-24 / border-fg-inverse-24', use: 'Disabled hints, lightest descriptor stop' },
  { token: '--kol-fg-inverse-32', utility: 'text-fg-inverse-32 / bg-fg-inverse-32 / border-fg-inverse-32', use: 'Dim labels, quiet UI hints' },
  { token: '--kol-fg-inverse-40', utility: 'text-fg-inverse-40 / bg-fg-inverse-40 / border-fg-inverse-40', use: 'Outline-button border' },
  { token: '--kol-fg-inverse-48', utility: 'text-fg-inverse-48 / bg-fg-inverse-48 / border-fg-inverse-48', use: 'Labels, eyebrows, captions' },
  { token: '--kol-fg-inverse-64', utility: 'text-fg-inverse-64 / bg-fg-inverse-64 / border-fg-inverse-64', use: 'Running copy, link default' },
  { token: '--kol-fg-inverse-80', utility: 'text-fg-inverse-80 / bg-fg-inverse-80 / border-fg-inverse-80', use: 'Lede paragraphs, emphasized body, <strong>' },
  { token: '--kol-fg-inverse-88', utility: 'text-fg-inverse-88 / bg-fg-inverse-88 / border-fg-inverse-88', use: 'Near-emphasis (rarely needed; prefer text-emphasis)' },
  { token: '--kol-fg-inverse-96', utility: 'text-fg-inverse-96 / bg-fg-inverse-96 / border-fg-inverse-96', use: 'Strong text just below full ink' },
]

/* Opaque neutrals — the solid mirror of fg-*. Same 14 stops, same ink,
 * mixed into the surface instead of into transparent (kol-opaque.css).
 * oq is a baked grey, not a transparency. */
const oqStandardRows = [
  { token: '--kol-oq-01', utility: 'text-oq-01 / bg-oq-01 / border-oq-01', use: 'Barely visible — texture, near-invisible washes' },
  { token: '--kol-oq-02', utility: 'text-oq-02 / bg-oq-02 / border-oq-02', use: 'Faint background tint' },
  { token: '--kol-oq-04', utility: 'text-oq-04 / bg-oq-04 / border-oq-04', use: 'Code block bg, very subtle fill' },
  { token: '--kol-oq-08', utility: 'text-oq-08 / bg-oq-08 / border-oq-08', use: 'Hairlines, dividers, default border (workhorse)' },
  { token: '--kol-oq-12', utility: 'text-oq-12 / bg-oq-12 / border-oq-12', use: 'Soft borders, hover-state bgs' },
  { token: '--kol-oq-16', utility: 'text-oq-16 / bg-oq-16 / border-oq-16', use: 'Faint elements, secondary borders' },
  { token: '--kol-oq-24', utility: 'text-oq-24 / bg-oq-24 / border-oq-24', use: 'Disabled hints, lightest descriptor stop' },
  { token: '--kol-oq-32', utility: 'text-oq-32 / bg-oq-32 / border-oq-32', use: 'Dim labels, quiet UI hints' },
  { token: '--kol-oq-40', utility: 'text-oq-40 / bg-oq-40 / border-oq-40', use: 'Outline-button border' },
  { token: '--kol-oq-48', utility: 'text-oq-48 / bg-oq-48 / border-oq-48', use: 'Labels, eyebrows, captions' },
  { token: '--kol-oq-64', utility: 'text-oq-64 / bg-oq-64 / border-oq-64', use: 'Running copy, link default' },
  { token: '--kol-oq-80', utility: 'text-oq-80 / bg-oq-80 / border-oq-80', use: 'Lede paragraphs, emphasized body, <strong>' },
  { token: '--kol-oq-88', utility: 'text-oq-88 / bg-oq-88 / border-oq-88', use: 'Near-emphasis (rarely needed; prefer text-emphasis)' },
  { token: '--kol-oq-96', utility: 'text-oq-96 / bg-oq-96 / border-oq-96', use: 'Strong text just below full ink' },
]

const oqInverseRows = [
  { token: '--kol-oq-inverse-01', utility: 'text-oq-inverse-01 / bg-oq-inverse-01 / border-oq-inverse-01', use: 'Barely visible — texture, near-invisible washes' },
  { token: '--kol-oq-inverse-02', utility: 'text-oq-inverse-02 / bg-oq-inverse-02 / border-oq-inverse-02', use: 'Faint background tint' },
  { token: '--kol-oq-inverse-04', utility: 'text-oq-inverse-04 / bg-oq-inverse-04 / border-oq-inverse-04', use: 'Code block bg, very subtle fill' },
  { token: '--kol-oq-inverse-08', utility: 'text-oq-inverse-08 / bg-oq-inverse-08 / border-oq-inverse-08', use: 'Hairlines, dividers, default border (workhorse)' },
  { token: '--kol-oq-inverse-12', utility: 'text-oq-inverse-12 / bg-oq-inverse-12 / border-oq-inverse-12', use: 'Soft borders, hover-state bgs' },
  { token: '--kol-oq-inverse-16', utility: 'text-oq-inverse-16 / bg-oq-inverse-16 / border-oq-inverse-16', use: 'Faint elements, secondary borders' },
  { token: '--kol-oq-inverse-24', utility: 'text-oq-inverse-24 / bg-oq-inverse-24 / border-oq-inverse-24', use: 'Disabled hints, lightest descriptor stop' },
  { token: '--kol-oq-inverse-32', utility: 'text-oq-inverse-32 / bg-oq-inverse-32 / border-oq-inverse-32', use: 'Dim labels, quiet UI hints' },
  { token: '--kol-oq-inverse-40', utility: 'text-oq-inverse-40 / bg-oq-inverse-40 / border-oq-inverse-40', use: 'Outline-button border' },
  { token: '--kol-oq-inverse-48', utility: 'text-oq-inverse-48 / bg-oq-inverse-48 / border-oq-inverse-48', use: 'Labels, eyebrows, captions' },
  { token: '--kol-oq-inverse-64', utility: 'text-oq-inverse-64 / bg-oq-inverse-64 / border-oq-inverse-64', use: 'Running copy, link default' },
  { token: '--kol-oq-inverse-80', utility: 'text-oq-inverse-80 / bg-oq-inverse-80 / border-oq-inverse-80', use: 'Lede paragraphs, emphasized body, <strong>' },
  { token: '--kol-oq-inverse-88', utility: 'text-oq-inverse-88 / bg-oq-inverse-88 / border-oq-inverse-88', use: 'Near-emphasis (rarely needed; prefer text-emphasis)' },
  { token: '--kol-oq-inverse-96', utility: 'text-oq-inverse-96 / bg-oq-inverse-96 / border-oq-inverse-96', use: 'Strong text just below full ink' },
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
      { caption: 'Inverse tier — married 1:1 to fg-NN, inked with --kol-surface-on-inverse', columns: 'fg-primitives', rows: fgInverseRows },
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
  {
    id: 'oq-primitives',
    label: '10 — ui · opaque neutrals',
    title: 'Opaque neutrals (--kol-oq-NN)',
    intro:
      "The solid mirror of the fg-* ramp (formerly the opacity-hex family, " +
      "renamed oq). Same 14 stops, same ink — mixed into the surface instead " +
      "of into transparent. oq is a baked grey, not a transparency: use it " +
      "when a fill must hide what's behind it (cover layers, chips over " +
      "media, filled-control hover states).",
    reasoning:
      "fg → color-mix(ink NN%, transparent) — alpha; the background bleeds " +
      "through. oq → color-mix(ink NN%, surface) — opaque; flattened onto " +
      "the surface. Married 1:1 per stop, and each tier carries its own " +
      "inverse twin, so the full neutral system is two married pairs sharing " +
      "one 14-stop scale. Auto-themes for free: both mix inputs flip in dark " +
      "mode, so there are no hardcoded light/dark blocks. Hover variants " +
      "exist for bg (hover:bg-oq-NN, hover:bg-oq-inverse-NN).",
    tables: [
      { caption: 'Standard tier — ink-on-primary flattened onto the primary surface', columns: 'fg-primitives', rows: oqStandardRows },
      { caption: 'Inverse tier — married 1:1 to oq-NN, flattened onto the inverse surface', columns: 'fg-primitives', rows: oqInverseRows },
    ],
  },
]
