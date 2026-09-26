/**
 * typeSpecimen — the brand book's Typography chapter as data.
 *
 * kol-olina's apps/brand `data/typography.js`, verbatim, minus its two brand-specific tables: the
 * FAMILIES come from the manifest (`type.families`, `type.note`), and the cuts table was never
 * rendered by the chapter. Everything else describes the KOL type system — classes, prose, the mono
 * split, the reading hierarchy — which every brand on the system shares, because its type rides the
 * family tokens.
 */

const sansDisplayRows = [
  { cls: '.kol-sans-display-01', tokenName: '--kol-text-display-01', family: 'sans-narrow', weight: 600 },
  { cls: '.kol-sans-display-02', tokenName: '--kol-text-display-02', family: 'sans-narrow', weight: 600 },
]

const sansHeadingRows = [
  { cls: '.kol-sans-heading-01', tokenName: '--kol-text-heading-01', family: 'sans-narrow',  weight: 500 },
  { cls: '.kol-sans-heading-02', tokenName: '--kol-text-heading-02', family: 'sans-compact', weight: 500 },
  { cls: '.kol-sans-heading-03', tokenName: '--kol-text-heading-03', family: 'sans-compact', weight: 500 },
  { cls: '.kol-sans-heading-04', tokenName: '--kol-text-heading-04', family: 'sans-compact', weight: 500 },
  { cls: '.kol-sans-heading-05', tokenName: '--kol-text-heading-05', family: 'sans-compact', weight: 500 },
]

const sansBodyRows = [
  { cls: '.kol-sans-body-01', tokenName: '--kol-text-body-01', family: 'sans (base)', weight: 400 },
  { cls: '.kol-sans-body-02', tokenName: '--kol-text-body-02', family: 'sans (base)', weight: 400 },
  { cls: '.kol-sans-body-03', tokenName: '--kol-text-body-03', family: 'sans (base)', weight: 400 },
]

const proseRows = [
  { role: 'Display',     class: '.kol-prose-display',        family: 'sans-narrow',  weight: 500 },
  { role: 'Display (md)',class: '.kol-prose-display-md',     family: 'sans-narrow',  weight: 500 },
  { role: 'Title',       class: '.kol-prose-title',          family: 'sans-narrow',  weight: 500 },
  { role: 'H1',          class: '.kol-prose h1',             family: 'sans-narrow',  weight: 500, tokenName: '--kol-text-heading-01' },
  { role: 'H2',          class: '.kol-prose h2',             family: 'sans-compact', weight: 400, tokenName: '--kol-text-heading-03' },
  { role: 'H3',          class: '.kol-prose h3',             family: 'sans-compact', weight: 400, tokenName: '--kol-text-heading-04' },
  { role: 'H4',          class: '.kol-prose h4',             family: 'sans-compact', weight: 400, tokenName: '--kol-text-heading-05' },
  { role: 'H5',          class: '.kol-prose h5',             family: 'sans-compact', weight: 500, tokenName: '--kol-text-heading-06' },
  { role: 'H6',          class: '.kol-prose h6',             family: 'sans-compact', weight: 500, tokenName: '--kol-text-heading-06' },
  { role: 'Lede',        class: '.kol-prose-lede',           family: 'sans-compact', weight: 400 },
  { role: 'Tagline',     class: '.kol-prose-tagline',        family: 'sans-narrow',  weight: 500 },
  { role: 'Body',        class: '.kol-prose p',              family: 'sans (base)',  weight: 300 },
  { role: 'Quote',       class: '.kol-prose blockquote p',   family: 'sans (base)',  weight: 600 },
  { role: 'Cite',        class: '.kol-prose blockquote cite',family: 'sans (base)',  weight: 500 },
  { role: 'Label',       class: '.kol-prose-label',          family: 'mono',         weight: 500 },
  { role: 'Code (inline)',class: '.kol-prose code',          family: 'mono',         weight: 400 },
  { role: 'Code (block)', class: '.kol-prose pre',           family: 'mono',         weight: 400 },
]

const monoRows = [
  { cls: '.kol-mono-20', size: 20, lh: 26, weight: 400, ls: 'normal' },
  { cls: '.kol-mono-16', size: 16, lh: 22, weight: 400, ls: 'normal' },
  { cls: '.kol-mono-14', size: 14, lh: 18, weight: 400, ls: 'normal' },
  { cls: '.kol-mono-12', size: 12, lh: 16, weight: 400, ls: 'normal' },
  { cls: '.kol-mono-10', size: 10, lh: 14, weight: 400, ls: 'normal' },
  { cls: '.kol-mono-8',  size:  8, lh: 12, weight: 400, ls: 'normal' },
]

const helperRows = [
  { cls: '.kol-helper-20', size: 20, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.kol-helper-16', size: 16, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.kol-helper-14', size: 14, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.kol-helper-12', size: 12, lh: '1', weight: 500, ls: '0.06em' },
  { cls: '.kol-helper-10', size: 10, lh: '1', weight: 500, ls: '0.10em' },
  { cls: '.kol-helper-8',  size:  8, lh: '1', weight: 500, ls: '0.10em' },
]

const opacityDescriptorRows = [
  { name: 'subtle',   pct: 24,  token: '--kol-fg-subtle',   role: 'Dividers, disabled hints, faintest visible' },
  { name: 'meta',     pct: 48,  token: '--kol-fg-meta',     role: 'Labels, eyebrows, captions' },
  { name: 'body',     pct: 64,  token: '--kol-fg-body',     role: 'Running copy, links' },
  { name: 'strong',   pct: 80,  token: '--kol-fg-strong',   role: 'Emphasized body, <strong>' },
  { name: 'emphasis', pct: 100, token: '--kol-fg-emphasis', role: 'Headings, max ink' },
]

const SYSTEM_SECTIONS = [
  {
    id: 'sans-atomic',
    title: 'Sans atomic classes',
    intro:
      "Display, heading, body — explicit per-element classes for chrome / " +
      "page sections. Distinct from .kol-prose, which cascades into HTML " +
      "elements for rich-text containers.",
    reasoning:
      "Numbered tokens (01–06), not t-shirt sizes. Numbers describe a fixed " +
      "position in the scale (01 = anchor, ascending = smaller); t-shirt names " +
      "carry no ordering, you have to remember which is bigger. 01 = largest " +
      "follows HTML's H1 = biggest convention. Class prefix is family-first " +
      "(.kol-sans-) to mirror mono naming and read naturally — \"the sans " +
      "system, display role, stop 01\". H1 uses Narrow (condensed for impact); " +
      "H2–H5 use Compact (slightly wider, mid-tier); body uses base. Atomic body " +
      "weight is 400 (regular) for chrome; prose body is 300 (light) for " +
      "editorial reading copy — different defaults per context.",
    rows: [...sansDisplayRows, ...sansHeadingRows, ...sansBodyRows],
  },
  {
    id: 'prose',
    title: 'Prose container',
    intro:
      ".kol-prose is a rich-text container that cascades to native HTML " +
      "elements (h1–h6, p, ul, blockquote, code, pre). Wrap CMS / blog / " +
      "markdown output in it; the container styles every element via " +
      "descendant selectors.",
    reasoning:
      "H2 intentionally skips heading-02 (40px) and uses heading-03 (32px). " +
      "48 → 40 reads as \"same family\"; 48 → 32 reads as \"structural break\" " +
      "— better visual rhythm at H1 → H2. H6 ships uppercase with tracking " +
      "by default since H6 is rare and benefits from a label-like rendering. " +
      "Code (inline + block) consumes the mono token so a future swap cascades " +
      "into prose code automatically.",
    rows: proseRows,
  },
  {
    id: 'mono',
    title: 'Mono',
    intro:
      "JetBrains Mono. Two scales at the same px stops, distinguished by " +
      "intent + visual weight. .kol-mono-N for multi-line body / values " +
      "(weight 400, with leading). .kol-helper-N for single-line labels " +
      "(weight 500, line-height 1, letter-spaced).",
    reasoning:
      "Same px size, different weight = visible hierarchy without size-jumps. " +
      "Common pattern: a label sits above a control or value at the same stop " +
      "— label is helper (medium), control text is mono (regular). Both 12px, " +
      "but the label \"reads first\" by weight. Tight UI grids stay compact " +
      "without further compressing sizes. Px-literal suffixes (10/12/14/16/20) " +
      "instead of numbered indices because mono is utility chrome where exact " +
      "px matters — the number IS the value, no decoder ring. Wider letter-" +
      "spacing (0.10em) on the smallest two stops is a typographic principle: " +
      "sub-12px mono needs more tracking to stay legible.",
    rows: [...monoRows, ...helperRows],
  },
  {
    id: 'opacity',
    title: 'Reading hierarchy (descriptors)',
    intro:
      "Five-stop ink hierarchy: subtle / meta / body / strong / emphasis. " +
      "Aliases over the numeric --kol-fg-NN ramp (UI Colors / Opacity " +
      "primitives). Pick descriptors when intent matters; pick numeric stops " +
      "when exact percentage matters. Text-only — bg / border / ring " +
      "descriptor families retired 2026-04-30 (consumers used numeric stops).",
    reasoning:
      "Five stops anchor the typography reading hierarchy. The retired " +
      "`mute` (32%) sat awkwardly between subtle (24%, dividers) and meta " +
      "(48%, labels) and had zero component consumers. Descriptors are now " +
      "text-only — for surface tints, borders, and rings, reach for the " +
      "numeric --kol-fg-NN family (bg-fg-08, border-fg-12, etc.).",
    rows: opacityDescriptorRows,
  },
]

/** The chapter's sections for a manifest: its families first (when it declares any), then the
 *  system's. `[{ id, title, intro, reasoning?, rows }]` */
export function typeSections(brand) {
  const families = brand?.type?.families ?? []
  const head = families.length ? [{
    id: 'sans-families',
    title: 'Family tokens',
    intro:
      "Three sans cuts and one mono. Edit a family token to swap any cut " +
      "without touching consumers.",
    reasoning: brand?.type?.note,
    rows: families.map(({ token, role, cut }) => ({ token, role, cut })),
  }] : []
  return [...head, ...SYSTEM_SECTIONS]
}
