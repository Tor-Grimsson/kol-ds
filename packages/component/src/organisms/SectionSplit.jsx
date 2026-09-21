import SectionText from '../molecules/SectionText.jsx'
import AssetPlaceholder from '../utilities/AssetPlaceholder.jsx'
import { FULL_BLEED } from './sectionBleed.js'
import { surfaceClass } from '../utilities/sectionSurface.js'
import useSectionTheme from '../hooks/useSectionTheme.js'
import { minHeightClass } from './sectionHeights.js'

/**
 * SectionSplit — the media-and-text split section, on `SectionText` (the
 * text column) beside the media frame. Two columns at/above 901px, one
 * stacked column below. `FeatureSplit` is this component under its old name
 * and old prop names (kept as an alias — see FeatureSplit.jsx).
 *
 * `align` is the one prop the second brief (SectionSet, 2026-08-26) added:
 *   'right'  media on the right, text on the left — the default
 *   'left'   media first (the old `flip`)
 *   'center' ONE column: text centred, media below
 *   'top'    ONE column: media ABOVE the text, both centred
 *   'bottom' ONE column: text above, media below — the explicit name for what
 *            `center` has always rendered, kept as its own value because
 *            "centred" says where the column sits and nothing about the order
 * One anatomy, one prop — not a third component.
 *
 * THE VERTICAL PAIR (section-split-vertical-align, kol-client-hrafn
 * 2026-09-03). The filer asked what `center` renders when `media` is passed and
 * could not tell from the source: it STACKS, text first, media below, capped at
 * 640. So `bottom` already existed under a name that did not say so, and only
 * `top` was missing. Both are values a page can name now, and `center` keeps
 * its behaviour exactly, so no existing call moves.
 *
 * `meta` and `actions` are mutually exclusive by intent (pick one); `actions`
 * is conventionally a row of KOL Buttons. The media column renders only when
 * `media` is passed, and `caption` gates both the gradient veil and the
 * caption element. The label is uppercase by role; the rest renders as authored.
 *
 * @param {'inverse'|'light'|'dark'} theme  the section's theme scope (SectionThemeInverse, 2026-08-27):
 *   `inverse` = the paired theme of the nearest live one, following the toggle;
 *   `light` / `dark` pinned; omit to inherit. Stamps `data-theme` on the root and
 *   paints its surface — every token inside resolves to the other theme's.
 * @param {ReactNode} eyebrow      mono eyebrow above the headline (accent); `label` is its alias
 * @param {ReactNode} headline     display pull; `<em>` renders as the italic accent
 * @param {string}    [headlineSize='pull']  which type ROLE the heading wears
 * @param {string}    [headlineAs='h1']
 * @param {ReactNode} body         lede paragraph
 * @param {{num: ReactNode, label: string}[]} meta  stats strip (mutually exclusive with `actions`)
 * @param {ReactNode} actions      button row
 * @param {ReactNode} media        image / video / interactive node for the visual column
 * @param {string}    [ratio='4/5'] aspect ratio of the media frame. THE FRAME IS BOUNDED BY THE
 *   RUNG (SectionSplitMediaBounded, 2026-08-27): its height is the section's `height` rung minus
 *   the vertical padding, its width follows the ratio (capped at the column). Before, the frame
 *   was as wide as its column and set the section's height itself, so `40` · `60` · `80`
 *   rendered identically — a ladder that only floors is decorative for a card with media.
 * @param {boolean}   [mediaHover=false] zoom the media on frame hover (the CardFeatureItem numbers)
 * @param {boolean}   [mediaClip=true]   the frame clips its media (overflow hidden + radius). `false`
 *   for a node that transforms in 3D (a tilt card) — the frame keeps its ratio and radius,
 *   the node owns its own clipping (SectionSplitMediaClip, kol-website 2026-08-26: TiltCard's
 *   lifted corners were being cut flat). `mediaHover` and a self-animating node are
 *   mutually exclusive in practice — pick one.
 * @param {boolean}   [fill=false]  THE HALF-FILLING FORM (section-split-fill-variant,
 *   kol-client-olina 2026-09-03). The bounded frame is the right rule for a card with media
 *   and the wrong one for a half: `fill` releases it — the media column loses the ratio, the
 *   rung-minus-padding height, the radius and the section padding, and covers its half edge to
 *   edge, with the text centred in the other. `align` still picks the side; below 901px the
 *   media stacks on top at `min-h-[50vh]`. This is the layout `SectionHero variant="split"`
 *   draws, without the hero's overlay / glass panel / carousel machinery or its name — the
 *   user's reason for not putting a hero under an About section.
 * @param {'center'|'start'} [textAlign]  how the TYPE rags inside the text block —
 *   `align` places the block, this aligns what is in it (section-split-fill-text-align,
 *   kol-client-olina 2026-09-03; user: *"same placement but just aligned to left … can the
 *   text align left and everything else kinda stays as is?"*). Works in BOTH forms rather
 *   than only in `fill`, because a prop that silently does nothing in the default form is a
 *   seam wired to nothing. Unset, each form keeps exactly what it did: `fill` centres,
 *   bounded follows `align` (centred when `align="center"`, else start).
 * @param {'right'|'left'|'center'|'top'|'bottom'} [align='right']  media side, or a centred single column: `top` puts the media above the text, `center` and `bottom` below it
 * @param {boolean|ReactNode} [placeholder=false]  what stands in when `media` is absent — `true` renders the DS `AssetPlaceholder` at the frame's ratio, a node renders itself. OFF by default: a text-only `SectionSplit` is a real and common call, and injecting a visible box into every one of them estate-wide is not a fix (section-split-vertical-align, kol-client-hrafn 2026-09-03, which asked for the placeholder and gets it opt-in)
 * @param {'full'|'80'|'60'|string} [height='60']  min-height on the family's ladder — full = 100dvh,
 *   80 = 70svh / 80vh, 60 = 50svh / 60vh (default), 40 = 35svh / 40vh; the columns stay vertically centred inside it
 * @param {ReactNode} caption      mono caption + gradient veil over the media
 * @param {string}    bgImage      inline cover background on the section
 * @param {boolean}   fullBleed    span the full viewport width
 * @param {object}    slotClass · slotStyle  per-slot class / style on the text block (reveal seam)
 * @param {string}    className · innerClassName · columnClassName  layout seams
 * @param {'primary'|'secondary'|'tertiary'|'inverse'|'auto'|'none'|string} background  the section's surface
 *   (SectionBackgroundProp, 2026-08-27) — a named surface, `none`, or a raw utility / token string; default = what it painted before
 */

export default function SectionSplit({
  theme,
  background,
  eyebrow,
  label,
  headline,
  headlineSize = 'pull',
  headlineAs = 'h1',
  body,
  meta,
  actions,
  media,
  ratio = '4/5',
  mediaHover = false,
  mediaClip = true,
  align = 'right',
  placeholder = false,
  textAlign,
  fill = false,
  height = '60',
  caption,
  bgImage,
  fullBleed = false,
  slotClass,
  slotStyle,
  className = '',
  innerClassName = '',
  columnClassName = '',
}) {
  /* `label` = alias of `eyebrow` (2026-08-27) */
  const eb = eyebrow ?? label
  const [themeRef, themeStamp] = useSectionTheme(theme)
  const sectionStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined
  const bleed = fullBleed ? FULL_BLEED : ''
  /* the three single-column forms — `center` and `bottom` are one layout under
   * two names, `top` reverses the order */
  const centred = align === 'center' || align === 'top' || align === 'bottom'
  /* `order-*` and not DOM order: the grid is one column in every centred form
   * and below 901px, and the order utilities are what lift the media above the
   * text for `left` and `top` alike. */
  const mediaFirst = align === 'left' || align === 'top'
  /* unset = each form's own prior behaviour, so nothing existing moves */
  const fillText = textAlign ?? 'center'
  const boundedText = textAlign ?? (centred ? 'center' : 'start')
  const justify = (a) => (a === 'center' ? 'justify-center' : 'justify-start')
  const grid = centred
    ? 'grid grid-cols-1 justify-items-center gap-[clamp(48px,6vw,96px)]'
    : 'grid grid-cols-1 min-[901px]:grid-cols-2 items-center gap-[clamp(48px,6vw,96px)]'

  /* THE FILL FORM — two halves, no frame. Deliberately its own return rather
   * than conditionals threaded through the bounded one: every bounded rule
   * (the container cap, the section padding, the ratio box, the rung-minus-
   * padding height) is a rule this form does not have, so sharing the JSX would
   * mean negating each of them at its own site. `.kol-section-split-visual`
   * stays on the media half because its `img { object-fit: cover }` rule is
   * exactly what a filling half wants — the class earns its keep here without a
   * line of new CSS. `centred` has no meaning with two halves and is ignored. */
  if (fill && media) {
    return (
      <section
        ref={themeRef}
        data-theme={themeStamp}
        className={`kol-section-split kol-section-split--fill grid grid-cols-1 min-[901px]:grid-cols-2 ${minHeightClass(height)} ${surfaceClass(background, 'none')} ${bleed} ${className}`.replace(/\s+/g, ' ').trim()}
        style={sectionStyle}
      >
        <div
          className={`kol-section-split-visual relative h-full min-h-[50vh] overflow-hidden min-[901px]:min-h-0 ${mediaHover ? 'is-hoverable' : ''} ${mediaFirst ? '' : 'min-[901px]:order-2'} ${columnClassName}`.replace(/\s+/g, ' ').trim()}
        >
          {media}
          {caption && <div className="kol-section-split-visual-veil" aria-hidden="true" />}
          {caption && <span className="kol-section-split-visual-caption">{caption}</span>}
        </div>
        <div className={`flex items-center justify-center px-5 py-16 md:px-8 md:py-24 lg:px-14 ${mediaFirst ? '' : 'min-[901px]:order-1'} ${innerClassName}`.replace(/\s+/g, ' ').trim()}>
          <SectionText
            eyebrow={eb}
            headline={headline}
            headlineSize={headlineSize}
            headlineAs={headlineAs}
            body={body}
            actions={actions}
            actionsClass={`flex flex-wrap gap-4 pt-2 ${justify(fillText)}`}
            align={fillText}
            slotClass={slotClass}
            slotStyle={slotStyle}
            className="max-w-[var(--kol-content-column)]"
          >
            {meta && meta.length > 0 && (
              <div className={`kol-section-split-meta flex flex-wrap gap-y-7 gap-x-12 pt-4 ${justify(fillText)}`}>
                {meta.map((m) => (
                  <div key={m.label} className="flex flex-col gap-0.5">
                    <span className="kol-section-split-meta-num">{m.num}</span>
                    <span className="kol-section-split-meta-label">{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionText>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={themeRef}
      data-theme={themeStamp}
      className={`kol-section-split flex flex-col justify-center px-5 py-16 md:px-8 md:py-24 lg:px-14 lg:py-32 [--kol-section-py:4rem] md:[--kol-section-py:6rem] lg:[--kol-section-py:8rem] ${minHeightClass(height)} ${surfaceClass(background, 'none')} ${bleed} ${className}`.replace(/\s+/g, ' ').trim()}
      style={sectionStyle}
    >
      {/* ONE cap for the whole section family (user ruling 2026-08-26): the shell's
        * --kol-container-max ladder — 100% → 1400 → 1600 → 1800. Split ran 1200,
        * cards 1400, the CTA 1600: three numbers for one job, unflagged. */}
      <div className={`w-full max-w-[var(--kol-container-max,var(--kol-content-shell,1800px))] mx-auto ${grid} ${innerClassName}`.replace(/\s+/g, ' ').trim()}>
        {/* `order` rather than `flex-row-reverse`: the grid is one column below
          * 901px, and DOM order is what decides the stack there. */}
        <SectionText
          eyebrow={eb}
          headline={headline}
          headlineSize={headlineSize}
          headlineAs={headlineAs}
          body={body}
          actions={actions}
          actionsClass={`flex flex-wrap gap-4 pt-2 ${justify(boundedText)}`}
          align={boundedText}
          slotClass={slotClass}
          slotStyle={slotStyle}
          className={`max-w-[640px] ${mediaFirst ? 'order-2' : ''} ${columnClassName}`}
        >
          {meta && meta.length > 0 && (
            <div className={`kol-section-split-meta flex flex-wrap gap-y-7 gap-x-12 pt-4 ${justify(boundedText)}`}>
              {meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="kol-section-split-meta-num">{m.num}</span>
                  <span className="kol-section-split-meta-label">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </SectionText>
        {(media || placeholder) && (
          /* height = the rung minus the padding; width follows the ratio and
           * caps at the column — the media takes its size from the section,
           * never gives it */
          <div
            /* THE MEDIA FILLS ITS COLUMN (SectionSplitVisualWidth, kol-website
             * 2026-08-31). It was `w-auto`, so the width was derived from the
             * image's aspect against whatever height the box was given — tall
             * enough and it clamped to max-w-full and filled; short and it
             * resolved NARROWER than the column and `justify-self-center` then
             * centred it, so the media sat visibly inset while the copy beneath
             * stayed at the page gutter. It is VIEWPORT HEIGHT that decides:
             * 390×844 passes, 390×700 renders at left 56 · width 278. A real
             * phone with browser chrome sits in the 660–720 band, which is why
             * this was reported from a device four times and never reproduced
             * against a nominal 844-tall test. `max-w-full` alone only caps. */
            /* THE RUNG STOPS AT THE STACK (SectionSplitVisualHeightRemainder,
             * kol-website 2026-09-01). The bounded-frame height (rung − 2×py,
             * SectionSplitMediaBounded) is a two-column ruling: it holds where
             * the text sits BESIDE the media. Stacked below 901px the text sits
             * ABOVE it, the same calc handed the frame whatever the rung's
             * arithmetic left (rung 40 at a 700-tall phone = 117px), and
             * `overflow-hidden` clipped a 350px card to a letterbox strip —
             * silently, which is why it was reported as a ProfileCard crop.
             * Below 901 the frame is `w-full` + ratio: width decides, height
             * follows, media never clips. ≥901 nothing moves. */
            className={`kol-section-split-visual relative w-full max-w-full justify-self-center rounded-[var(--kol-radius-sm)] min-[901px]:h-[calc(var(--kol-section-h,60vh)_-_2*var(--kol-section-py,4rem))] ${mediaClip ? 'overflow-hidden' : ''} ${mediaHover ? 'is-hoverable' : ''} ${mediaFirst ? 'order-1' : ''} ${centred ? 'max-w-[640px]' : ''}`.replace(/\s+/g, ' ').trim()}
            style={{ aspectRatio: ratio }}
          >
            {media ?? (placeholder === true
              ? <AssetPlaceholder className="h-full w-full" />
              : placeholder)}
            {caption && <div className="kol-section-split-visual-veil" aria-hidden="true" />}
            {caption && <span className="kol-section-split-visual-caption">{caption}</span>}
          </div>
        )}
      </div>
    </section>
  )
}
