import ContentMedia from './ContentMedia.jsx'
import ContentText from './ContentText.jsx'
import { useAppItem } from './AppItem.jsx'
import { toneClass } from '../utilities/tone.js'

/**
 * ContentRow — The row form of a content card. the row form of the content-card system: leading thumb (where
 * the variant has one) beside the ruled text. Box values — thumb size, gap,
 * padding, frame — default per variant to the RULED structures from the live
 * review (06-content-card-system.md §2 boxes): default is a bare table-like
 * line with a 48px thumb; catalog/print are framed between-headers with a
 * 36 square thumb when `media` is passed (none without); article rides a 120px 16:9 thumb; work a framed 64px row; typeface a
 * framed no-thumb block.
 *
 * @param {string}    variant   file | app | catalog | print | article | work | typeface | roster
 *                             (`app` = the file row with `verbs` · `menuItems` slotted — AppItem.jsx)
 *                             (`default` is an alias of `file`). `roster` is the pickable
 *                             row: filled tile, no border or divider, a FIXED 56px height the
 *                             content fills, a 40px square thumb and two truncated lines.
 * @param {ReactNode|false} media  thumb content (omit → placeholder; `false` → no thumb at all — the
 *                             content HAS no cover, as against one that failed to load)
 * @param {number|'fill'} thumb  thumb edge px — overrides the ruled default; 0 hides; `'fill'` = a square
 *                             the height of the row's content, whatever the rung (WorkListingRowsAndFilters)
 * @param {string}    ratio     thumb aspect-ratio — overrides the ruled default.
 *                             Under `thumb="fill"` the rung is the thumb's HEIGHT,
 *                             so a non-square ratio widens the thumb rather than
 *                             growing the row past its rung (ruled 2026-08-30)
 * @param {number}    paddingY  vertical padding px — overrides the ruled default
 * @param {number}    minHeight the row's rung in px — overrides the variant's
 * @param {'width'|'height'} ratioAxis  under `thumb="fill"`, WHICH AXIS PAYS for a
 *                             non-square `ratio`. `width` (default) holds the height
 *                             at the rung and narrows the thumb; `height` holds the
 *                             width and lets the thumb grow taller than the rung
 * @param {{label: ReactNode, value: ReactNode}[]} specs  label/value pairs on the
 *                             row's trailing edge, independent of variant.
 *                             Horizontal variants only — `typeface` is a column
 *                             and takes a band through `footer` instead.
 * @param {boolean}   selected
 * @param {Function}  onClick
 * @param {string}    tagVariant  the tag chip (CardTagsNoVisibleFill, 2026-09-01): default follows the BOX — a solid
 *   surface fill keeps `tertiary` (the /work row it was minted for), a plain or washed box takes `primary`
 * text slots + *Class seams forwarded to ContentText.
 */

/* ruled row boxes per variant (the §2 review) — paddings/gaps spell the
 * --kol-spacing-* tokens (2=8 · 3=12 · 4=16 · 6=24), never a literal */
const S2 = 'var(--kol-spacing-2)', S3 = 'var(--kol-spacing-3)', S4 = 'var(--kol-spacing-4)', S6 = 'var(--kol-spacing-6)'
const BOX = {
  /* NO hover wash (user 2026-08-29, on the variant-reference page: "makes a
   * grey background, remove it"). The default row is a bare ruled line — a
   * full-width grey band under it is heavier than the line itself. Scoped to
   * `default`: catalog and print still carry the same `oq-04`, unruled. */
  /* THE FILE CARD'S ANATOMY, SIDEWAYS (user 2026-10-22: *"its 2 items IMAGE + TEXT in one container that has rounded
   * corners and bg color. the padding is done on the text"*). The row is the container — fg-02, rounded, clipped, no
   * padding, no gap; the thumb is a 72 square flush in it; `plate` is the text section's padding (12 all round), and the text, specs
   * and actions live inside that one padded box. */
  file:  { thumb: 72, ratio: '1 / 1', pad: '0px', gap: '0px', align: 'items-stretch', bg: 'var(--kol-fg-02)', clip: true, plate: S3 },
  /* SLIDE (slide-variant-and-shelf-preset, 2026-09-03): file's row with the thumb FILLING the
   * rung's height and taking its width from 16:9 — 48 tall, 85 wide, the whole frame — not
   * the 48 square, which cropped a deck to a sliver (read off olina's /slide-deck). `minH` 64
   * = the 48 thumb plus the row's 8px pads; a fill thumb reads its height off the row's
   * rung, and without one it fell to the 96 fallback (80 × 142, measured on the showcase). */
  slide: { thumb: 'fill', ratio: '16 / 9', pad: `${S2} 0`, gap: S3, align: 'items-center', divider: true, minH: 64 },
  /* catalog/print rows render AT 36px — the shipped GridCard list row is a
   * fixed 36 and the Y padding was what pushed it past that. X padding stays;
   * `minH` is now the whole height budget and the row centres inside it. */
  /* catalog carries a thumb (2026-10-09 — user: "catalog should change its default"): the full
   * 36 rung, square, and ONLY when `media` is passed — every catalog row that never had one keeps
   * none, rather than growing a MISSING plate (`mediaOnly`). */
  catalog:  { thumb: 36,  mediaOnly: true, ratio: '1 / 1',  pad: `0 ${S3}`,     gap: S3, frame: 'var(--kol-fg-04)', bg: 'var(--kol-surface-tertiary)', minH: 36, align: 'items-center', hover: 'var(--kol-oq-04)' },
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
  /* `heightSm` — a FIXED rung below the md container, the floor above it
   * (ContentRowShowcaseImageDrivenHeight, kol-website 2026-09-01, user ruling:
   * the row's height is a function of the image, content fits inside it). On a
   * 390 phone the narrow text column wrapped five tags to four rows and grew
   * the row 62px past its floor, stranding the 136px thumb in dead space —
   * 60px of ragged heights down one list. 168 is the floor's own number
   * (136 thumb + 2×16 pad), so this is a change of KIND, not of value; the
   * text has 136 to live in and the tags line goes single-row below md
   * (ContentText's showcase ramp) so the cut lands on the chips, not mid-row. */
  showcase: { thumb: 'fill', ratio: '1 / 1', pad: S4, gap: S4, frame: 'transparent', frameHover: 'var(--kol-fg-08)', bg: 'var(--kol-surface-secondary)', minH: 168, heightSm: 168, align: 'items-stretch', thumbRadius: 'var(--kol-radius-xs)', thumbBorder: false },
  /* ROSTER — a PICKABLE row (ContentRowRosterVariant, kol-chess 2026-08-31):
   * filled tile, no border, no divider, fixed height, square thumb, two
   * truncated lines that FILL the row rather than setting it.
   *
   * `file` is the nearest part and a different object: a bare ruled line with a
   * 48px thumb, a divider, and no hover wash by the 2026-08-29 ruling — right
   * for a file listing, wrong for a grid of things you choose between. These
   * are targets, so they take a hover.
   *
   * THE FIXED HEIGHT IS THE POINT. Every other row in this family follows its
   * content, and on a pick grid that reads as broken: the filer measured 34 →
   * 40 → 50 → 58 across four passes, and ONE long meta line was enough to push
   * a tile out of line with its neighbours. `height`, not `minH` — the content
   * fills the row and cannot move it. */
  roster: { thumb: 40, ratio: '1 / 1', pad: S2, gap: S2, height: 56, align: 'items-stretch',
            bg: 'var(--kol-surface-secondary)', hover: 'var(--kol-fg-04)',
            thumbBg: 'var(--kol-fg-04)', thumbBorder: false },
  /* typeface's row is a COLUMN, not a line: a header (name/styles left,
   * classification/year right) with a full-width specimen band under it. The
   * shipped item is `flex-col gap-6`, and forcing it into the horizontal
   * thumb-beside-text shape is what turned its alphabet into a 160px thumb. */
  /* ONE SKIN, TWO ARRANGEMENTS (TypefaceRowSkin, kol-website 2026-08-30 — user:
   * *"I want it to visually have the same look as those pages"*). This box was
   * hand-written and had drifted into the opposite of its sibling: transparent
   * fill with an fg-08 outline, against showcase's filled surface with no
   * outline. Side by side they read as two systems.
   *
   * It is DERIVED from `showcase` now, so fill, frame, hover, pad and rung
   * cannot drift again — there is one set of values. Only the arrangement
   * differs: no thumb, and `column` stacks the band under the text instead of
   * laying a thumb beside it. That arrangement is the only reason this key
   * exists; `variant="typeface"` and `layout="column"` both resolve here. */
  showcaseCanvas: { thumb: 0, ratio: '1 / 1', pad: S6, gap: S6, column: true, minH: 160, align: 'items-start',
                    /* ONLY the fill and the frame come from showcase (TypefaceRowSkinCorrection,
                     * kol-website 2026-08-30). 0.138.0 derived the whole box with a spread and
                     * carried `pad` 24 → 16 and `minH` 160 → 168 with it — neither was asked for,
                     * and both were deliberate for a row whose content is a full-width specimen
                     * band. The ask was two values. It is two values.
                     *
                     * The spread also could not reach `FILL` in ContentText, which is keyed by
                     * variant NAME — so the two boxes agreed on every number and still disagreed
                     * about the vertical spread. Deriving one box from another while a second map
                     * is keyed by name is the drift the derive was meant to end. */
                    /* NO `hover` KEY (TypefaceRowHoverBg, kol-website 2026-08-30, the third
                     * pass on this row). `showcase` has `frameHover` and no `hover` at all, so a
                     * work row answers a pointer with a border step alone; this row also washed
                     * its background and read as a different interaction from every other listing.
                     *
                     * The three passes are the lesson: the ask was "make it look like /work" and
                     * each ticket named only the state someone had looked at — rest colors, then
                     * the derive's collateral, then this. When a user says make X look like Y,
                     * diff EVERY state: rest, hover, selected, focus. */
                    bg: 'var(--kol-surface-secondary)', frame: 'transparent', frameHover: 'var(--kol-fg-08)' },
}

/* `default` → `file` (user 2026-08-29). The variant was named after being the
 * fallback, which described its position in the map rather than its content;
 * every consumer of it is a file browser (r2b2 via MediaLibrary, the brand
 * app's LibraryLocal + SlideDeckManager) and its slots are filename · date ·
 * size. `default` keeps working as an alias — see 04-retirements.md. */
const ALIAS = { default: 'file', print: 'catalog', work: 'showcase', typeface: 'showcaseCanvas' }
const LAYOUT_KEY = { column: 'showcaseCanvas', line: 'showcase' }

export default function ContentRow({
  variant: variantProp = 'file',
  layout,
  media,
  thumb,
  ratio,
  paddingY,
  actions,
  footer,
  specs,
  minHeight,
  ratioAxis = 'width',
  selected = false,
  onClick,
  /* RIGHT-CLICK AND DOUBLE-CLICK RIDE ALONG (user 2026-09-23: *"where are the right click options
   * in grid view … CONSISTENCY"*). A card that takes a click takes the other two gestures the same
   * surface offers on its rows — the file wall's tiles are the same objects its rows are, and a
   * menu that exists on one and not the other is the inconsistency, not a missing feature. */
  onContextMenu,
  onDoubleClick,
  href,
  onNavigate,
  tagVariant,
  /* `bg` — the row's REST fill, the twin of ContentCard's (filed against the
   * card, `contentcard-bg-and-text-props` 2026-09-03; the pair ships together
   * and a consumer that re-grounds one hits the same wall on the other in the
   * same grid). It sets `--kol-row-bg`, not a background, because the rest
   * colors are custom properties so the hover class can win — which is why
   * `className="bg-oq-48"` does nothing here either. `selected` still wins:
   * a selected row is the list's state, not the consumer's ground. For the
   * row's INK, pass `text` — it falls through to ContentText. */
  bg,
  /* `tone` — the ground from the control set's tone ladder (ContentCardRowTone, kol-fxr 2026-10-22):
   * the rest fill AND its hover step from one `kol-tone-*` bundle, so they move together. `bg`
   * still wins the rest fill when both are passed. Unset → the variant's own ground. */
  tone,
  className = '',
  ...text
}) {
  /* `app` (CatalogAppVariant, kol-fxr 2026-10-23) is the `file` row with its parts slotted from
   * `verbs`, `download`, `menuItems`, and `tags`, `details`, `onTags` for the info rail — AppItem.jsx.
   * None of them reach ContentText; an app row's `tags` are the rail's, never chips in the row. */
  const app = useAppItem(variantProp, { title: text.title, verbs: text.verbs, download: text.download, menuItems: text.menuItems, date: text.date, size: text.size, media, back: text.back, tone, tags: text.tags, details: text.details, onTags: text.onTags, note: text.note, onNote: text.onNote, mark: text.mark, onCover: text.onCover, onInsert: text.onInsert, images: text.images, onImages: text.onImages, onBack: text.onBack, row: true })
  delete text.verbs; delete text.download; delete text.menuItems; delete text.details; delete text.onTags; delete text.note; delete text.onNote; delete text.mark; delete text.onCover; delete text.onInsert; delete text.back; delete text.images; delete text.onImages; delete text.onBack
  if (app) {
    delete text.tags
    variantProp = 'file'
    tone = app.tone
    media = app.media
    actions = app.actions ?? actions
    onContextMenu = app.onContextMenu ?? onContextMenu
    text.date = app.date
    text.size = app.size
  }
  const aliased = ALIAS[variantProp] ?? variantProp
  const variant = aliased.startsWith('showcase') && layout ? LAYOUT_KEY[layout] ?? aliased : aliased
  const box = BOX[variant] ?? BOX.file
  const ground = bg ?? (tone ? 'var(--kol-tone-bg)' : box.bg)
  /* `app` keeps file's no-fill hover (AppCardNoHoverFill) */
  const hover = tone && !app ? 'var(--kol-tone-hover-bg)' : box.hover
  /* `media={false}` — NO COVER, not a missing one (content-card-needs-no-cover,
   * kol-client-olina 2026-09-04). The row could already hide its thumb with
   * `thumb={0}`, but that is a SIZE answering a question about MEANING, and a
   * consumer listing coverless documents should not have to say it two
   * different ways on the card and the row. `media={false}` reads the same in
   * both; `thumb` still wins when it is passed explicitly. */
  const thumbPx = thumb ?? (media === false || (box.mediaOnly && media == null) ? 0 : box.thumb)
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
    /* THE RUNG IS A PROP (RowRungAndFillThumb, kol-website 2026-08-30). It was
     * the variant's literal published as an inline custom property, and an
     * inline property cannot be reached from a stylesheet — so a page wanting a
     * taller row carried `--kol-row-min-h: 224px !important`. */
    '--kol-row-min-h': minHeight != null ? `${minHeight}px` : box.minH != null ? `${box.minH}px` : undefined,
    '--kol-row-min-h-md': box.minHMd != null ? `${box.minHMd}px` : undefined,
    /* A FIXED rung, not a floor — `roster` only. `minHeight` still overrides it,
     * so a consumer that wants a taller pick row gets one; what it cannot get is
     * a row whose height drifts with its own copy. */
    '--kol-row-h': box.height != null ? `${minHeight ?? box.height}px` : undefined,
    /* the stacked case's fixed rung — `heightSm` variants only; `minHeight`
     * still overrides, same contract as `height` above */
    '--kol-row-h-sm': box.heightSm != null ? `${minHeight ?? box.heightSm}px` : undefined,
    /* `fill` = the rung minus the vertical padding — a definite number, not a
     * stretch (a min-height row has no definite cross size, so a stretched
     * aspect-ratio square resolved to the image's intrinsic width).
     *
     * THE EFFECTIVE RUNG, not the variant's. This read `box.minH` — the literal
     * — so raising the rung grew the ROW and left the thumb at its old height,
     * floating. It is now `--kol-row-min-h`, whatever set it, resolved in CSS.
     * That was the second `!important` kol-website was carrying. */
    '--kol-row-pad-y': padY,
    '--kol-row-thumb': thumbPx === 'fill'
      ? 'calc(var(--kol-row-min-h, 96px) - 2 * var(--kol-row-pad-y, 0px))'
      : `${thumbPx}px`,
    '--kol-row-thumb-md': box.thumbMd != null ? `${box.thumbMd}px` : undefined,
    /* the documented `ratio` prop, finally connected (RowThumbRatioDead,
     * kol-website 2026-08-30). It was destructured and then dropped — the row
     * passed ContentMedia `ratio={null}` and kol-theme hard-coded `1 / 1`, so a
     * consumer setting it got no error and no change. Undefined publishes
     * nothing and the CSS fallback keeps every current row square. */
    '--kol-row-thumb-ratio': ratio ?? box.ratio,
    '--kol-content-hover-bg': hover,
    '--kol-content-hover-border': box.frameHover,
    /* rest values are PROPERTIES, not inline declarations — an inline
     * `background`/`borderColor` outranks every class, so the hover rules in
     * kol-theme could never win and no row hover fired at all. */
    '--kol-row-bg': selected ? 'var(--kol-fg-04)' : ground,
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
      <ContentText variant={app ? 'app' : variant} form="row" className="w-full" tagVariant={tagVariant ?? (/surface-/.test(ground ?? '') ? 'tertiary' : 'primary')} {...text} />
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
        <div className={`kol-row-thumb shrink-0 ${box.plate ? 'self-stretch' : 'self-start'} ${thumbPx === 'fill' ? 'is-fill' : ''} ${thumbPx === 'fill' && ratioAxis === 'height' ? 'pays-height' : ''}`.replace(/\s+/g, ' ').trim()}>
          <ContentMedia
            ratio={null}
            /* a row that clips its own corners does not round the thumb again — the card's rule (2026-08-15) */
            radius={!box.clip}
            border={box.thumbBorder ?? false}
            bg={box.thumbBg}
            className={box.thumbRadius ? 'rounded-[var(--kol-radius-xs)]' : ''}
          >
            {media}
          </ContentMedia>
        </div>
      )}
      {/* THE 2px IS DELIBERATE and the one off-grid value in `roster` (the filer
        * ruled it on screen): the two lines stack to 34 inside a 40 content box,
        * and pushing them fully apart puts the ascenders hard against the thumb's
        * top and bottom edges. It is the ROW's ruling, so the row passes it. */}
      {box.plate ? (
        /* the TEXT SECTION — one padded box holding the copy, the specs and the actions (the card's plate) */
        /* items-STRETCH: the actions column spans the padded height, so a column of controls spreads from the
         * top pad to the bottom pad as it does on the card's plate, and the copy spans it too — title on the top
         * pad, date · size on the bottom one, level with the last control (user 2026-10-22) */
        <div className="flex flex-1 min-w-0 items-stretch" style={{ padding: box.plate, gap: box.plateGap ?? box.plate }}>
          {/* the meta line's leading is its type size, so its baseline lands on the bottom pad, level with the last
            * control — at its 16px line the digits sat ~4px above it (user 2026-10-22) */}
          <ContentText variant={app ? 'app' : variant} form="row" className="min-w-0 flex-1 justify-between [&_.kol-mono-12]:leading-none" tagVariant={tagVariant ?? (/surface-/.test(ground ?? '') ? 'tertiary' : 'primary')} {...text} />
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      ) : (
      <ContentText variant={app ? 'app' : variant} form="row" className={`flex-1 ${box.height != null ? 'py-[2px]' : ''}`.trim()} tagVariant={tagVariant ?? (/surface-/.test(ground ?? '') ? 'tertiary' : 'primary')} {...text} />
      )}
      {/* `specs` rides the trailing edge on EVERY variant — year · material ·
       * edition is a content difference, not a geometry one, and minting a
       * seventh page-named box for it is the exact mistake §1 of the ticket is
       * about (RowVariantNamesAndSpecs, 2026-08-29).
       * ponytail: horizontal rows only — a column variant (`typeface`) has no
       * right column to ride. Give it a band via `footer` instead. */}
      {specs?.length > 0 && (
        <dl className="kol-row-specs shrink-0">
          {specs.map(({ label, value }, i) => (
            <div key={label ?? i}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {/* trailing edge, never in the text flow — MediaRow's placement */}
      {actions && !box.plate && <div className="shrink-0">{actions}</div>}
    </>
  )

  const common = {
    className: `kol-row group flex ${toneClass(tone)} ${box.column ? 'flex-col' : ''} ${box.align} ${box.height != null ? 'kol-row--fixed' : ''} ${box.heightSm != null ? 'kol-row--fixed-sm' : ''} ${box.divider ? 'kol-row--divided' : ''} ${box.frame ? 'rounded-[var(--kol-radius-sm)] border' : ''} ${box.clip ? 'overflow-hidden rounded-[var(--kol-radius-sm)]' : ''} ${interactive ? 'cursor-pointer select-none' : ''} ${interactive && hover ? 'kol-content-hover' : ''} ${interactive && box.frameHover ? 'kol-content-hover-frame' : ''} ${className}`.trim(),
    style: vars,
  }

  /* same root-follows-the-affordance rule as ContentCard */
  if (href) return <a href={href} onClick={nav} {...common}>{inner}</a>
  if (onClick) {
    return (
      <div
        onClick={onClick}
        onContextMenu={onContextMenu}
        onDoubleClick={onDoubleClick}
        data-selected={selected || undefined}
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
