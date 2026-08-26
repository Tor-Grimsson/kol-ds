import ContentMedia from './ContentMedia.jsx'
import ContentText from './ContentText.jsx'

/**
 * ContentCard — the card form of the content-card system. Variants differ in
 * text composition, media ratio, and the RULED box structure, all defaulted
 * from the live review (06-content-card-system.md §2/§3):
 *
 *   stack      media (own ratio) on top, text plate below  — default · article · work
 *   fill-card  the CARD is the ratio frame; media fills the remainder above
 *              the plate — catalog · print (the A4 cards)
 *   canvas     the card is the ratio frame; media fills it absolutely and the
 *              text plate floats on top — typeface (details over specimen)
 *
 * Padding spells the TOKENS (--kol-pad-card-{sm,md,lg} = 12/16/24), never a
 * literal. Passing `pad` overrides the plate padding with one token step
 * (named `pad`, not `size` — `size` is the ruled TEXT slot). Image-only cards
 * (print) pass no text slots and render no plate. Exotic chrome (drawers,
 * keylines, specimens) is consumer content through `media`.
 */

/* ruled defaults — defaults, not hardcodes; `ratio` stays overridable while
 * the A4 question is open (06-content-card-system.md §4). */
const RATIOS = {
  default: '1 / 1',
  catalog: '1 / 1.41421',
  print: '1 / 1.41421',
  article: '16 / 9',
  work: '3 / 4',
  typeface: '1 / 1.41421',
}

/* ruled box values per variant, verbatim from the §3 reference cards —
 * paddings in tokens: pad-card-sm 12 · pad-card-md 16 · pad-card-lg 24 */
const BOX = {
  default:  { layout: 'stack', border: 'var(--kol-fg-12)', bg: 'var(--kol-fg-02)', pad: 'var(--kol-pad-card-sm)' },
  catalog:  { layout: 'fill-card', border: 'var(--kol-fg-04)', bg: 'var(--kol-fg-04)', pad: 'var(--kol-pad-card-sm) var(--kol-pad-card-md)', plateTop: true, plateBg: 'var(--kol-surface-primary)' },
  print:    { layout: 'fill-card', border: null, bg: 'var(--kol-surface-secondary)', pad: 'var(--kol-pad-card-sm) var(--kol-pad-card-md)', plateTop: true },
  article:  { layout: 'stack', border: null, bg: null, pad: '0', mediaGap: 'var(--kol-spacing-4)' },
  /* work is a DRAWER: image-only at rest, and on hover a light plate rises
   * over the bottom of the artwork carrying the title + meta. This is the
   * shipped WorkCard and it was wrong to reject it as "hiding the title" — a
   * work shelf is a wall of images by design, and the caption is the reveal. */
  work:     { layout: 'drawer', border: 'var(--kol-fg-04)', bg: null, pad: 'var(--kol-pad-card-md)', padMd: 'var(--kol-pad-card-lg)' },
  /* typeface's card is a FIXED 500px tall specimen board, not a ratio — the
   * shipped item is `h-[500px]`, and a ratio re-crops the glyph at every
   * column width, which is the one thing a specimen must not do. */
  typeface: { layout: 'canvas', border: 'var(--kol-fg-08)', bg: 'var(--kol-surface-primary)', pad: 'var(--kol-pad-card-lg)', height: 500 },
}

/* HOVER is a bg STEP on the opaque tier, per 05-control-chrome.md's state model
 * — "interactive fills mix ink into the surface via the oq-* tier, never a
 * translucent fg-* wash", because a translucent fill over an image reads as the
 * control vanishing. article is the exception the shipped card already set: it
 * has no surface of its own to step, so it dims its title instead. */
const HOVER = {
  default:  'var(--kol-oq-04)',
  catalog:  'var(--kol-surface-tertiary)',
  print:    'var(--kol-oq-04)',
  /* article and work take NO surface hover, and that is a decision not a gap:
   * article has no surface of its own (its media frame steps its border
   * instead), and work's whole hover IS the drawer rising. A second wash under
   * either would be two answers to one question. */
  article:  null,
  work:     null,
  typeface: 'var(--kol-surface-inverse)',
}

/* per-variant media treatment. `ring` sits OVER the artwork, `frame` UNDER it —
 * see ContentMedia. print rings because an A4 print on a light page has no edge
 * of its own; article frames because its media is a 16/9 thumbnail that rarely
 * fills its box. */
const MEDIA = {
  /* zoom is for IMAGE-LED cards — where the artwork is the content and the
   * card is a frame around it. A catalog tile whose preview is a diagram, or
   * a default file card whose thumb is a 48px chip, gets nothing from it. */
  print:   { ring: true, zoom: true },
  work:    { zoom: true },
  /* ListingCard's card media steps its border on hover — fg-08 → fg-16 */
  article: { frame: true, borderHover: true, zoom: true },
}

export default function ContentCard({
  variant = 'default',
  pad,
  media,
  ratio,
  fit,
  frame,
  ring,
  zoom,
  control,
  actions,
  selected = false,
  onClick,
  href,
  onNavigate,
  className = '',
  ...text
}) {
  const box = BOX[variant] ?? BOX.default
  const r = ratio ?? RATIOS[variant]
  const padding = pad ? `var(--kol-pad-card-${pad})` : box.pad
  /* image-only cards (print) pass no text slots — the empty plate must not render */
  const hasText = ['title', 'body', 'kicker', 'detail', 'date', 'size', 'meta', 'tags'].some((k) => text[k] != null)
  /* `actions` sit IN THE TEXT PLATE, bottom-right (user ruling 2026-08-15:
   * *"space in text bottom right"*). Not stacked under the copy in their own
   * row — that grew the card — and not on the media, which was my call to make
   * and wasn't. The plate is one flex row: text takes the width, actions hold
   * the trailing edge, both bottom-aligned so the buttons sit on the last line
   * of copy rather than floating beside the title. */
  const hasPlate = hasText || actions != null
  const framed = box.border != null || box.bg != null

  const textNode = hasPlate ? (
    <div
      className="kol-card-plate relative"
      style={{
        '--kol-plate-pad': padding,
        '--kol-plate-pad-md': box.padMd,
        padding,
        marginTop: box.layout === 'stack' ? box.mediaGap : undefined,
        borderTop: box.plateTop ? '1px solid var(--kol-fg-04)' : undefined,
        background: box.layout === 'drawer' ? 'var(--kol-surface-inverse)' : box.plateBg,
        color: box.layout === 'drawer' ? 'var(--kol-fg-inverse)' : undefined,
        position: 'relative',
        zIndex: box.layout === 'canvas' ? 1 : undefined,
      }}
    >
      {hasText && <ContentText variant={variant} form="card" {...text} />}
      {/* ABSOLUTE, not a flex sibling: the plate's height moves with the title
        * and the meta, so a laid-out stack would stretch or drift with it. The
        * inset reads the SAME pad token the plate uses, so the icons sit the
        * same distance from the top and right edges as the copy does. */}
      {actions && (
        <div
          className="absolute flex"
          style={{ top: padding, bottom: padding, right: padding }}
        >
          {actions}
        </div>
      )}
    </div>
  ) : null

  /* The CARD clips its own corners when it is framed, so the media must not
   * round again — two radii on one edge is the visible double-round (user
   * ruling 2026-08-15). Unframed variants (`article`) have nothing clipping
   * them, so their media keeps its radius. The ROW is untouched: it does not
   * clip, so ContentRow's thumb rounds as before. */
  const mediaRadius = !framed
  const mediaProps = {
    radius: mediaRadius,
    fit: fit ?? MEDIA[variant]?.fit,
    frame: frame ?? MEDIA[variant]?.frame ?? false,
    ring: ring ?? MEDIA[variant]?.ring ?? false,
    borderHover: MEDIA[variant]?.borderHover ?? false,
    zoom: zoom ?? MEDIA[variant]?.zoom ?? false,
  }

  /* `control` — the in-frame control slot (user ruling 2026-08-15). One node,
   * placed in the media frame's corner by `.kol-frame-control` (kol-theme).
   * The CARD owns WHERE, the consumer owns WHAT: CopyButton, IconFrame with an
   * href, a select indicator — the card knows none of them by name. This is
   * what MediaCard hardcodes as a download link plus a select checkbox, and
   * the reason its media library could not migrate onto ContentCard. */
  const controlNode = control ? <div className="kol-frame-control">{control}</div> : null


  const body =
    box.layout === 'stack' ? (
      <>
        <div className="relative">
          <ContentMedia ratio={r} {...mediaProps}>{media}</ContentMedia>
          {controlNode}
        </div>
        {textNode}
      </>
    ) : box.layout === 'fill-card' ? (
      <>
        <div className="flex-1 min-w-0 relative overflow-hidden">
          <ContentMedia ratio={null} {...mediaProps}>{media}</ContentMedia>
          {controlNode}
        </div>
        {textNode}
      </>
    ) : box.layout === 'drawer' ? (
      <>
        <div className="relative h-full">
          <ContentMedia ratio={null} {...mediaProps}>{media}</ContentMedia>
          {controlNode}
        </div>
        {/* the plate is INVERSE and hidden until hover — `kol-card-drawer` owns
          * the reveal so the transition sits with the rest of the chrome */}
        {textNode && <div className="kol-card-drawer">{textNode}</div>}
      </>
    ) : (
      /* canvas — media fills the frame, plate floats on top */
      <>
        <div className="absolute" style={{ inset: 0 }}>
          <ContentMedia ratio={null} {...mediaProps}>{media}</ContentMedia>
          {controlNode}
        </div>
        {textNode}
      </>
    )

  /* THE ROOT FOLLOWS THE AFFORDANCE. A card that navigates must be a real <a>:
   * middle-click, cmd-click, focus order, "copy link address" and every screen
   * reader's link list all come from the tag, and none of them can be added
   * back with a click handler. `onNavigate` is the SPA seam — call it, and if
   * it does not preventDefault the browser follows the href, so the card works
   * with or without a router.
   *
   * A card with only onClick stays an <article> but becomes operable: a div you
   * can click and cannot focus is the single most common a11y regression in a
   * card family, and it is what every shipped variant here had. */
  const nav = (event) => {
    if (onNavigate) onNavigate(event, href)
    if (onClick) onClick(event)
  }
  const interactive = href || onClick
  const hoverBg = HOVER[variant]

  const common = {
    className: `kol-card group flex flex-col ${box.layout === 'drawer' ? 'relative overflow-hidden rounded-[var(--kol-radius-sm)]' : ''} ${framed ? 'overflow-hidden rounded-[var(--kol-radius-sm)]' : ''} ${box.border ? 'border' : ''} ${box.layout === 'canvas' ? 'relative' : ''} ${interactive ? 'cursor-pointer select-none' : ''} ${hoverBg && interactive ? 'kol-content-hover' : ''} ${className}`.trim(),
    style: {
      /* same reason as ContentRow: rest colours are PROPERTIES, because an
       * inline background/borderColor outranks the hover class and the step
       * would never render. */
      '--kol-card-bg': box.bg ?? undefined,
      '--kol-card-border': box.border ? (selected ? 'var(--kol-fg-64)' : box.border) : undefined,
      '--kol-content-hover-bg': hoverBg ?? undefined,
      aspectRatio: box.height ? undefined : (box.layout !== 'stack' ? r : undefined),
      height: box.height,
    },
  }

  if (href) {
    return <a href={href} onClick={nav} {...common}>{body}</a>
  }
  if (onClick) {
    return (
      <article
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
        {body}
      </article>
    )
  }
  return <article {...common}>{body}</article>
}
