import ContentMedia from './ContentMedia.jsx'
import ContentText from './ContentText.jsx'

/**
 * ContentRow — the row form of the content-card system: leading thumb (where
 * the variant has one) beside the ruled text. Box values — thumb size, gap,
 * padding, frame — default per variant to the RULED structures from the live
 * review (06-content-card-system.md §2 boxes): default is a bare table-like
 * line with a 48px thumb; catalog/print are framed between-headers with no
 * thumb; article rides a 120px 16:9 thumb; work a framed 64px row; typeface a
 * framed no-thumb block.
 *
 * @param {string}    variant   default | catalog | print | article | work | typeface
 * @param {ReactNode} media     thumb content (omit → placeholder)
 * @param {number|'fill'} thumb  thumb edge px — overrides the ruled default; 0 hides; `'fill'` = a square
 *                             the height of the row's content, whatever the rung (WorkListingRowsAndFilters)
 * @param {string}    ratio     thumb aspect-ratio — overrides the ruled default
 * @param {number}    paddingY  vertical padding px — overrides the ruled default
 * @param {boolean}   selected
 * @param {Function}  onClick
 * text slots + *Class seams forwarded to ContentText.
 */

/* ruled row boxes per variant (the §2 review) — paddings/gaps spell the
 * --kol-spacing-* tokens (2=8 · 3=12 · 4=16 · 6=24), never a literal */
const S2 = 'var(--kol-spacing-2)', S3 = 'var(--kol-spacing-3)', S4 = 'var(--kol-spacing-4)', S6 = 'var(--kol-spacing-6)'
const BOX = {
  default:  { thumb: 48,  ratio: '1 / 1',  pad: `${S2} 0`,     gap: S3, align: 'items-center', divider: true, hover: 'var(--kol-oq-04)' },
  /* catalog/print rows render AT 36px — the shipped GridCard list row is a
   * fixed 36 and the Y padding was what pushed it past that. X padding stays;
   * `minH` is now the whole height budget and the row centres inside it. */
  catalog:  { thumb: 0,   ratio: '1 / 1',  pad: `0 ${S3}`,     gap: S3, frame: 'var(--kol-fg-04)', bg: 'var(--kol-surface-tertiary)', minH: 36, align: 'items-center', hover: 'var(--kol-oq-04)' },
  print:    { thumb: 0,   ratio: '1 / 1',  pad: `0 ${S3}`,     gap: S3, frame: 'var(--kol-fg-04)', bg: 'var(--kol-surface-tertiary)', minH: 36, align: 'items-center', hover: 'var(--kol-oq-04)' },
  /* ListingCard's row thumb is `bg-fg-12` bare — a tint, no border. */
  /* article had NO hover of any kind — the only row in the family you could
   * point at and get nothing back. It has no surface of its own, so it takes
   * the lightest step there is. Its thumb zooms: on an article row the image
   * IS the subject. */
  article:  { thumb: 120, ratio: '1 / 1',  pad: '0',           gap: S6, align: 'items-start', thumbBg: 'var(--kol-fg-12)', hover: 'var(--kol-oq-02)' },
  /* work and typeface step UP at md — the shipped rows both do, and a work row
   * at a fixed 96 cannot hold the display-03 line it was ruled to carry. */
  /* RULED ON /work (WorkListingRowsAndFilters, 2026-08-27): min-height 168 ("div
   * 8"), 16 padding at every width ("16px padding, that's fine"), the thumb FILLS
   * the content height (136 in a 168 row) with no hairline, the frame steps
   * transparent → fg-08 on hover ("0 → 16 is a big jump"). No md step: the rows
   * were approved at their base values. */
  work:     { thumb: 'fill', ratio: '1 / 1', pad: S4, gap: S4, frame: 'transparent', frameHover: 'var(--kol-fg-08)', bg: 'var(--kol-surface-secondary)', minH: 168, align: 'items-stretch', thumbRadius: 'var(--kol-radius-xs)', thumbBorder: false },
  /* typeface's row is a COLUMN, not a line: a header (name/styles left,
   * classification/year right) with a full-width specimen band under it. The
   * shipped item is `flex-col gap-6`, and forcing it into the horizontal
   * thumb-beside-text shape is what turned its alphabet into a 160px thumb. */
  typeface: { thumb: 0,   ratio: '1 / 1',  pad: S6,            gap: S6, column: true, frame: 'var(--kol-fg-08)', bg: 'transparent', minH: 160, align: 'items-start', hover: 'color-mix(in srgb, var(--kol-surface-on-primary) 1%, transparent)', frameHover: 'color-mix(in srgb, var(--kol-surface-on-primary) 24%, transparent)' },
}

export default function ContentRow({
  variant = 'default',
  media,
  thumb,
  ratio,
  paddingY,
  actions,
  footer,
  selected = false,
  onClick,
  href,
  onNavigate,
  className = '',
  ...text
}) {
  const box = BOX[variant] ?? BOX.default
  const thumbPx = thumb ?? box.thumb
  const padY = (paddingY != null ? `${paddingY}px` : String(box.pad)).trim().split(/\s+/)[0]

  /* The md: STEP is a custom property, not a Tailwind variant. Tailwind cannot
   * generate `md:min-h-40` from package source (the SegmentedToggle rule), and
   * these values are per-variant data rather than markup, so the row publishes
   * `--kol-row-*` / `--kol-row-*-md` and one media query in kol-theme swaps
   * them. A variant with no md value publishes nothing and never steps. */
  const vars = {
    '--kol-row-pad': paddingY != null ? `${paddingY}px 0` : box.pad,
    '--kol-row-pad-md': box.padMd,
    '--kol-row-gap': box.gap,
    '--kol-row-gap-md': box.gapMd,
    '--kol-row-min-h': box.minH != null ? `${box.minH}px` : undefined,
    '--kol-row-min-h-md': box.minHMd != null ? `${box.minHMd}px` : undefined,
    /* `fill` = the rung minus the vertical padding — a definite number, not a
     * stretch (a min-height row has no definite cross size, so a stretched
     * aspect-ratio square resolved to the image's intrinsic width) */
    '--kol-row-thumb': thumbPx === 'fill' ? `calc(${box.minH ?? 96}px - 2 * ${padY})` : `${thumbPx}px`,
    '--kol-row-thumb-md': box.thumbMd != null ? `${box.thumbMd}px` : undefined,
    '--kol-content-hover-bg': box.hover,
    '--kol-content-hover-border': box.frameHover,
    /* rest values are PROPERTIES, not inline declarations — an inline
     * `background`/`borderColor` outranks every class, so the hover rules in
     * kol-theme could never win and no row hover fired at all. */
    '--kol-row-bg': selected ? 'var(--kol-fg-04)' : box.bg,
    '--kol-row-border': box.frame || undefined,
  }

  const nav = (event) => {
    if (onNavigate) onNavigate(event, href)
    if (onClick) onClick(event)
  }
  const interactive = href || onClick

  /* COLUMN rows stack their band under the text instead of laying a thumb
   * beside it — `footer` is that band, and it is a node because what goes in it
   * (a rendered alphabet, a waveform, a sparkline) is never the family's. */
  const inner = box.column ? (
    <>
      <ContentText variant={variant} form="row" className="w-full" {...text} />
      {footer}
    </>
  ) : (
    <>
      {(thumbPx === 'fill' || thumbPx > 0) && (
        /* THE THUMB IS A FIXED SQUARE BOX (ContentRowsAndPrintCard, user
         * 2026-08-27: "the image should not control height, image should fit
         * the row image placeholder") — `--kol-row-thumb` wide, square, at the
         * top of the row (`.kol-row > .kol-row-thumb` in kol-theme ≥0.63.0), the
         * media object-covers into it; row height = max(thumb, text). This
         * retires the 2026-08-15 fill-the-height ruling and the `thumbSquare`
         * exception it needed. Rows never zoom their thumb — cards keep theirs. */
        <div className={`kol-row-thumb shrink-0 self-start ${thumbPx === 'fill' ? 'is-fill' : ''}`.trim()}>
          <ContentMedia
            ratio={null}
            border={box.thumbBorder ?? false}
            bg={box.thumbBg}
            className={box.thumbRadius ? 'rounded-[var(--kol-radius-xs)]' : ''}
          >
            {media}
          </ContentMedia>
        </div>
      )}
      <ContentText variant={variant} form="row" className="flex-1" {...text} />
      {/* trailing edge, never in the text flow — MediaRow's placement */}
      {actions && <div className="shrink-0">{actions}</div>}
    </>
  )

  const common = {
    className: `kol-row group flex ${box.column ? 'flex-col' : ''} ${box.align} ${box.divider ? 'kol-row--divided' : ''} ${box.frame ? 'rounded-[var(--kol-radius-sm)] border' : ''} ${interactive ? 'cursor-pointer select-none' : ''} ${interactive && box.hover ? 'kol-content-hover' : ''} ${interactive && box.frameHover ? 'kol-content-hover-frame' : ''} ${className}`.trim(),
    style: vars,
  }

  /* same root-follows-the-affordance rule as ContentCard */
  if (href) return <a href={href} onClick={nav} {...common}>{inner}</a>
  if (onClick) {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return
          e.preventDefault()
          onClick(e)
        }}
        {...common}
      >
        {inner}
      </div>
    )
  }
  return <div {...common}>{inner}</div>
}
