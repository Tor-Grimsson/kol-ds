import AssetPlaceholder from '../utilities/AssetPlaceholder.jsx'

/**
 * ContentMedia — the media slot of the content-card system.
 *
 * Ratio is the only knob (`fit` was cut 2026-08-15 — a card image covers,
 * full stop). No children → AssetPlaceholder at the same ratio, so a card
 * with no media is visibly flagged, never collapsed.
 *
 * `ratio` is a FREE prop (06-content-card-system.md §4 — the A4 question is
 * open; nothing hardcodes a ratio). The ruled per-variant defaults live in
 * ContentCard/ContentRow, not here.
 *
 * `radius` (2026-08-15 user ruling): OFF when the host frame already clips its
 * own corners. A card that clips and a media slot that rounds are two radii on
 * one edge — the visible double-round. ContentCard turns it off for its framed
 * variants; the ROW keeps it, because a row does not clip.
 *
 * `fit` (2026-08-15) — `cover` crops to fill, which is right for a photograph
 * and wrong for a diagram or a screenshot, where the crop eats the content.
 * `natural` and `compact` are GridCard's `previewFit` under the family's name;
 * the shipped values are kept so a catalog grid can move over without a
 * re-tune. `cover` stays the default — every card in the family today is a
 * photograph.
 *
 * THREE separate edge treatments, because the shipped components use three:
 *
 *   frame   a TINTED box + border UNDER the media — article's card media is
 *           `bg-fg-04 border-fg-08`, and the tint shows wherever a 16/9 thumb
 *           does not fill its box
 *   border  border ONLY, no tint — WorkListItem's thumb is `border-fg-08` over
 *           a full-bleed image, where a tint would never be seen anyway and
 *           painting one is just a wrong value nobody notices
 *   ring    an inset hairline OVER the artwork — how a print card keeps a light
 *           image from bleeding into a light page
 *
 * `bg` tints without any border — ListingCard's row thumb is `bg-fg-12` bare.
 * They compose; a frame behind a full-bleed cover image is invisible, a ring
 * over one is the only thing you see.
 *
 * NOT here, deliberately: `loading="lazy"` and the fade-on-load. The media is
 * consumer-INJECTED — the real `<img>` is theirs — so lazy is one attribute on
 * their own element, and taking it over would mean cloneElement'ing a node the
 * family does not own to attach an onLoad it cannot guarantee fires (a cached
 * image never does). Reaching into someone else's element to animate it is the
 * kind of magic that breaks silently a year later.
 *
 * @param {string}    ratio     CSS aspect-ratio, e.g. '1 / 1', '16 / 9', '1 / 1.41421'
 * @param {boolean}   radius    round the media's own corners (default true)
 * @param {string}    fit       cover | natural | compact — how the child sits in the box
 * @param {boolean}   frame     tinted box + border UNDER the media
 * @param {boolean}   border    border only, no tint
 * @param {string}    bg        tint only, no border — a raw token value
 * @param {string}    borderHover  border colour on hover (article's fg-16 step)
 * @param {boolean}   ring      hairline border OVER the media, inset
 * @param {boolean}   zoom      the artwork creeps up inside its frame on the
 *                              CARD's hover — image-led variants only
 * @param {boolean}   fillHeight  size from the HEIGHT instead of the width: the
 *                              media fills its parent's height and its width
 *                              follows the ratio. What every ROW wants — a
 *                              thumb sized off the row's own height keeps the
 *                              row's rhythm, where a fixed width leaves it
 *                              floating in a tall row.
 * @param {ReactNode} children  the real media
 */
const FIT = {
  cover:   '[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover',
  natural: '[&>img]:h-full [&>img]:w-full [&>img]:object-contain [&>video]:h-full [&>video]:w-full [&>video]:object-contain',
  compact: 'grid place-items-center [&>img]:max-h-[70%] [&>img]:max-w-[70%] [&>img]:object-contain',
}

export default function ContentMedia({
  ratio = '1 / 1',
  radius = true,
  fit = 'cover',
  frame = false,
  border = false,
  bg,
  borderHover,
  ring = false,
  zoom = false,
  fillHeight = false,
  children,
  className = '',
}) {
  if (children == null) {
    return <AssetPlaceholder radius={radius} aspectRatio={ratio ?? undefined} className={ratio == null ? `h-full ${className}` : className} />
  }
  const round = radius ? 'rounded-[var(--kol-radius-sm)]' : ''
  return (
    <div
      className={`relative ${fillHeight ? 'h-full w-auto' : 'w-full'} overflow-hidden ${round} ${FIT[fit] ?? FIT.cover} ${frame ? 'bg-fg-04 border border-fg-08' : ''} ${border ? 'border border-fg-08' : ''} ${zoom ? 'kol-media-zoom' : ''} ${borderHover ? 'transition-colors hover:border-fg-16' : ''} ${ratio == null ? 'h-full' : ''} ${className}`.trim()}
      style={{ ...(ratio != null ? { aspectRatio: ratio } : null), background: bg }}
    >
      {children}
      {/* OVER the artwork, and inert — a hairline that must not eat the click
        * the card above it is listening for. */}
      {ring && <div className={`pointer-events-none absolute inset-0 border border-fg-08 ${round}`} />}
    </div>
  )
}
