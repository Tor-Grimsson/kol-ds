import SectionText from '../molecules/SectionText.jsx'
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
 * One anatomy, one prop — not a third component.
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
 * @param {'right'|'left'|'center'} [align='right']  media side, or centred single column
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
  const centred = align === 'center'
  const mediaFirst = align === 'left'
  const grid = centred
    ? 'grid grid-cols-1 justify-items-center gap-[clamp(48px,6vw,96px)]'
    : 'grid grid-cols-1 min-[901px]:grid-cols-2 items-center gap-[clamp(48px,6vw,96px)]'
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
          actionsClass={`flex flex-wrap gap-4 pt-2${centred ? ' justify-center' : ''}`}
          align={centred ? 'center' : 'start'}
          slotClass={slotClass}
          slotStyle={slotStyle}
          className={`max-w-[640px] ${mediaFirst ? 'order-2' : ''} ${columnClassName}`}
        >
          {meta && meta.length > 0 && (
            <div className={`kol-section-split-meta flex flex-wrap gap-y-7 gap-x-12 pt-4${centred ? ' justify-center' : ''}`}>
              {meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="kol-section-split-meta-num">{m.num}</span>
                  <span className="kol-section-split-meta-label">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </SectionText>
        {media && (
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
            {media}
            {caption && <div className="kol-section-split-visual-veil" aria-hidden="true" />}
            {caption && <span className="kol-section-split-visual-caption">{caption}</span>}
          </div>
        )}
      </div>
    </section>
  )
}
