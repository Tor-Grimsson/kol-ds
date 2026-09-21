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
 * EXPANDED (2026-08-26, the GridCard retirement): a fill-card variant with
 * `expanded` grows to a 2×2 cell — `grid-column / grid-row: span 2`, no
 * ratio — and flips to a ROW: media on the right at 50%, `expandedContent`
 * (the info field + button the consumer authors) on the left in a lg-padded,
 * space-between column. Verbatim the 2×2 GridCard shipped; without it the
 * three GridCard repos could not swap. Neighbour-hiding stays consumer-side.
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
  file: '1 / 1',
  slide: '16 / 9', /* a deck is a 1920×1080 stage (slide-variant-and-shelf-preset, 2026-09-03) */
  catalog: '1 / 1.41421',
  article: '16 / 9',
  showcase: '3 / 4',
  showcaseCanvas: '1 / 1.41421',
}

/* ruled box values per variant, verbatim from the §3 reference cards —
 * paddings in tokens: pad-card-sm 12 · pad-card-md 16 · pad-card-lg 24 */
const BOX = {
  /* no border (ColumnBrowser round, user 2026-08-27: "I don't like the border, I feel
   * like I've said that before" — the ListingCardThumbBorder ruling): the selected
   * state reads from the checked ToggleCheckbox, not a fg-64 border */
  file:  { layout: 'stack', border: null, bg: 'var(--kol-fg-02)', pad: 'var(--kol-pad-card-sm)' },
  /* SLIDE (slide-variant-and-shelf-preset, kol-client-olina 2026-09-03; user: "they are genuinely
   * different with 16:9 layout and those exposed properties"): file's stack — cover on top, the
   * plate below — on the PAGE'S surface, rest and hover (olina's /slide-deck, read off the render).
   * The plate is not a tone (user: "no just controls"); it is this kind's colour. */
  slide: { layout: 'stack', border: null, bg: 'var(--kol-surface-primary)', pad: 'var(--kol-pad-card-sm)' },
  /* THE FRAME READS BACKWARDS (CatalogCardFrameAndZoom, kol-website 2026-08-28 — user, on a 212-tile
   * grid: no frame at rest; the old rest value is the hover): a wall of fg-04 frames is a grid of boxes,
   * louder than what they hold. Rest `transparent` (the 1px stays, so the hover step never relayouts),
   * hover fg-04. Was fg-04 → fg-16 (ShellHomeSystem, 2026-08-27). */
  catalog:  { layout: 'fill-card', border: 'transparent', bg: 'var(--kol-fg-04)', pad: 'var(--kol-pad-card-sm) var(--kol-pad-card-md)', plateTop: true, plateBg: 'var(--kol-surface-primary)', frameHover: 'var(--kol-fg-04)' },
  /* flip: PrintGridCard's 3D turn on `isFlipped` → `selected` (ContentRowsAndPrintCard, 2026-08-27) */
  article:  { layout: 'stack', border: null, bg: null, pad: '0', mediaGap: 'var(--kol-spacing-4)' },
  /* work is a DRAWER: image-only at rest, and on hover a light plate rises
   * over the bottom of the artwork carrying the title + meta. This is the
   * shipped WorkCard and it was wrong to reject it as "hiding the title" — a
   * work shelf is a wall of images by design, and the caption is the reveal. */
  showcase: { layout: 'drawer', border: 'var(--kol-fg-04)', bg: null, pad: 'var(--kol-pad-card-md)', padMd: 'var(--kol-pad-card-lg)' },
  /* typeface's card is a FIXED 500px tall specimen board, not a ratio — the
   * shipped item is `h-[500px]`, and a ratio re-crops the glyph at every
   * column width, which is the one thing a specimen must not do. */
  /* REST COLOURS ONLY, TAKEN FROM THE ROW (TypefaceCardRestSkinFix, kol-website
   * 2026-08-30). Filled surface, no outline — `ContentRow`'s showcase pair.
   *
   * 0.140.0 copied `BOX.showcase` from THIS map instead, because it is the
   * entry sitting next to this one. That was wrong: `showcase`'s CARD is a
   * `drawer` — outlined and unfilled — and the ask was to match the ROW, which
   * is filled with no outline. Every /foundry grid card shipped as an outlined
   * empty box, the opposite of the rows beside it.
   *
   * "Make the card look like the row" means READ THE ROW'S BOX. The two maps
   * share variant names and not treatments.
   *
   * `layout`, `pad`, `height`, the RATIO, REVEAL_BG, MEDIA and every
   * hover treatment are untouched and deliberately different.
   *
   * NOT derived with a spread. The row's version of this ask was resolved that
   * way and it carried pad and rung along uninvited, then missed `FILL` because
   * it is keyed by variant NAME — a second ticket to undo. `RATIO`, `REVEAL_BG`
   * and `MEDIA` here are separate name-keyed maps too; a spread cannot reach
   * them either. Two values, set by hand. */
  showcaseCanvas: { layout: 'canvas', border: 'transparent', bg: 'var(--kol-surface-secondary)', pad: 'var(--kol-pad-card-lg)', height: 500 },
}

/* HOVER is a bg STEP on the opaque tier, per 05-control-chrome.md's state model
 * — "interactive fills mix ink into the surface via the oq-* tier, never a
 * translucent fg-* wash", because a translucent fill over an image reads as the
 * control vanishing. article is the exception the shipped card already set: it
 * has no surface of its own to step, so it dims its title instead. */
const HOVER = {
  file:  'var(--kol-oq-04)',
  slide: 'var(--kol-surface-primary)', /* the plate holds its colour on hover; the drawer control is the affordance */
  catalog:  'var(--kol-surface-tertiary)',
  /* article and work take NO surface hover, and that is a decision not a gap:
   * article has no surface of its own (its media frame, when on, steps its
   * border instead), and work's whole hover IS the drawer rising. A second wash under
   * either would be two answers to one question. */
  article:  null,
  showcase: null,
  showcaseCanvas: 'var(--kol-surface-inverse)',
}

/* per-variant media treatment. `ring` sits OVER the artwork, `frame` UNDER it —
 * see ContentMedia. print rings because an A4 print on a light page has no edge
 * of its own; article CAN frame (opt-in since 0.88.0) because its media is a
 * 16/9 thumbnail that rarely fills its box. */
const MEDIA = {
  /* zoom is for IMAGE-LED cards — where the artwork is the content and the
   * card is a frame around it. A catalog tile whose preview is a diagram, or
   * a default file card whose thumb is a 48px chip, gets nothing from it. */
  /* `print` FOLDED INTO `catalog` 2026-08-29 (user: "print doesnt need to exist
   * all together, it can just use catalog"). Its two behaviours became PROPS,
   * because a 3D turn and an image fade-in are things a card DOES, not kinds of
   * content it holds: `flip` and `fade`. Its zoom is catalog's already (below).
   * `ring` was removed the same day — it stays an opt-in on ContentMedia. */
  showcase: { zoom: true },
  /* frame OFF by default (ListingCardThumbBorder, user 2026-08-27: "I hate
   * border — remove border"): the article thumb's hairline is opt-in —
   * `frame` turns it on, and with it the fg-08 → fg-16 hover step */
  article: { frame: false, borderHover: true, zoom: true },
}

/* VARIANTS ARE CONTENT KINDS, NEVER PAGE NAMES (user ruling 2026-08-29:
 * "naming the variants by their use location doesnt make sense, because print
 * doesnt use print variant"). Six page-named variants became four kinds —
 * file · catalog · article · showcase — and the old names alias onto them:
 *
 *   default  → file            the fallback's name described its position
 *   print    → catalog         /prints renders `work` rows and a plateless
 *                              catalog card; `flip` + `fade` became props
 *   work     → showcase        /work is a location; a work is a shown piece
 *   typeface → showcase +      same card, full overlay instead of a drawer
 *              layout="canvas"
 *
 * `layout` is the discriminator inside `showcase` because `reveal` was already
 * taken by the consumer's overlay NODE. Its values are the box vocabulary the
 * component already spoke: drawer (default) · canvas.
 *
 * A FIFTH KIND, `slide` (2026-09-03, user-ruled: a deck is genuinely a different
 * thing from a file — a 16:9 stage carrying a date, a size and a slide count). */
const ALIAS = { default: 'file', print: 'catalog', work: 'showcase', typeface: 'showcaseCanvas' }
const LAYOUT_KEY = { canvas: 'showcaseCanvas', drawer: 'showcase' }

export default function ContentCard({
  variant: variantProp = 'file',
  layout,
  hero = false,
  label,
  pad,
  /* the tag chip follows the BOX (CardTagsNoVisibleFill, 2026-09-01): a solid
   * surface fill keeps `tertiary`, a plain or washed box takes `primary` */
  tagVariant,
  media,
  ratio,
  fit,
  frame,
  ring,
  zoom,
  /* `flip` + `fade` — behaviours, not variants (the print fold, 2026-08-29) */
  flip,
  fade,
  /* plateRule (CatalogCardFrameAndZoom): the plate's top hairline — default the variant's (catalog and
   * print draw it); `false` turns it off without an `!important` in a consumer sheet */
  plateRule,
  /* `bg` — the card's REST fill, overriding the variant's. It sets
   * `--kol-card-bg`, not a background, because the rest colours are custom
   * properties so the hover class can win; that is also why
   * `className="bg-oq-48"` does nothing here and a consumer reaching around the
   * component had to write `className="[--kol-card-bg:var(--kol-oq-48)]"`
   * (kol-client-hrafn, `contentcard-bg-and-text-props` 2026-09-03). The hover
   * step is `--kol-content-hover-bg` and is set separately, so the two do not
   * move together. For the card's INK, pass `text` — it falls through to
   * ContentText with the rest of the slots. */
  bg,
  control,
  controlStart,
  reveal,
  actions,
  expanded = false,
  expandedContent,
  selected = false,
  onClick,
  href,
  onNavigate,
  className = '',
  ...text
}) {
  const aliased = ALIAS[variantProp] ?? variantProp
  /* `layout` only re-keys inside the showcase family — it is not a general
   * escape hatch that would let any variant borrow another's box. */
  const variant = aliased.startsWith('showcase') && layout ? LAYOUT_KEY[layout] ?? aliased : aliased
  const box = BOX[variant] ?? BOX.file
  const doFlip = flip ?? box.flip
  /* HERO (2026-08-27 — the featured card riding a page's fold; ListingCard
   * size="hero" had no ContentCard equivalent, which is why Stack still
   * imported it): a header row above the media — `label` left, `meta` chips
   * right — the media on the zoom's hero rung (1.02), the text on
   * ContentText's `hero` form (display-03 title). article only; the row form
   * has no hero. */
  const isHero = hero && variant === 'article'
  const { meta: heroMeta, ...textSlots } = text
  if (!isHero) Object.assign(textSlots, { meta: text.meta })
  if (isHero) delete textSlots.tags
  const metaChips = isHero && heroMeta != null ? (Array.isArray(heroMeta) ? heroMeta : [heroMeta]) : null
  const heroHeader = isHero && (label != null || metaChips?.length) ? (
    <div className="kol-card-hero-header flex items-center justify-between" style={{ marginBottom: 'var(--kol-spacing-4)' }}>
      {label != null && <div className="kol-helper-14 text-fg-64">{label}</div>}
      {metaChips?.length > 0 && (
        <div className="flex gap-3 kol-helper-12 text-fg-48">
          {metaChips.map((item, i) => <span key={i}>{item}</span>)}
        </div>
      )}
    </div>
  ) : null
  const r = ratio ?? RATIOS[variant]
  const padding = pad ? `var(--kol-pad-card-${pad})` : box.pad
  /* the inset takes SINGLE values (ContentCardActionsInsetShorthand, kol-monitor
   * 2026-09-02): `catalog`'s pad is the two-value shorthand `sm md`, and a
   * two-value string is invalid for top / right / bottom — all three dropped
   * and the actions landed at their static position, under the copy at the
   * left, instead of bottom-right (the 2026-08-15 ruling). Block from the
   * first value, inline from the second (or the same one). */
  const [padBlock, padInline = padBlock] = String(padding ?? '0').trim().split(/\s+/)
  /* image-only cards (print) pass no text slots — the empty plate must not render */
  const hasText = ['title', 'body', 'kicker', 'detail', 'date', 'size', 'meta', 'tags'].some((k) => textSlots[k] != null)
  /* `actions` sit IN THE TEXT PLATE, bottom-right (user ruling 2026-08-15:
   * *"space in text bottom right"*). Not stacked under the copy in their own
   * row — that grew the card — and not on the media, which was my call to make
   * and wasn't. The plate is one flex row: text takes the width, actions hold
   * the trailing edge, both bottom-aligned so the buttons sit on the last line
   * of copy rather than floating beside the title. */
  const hasPlate = hasText || actions != null
  /* FRAMED follows the EFFECTIVE fill, not the variant's. `bg` (0.183.0) let a
   * consumer ground an unframed variant, and this line still read the table —
   * so `article` + `bg` painted the ground but kept `framed` false, which
   * dropped the card's own `overflow-hidden rounded-*` AND left `mediaRadius`
   * true: a rounded still floating inside a square grey card, plate corners
   * square (kol-client-hrafn, screenshot-confirmed on 0.183.0, fixed 0.183.1).
   * One prop is not done until every derivation reads it. */
  const framed = box.border != null || (bg ?? box.bg) != null

  /* NO COVER IS NOT A MISSING COVER (content-card-needs-no-cover,
   * kol-client-olina 2026-09-04). `ContentMedia` turns absent children into an
   * `AssetPlaceholder` on purpose — a card whose image failed must not collapse
   * into a text blob, and that dashed MISSING plate is the honest answer for a
   * media library. It is the wrong answer for a markdown note in a database
   * row, which has no picture and never will: their `/notes` page drew a wall
   * of dashed frames with nothing misconfigured.
   *
   * The card cannot tell the two apart — only the consumer knows whether a
   * cover is owed — so it is declared, and `media={false}` declares it: no
   * media slot at all, text takes the full width. `false` rather than a new
   * prop because it is React's own idiom for "render nothing", and because
   * `media={false}` today renders an EMPTY framed box, a state nobody can want.
   * `media={null}` and an omitted `media` keep the placeholder, so every
   * existing consumer is untouched. */
  const noMedia = media === false

  const textNode = hasPlate ? (
    <div
      className="kol-card-plate relative"
      style={{
        '--kol-plate-pad': padding,
        '--kol-plate-pad-md': box.padMd,
        padding,
        marginTop: box.layout === 'stack' && !noMedia ? box.mediaGap : undefined,
        borderTop: (plateRule ?? box.plateTop) ? '1px solid var(--kol-fg-04)' : undefined,
        background: box.layout === 'drawer' ? 'var(--kol-surface-inverse)' : box.plateBg,
        color: box.layout === 'drawer' ? 'var(--kol-fg-inverse)' : undefined,
        position: 'relative',
        zIndex: box.layout === 'canvas' ? 1 : undefined,
      }}
    >
      {hasText && <ContentText variant={variant} form={isHero ? 'hero' : 'card'} tagVariant={tagVariant ?? (/surface-/.test(bg ?? box.bg ?? '') ? 'tertiary' : 'primary')} {...textSlots} />}
      {/* ABSOLUTE, not a flex sibling: the plate's height moves with the title
        * and the meta, so a laid-out stack would stretch or drift with it. The
        * inset reads the SAME pad token the plate uses, so the icons sit the
        * same distance from the top and right edges as the copy does. */}
      {actions && (
        <div
          className="absolute flex"
          style={{ top: padBlock, bottom: padBlock, right: padInline }}
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
    /* a catalog card with REAL media is image-led: it zooms (ShellHomeSystem) */
    zoom: zoom ?? (isHero ? 'hero' : variant === 'catalog' ? media != null : MEDIA[variant]?.zoom ?? false),
    fade: fade ?? MEDIA[variant]?.fade ?? false,
  }

  /* `control` — the in-frame control slot (user ruling 2026-08-15). One node,
   * placed in the media frame's corner by `.kol-frame-control` (kol-theme).
   * The CARD owns WHERE, the consumer owns WHAT: CopyButton, IconFrame with an
   * href, a select indicator — the card knows none of them by name. This is
   * what MediaCard hardcodes as a download link plus a select checkbox, and
   * the reason its media library could not migrate onto ContentCard. */
  const controlNode = control ? <div className="kol-frame-control">{control}</div> : null
  /* The frame's OTHER corner — top-left — for a second control (kol-r2b2
   * 2026-08-27: the select indicator beside the download chip). Port note:
   * becomes `.kol-frame-control--start` in kol-theme; inline until then. */
  const controlStartNode = controlStart
    ? <div className="kol-frame-control kol-frame-control--top-left">{controlStart}</div>
    : null


  const body =
    box.layout === 'stack' ? (
      <>
        {heroHeader}
        {/* the frame-corner controls go with the frame — `.kol-frame-control`
          * positions against the media box, and there is none */}
        {!noMedia && (
          <div className="relative">
            <ContentMedia ratio={r} {...mediaProps}>{media}</ContentMedia>
            {controlNode}
            {controlStartNode}
          </div>
        )}
        {textNode}
      </>
    ) : box.layout === 'fill-card' ? (
      <>
        {/* THE SPLIT HAS A NARROW RUNG (ContentCardExpandedSplitStacks, kol-mirror
          * 2026-09-01): below `md` the expanded halves STACK — media on top at
          * its own ratio, content full width under it. Side by side, a 350px
          * card gave each half 174 and the prose 126, and one module's specs
          * ran 1177px tall. The 50% half is a `md:` class now, not an inline
          * style — an inline flex-basis has no breakpoint. */}
        {!noMedia && (
        <div
          className={`flex-1 min-w-0 min-h-0 relative overflow-hidden ${expanded ? 'max-md:flex-none max-md:aspect-[var(--kol-card-ratio)] md:flex-[0_0_50%]' : ''}`}
          style={{ ...(expanded ? { '--kol-card-ratio': r ?? '3 / 2' } : null), ...(doFlip ? { perspective: '1000px' } : null) }}
        >
          {/* the FLIP (print): PrintGridCard's turn, verbatim — preserve-3d,
            * 0.4s ease-out, rotateY(180deg) while `selected`; the consumer's
            * `onClick` reads the rect off `event.currentTarget` for its
            * FLIP-transition (the seam was always reachable) */}
          {doFlip ? (
            <div className="h-full w-full" style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transition: 'transform 0.4s ease-out', transform: selected ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              <ContentMedia ratio={null} {...mediaProps}>{media}</ContentMedia>
            </div>
          ) : (
            <ContentMedia ratio={null} {...mediaProps}>{media}</ContentMedia>
          )}
          {controlNode}
          {controlStartNode}
        </div>
        )}
        {expanded ? (
          <div
            className="flex flex-1 flex-col justify-between overflow-auto"
            style={{ padding: 'var(--kol-pad-card-lg)' }}
          >
            {expandedContent}
          </div>
        ) : textNode}
      </>
    ) : box.layout === 'drawer' ? (
      <>
        {!noMedia && (
          <div className="relative h-full">
            <ContentMedia ratio={null} {...mediaProps}>{media}</ContentMedia>
            {controlNode}
            {controlStartNode}
          </div>
        )}
        {/* the plate is INVERSE and hidden until hover — `kol-card-drawer` owns
          * the reveal so the transition sits with the rest of the chrome */}
        {textNode && <div className="kol-card-drawer">{textNode}</div>}
      </>
    ) : (
      /* canvas — media fills the frame, plate floats on top. `reveal`
       * (TypefaceCardAndRow, 2026-08-27): on hover the plate and the media
       * fade out and the reveal node fades in — the card owns the
       * choreography (kol-theme `.kol-card.has-reveal`), the consumer owns the
       * node (what it says and which face it wears are never the family's). */
      <>
        {!noMedia && (
          <div className="kol-card-canvas-media absolute" style={{ inset: 0 }}>
            <ContentMedia ratio={null} {...mediaProps}>{media}</ContentMedia>
            {controlNode}
            {controlStartNode}
          </div>
        )}
        {textNode}
        {reveal != null && (
          <div className="kol-card-reveal absolute inset-0 flex items-center justify-center p-8 pointer-events-none" style={{ zIndex: 2 }}>{reveal}</div>
        )}
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
    'data-tags': isHero && Array.isArray(text.tags) && text.tags.length ? text.tags.join(' ') : undefined,
    className: `kol-card group flex ${box.layout === 'canvas' && reveal != null ? 'has-reveal' : ''} ${expanded ? 'flex-col md:flex-row-reverse' : 'flex-col'} ${box.layout === 'drawer' ? 'relative overflow-hidden rounded-[var(--kol-radius-sm)]' : ''} ${framed ? 'overflow-hidden rounded-[var(--kol-radius-sm)]' : ''} ${box.border ? 'border' : ''} ${box.layout === 'canvas' ? 'relative' : ''} ${interactive ? 'cursor-pointer select-none' : ''} ${hoverBg && interactive ? 'kol-content-hover' : ''} ${interactive && box.frameHover ? 'kol-content-hover-frame' : ''} ${className}`.trim(),
    style: {
      /* same reason as ContentRow: rest colours are PROPERTIES, because an
       * inline background/borderColor outranks the hover class and the step
       * would never render. */
      '--kol-card-bg': bg ?? box.bg ?? undefined,
      '--kol-card-border': box.border ? (selected ? 'var(--kol-fg-64)' : box.border) : undefined,
      '--kol-content-hover-bg': hoverBg ?? undefined,
      '--kol-content-hover-border': box.frameHover ?? undefined,
      aspectRatio: box.height || expanded ? undefined : (box.layout !== 'stack' ? r : undefined),
      height: box.height,
      gridColumn: expanded ? 'span 2' : undefined,
      gridRow: expanded ? 'span 2' : undefined,
      /* the grow/shrink between the two states rides the house curve; only a
       * card that CAN expand carries the transition */
      transition: expandedContent != null ? 'all 300ms var(--kol-ease-house)' : undefined,
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
