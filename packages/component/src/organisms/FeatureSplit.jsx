/**
 * FeatureSplit — editorial media-and-text split section: a text column
 * (kicker / display pull / lede, then a stats strip OR a CTA row) beside a
 * media column (image/video with an optional gradient veil + caption). Two
 * columns at/above 901px, single stacked column below. Emits
 * kol-feature-split* classes (CSS in @kol/theme).
 *
 * Presentational — every piece of content arrives as a slot. `meta` and
 * `ctas` are mutually exclusive by intent (pick one); `ctas` is
 * conventionally a row of KOL Buttons (composition dependency — nothing is
 * imported here). The media column renders only when `media` is passed, and
 * `caption` gates both the gradient veil and the caption element, so omitted
 * slots emit no empty nodes.
 *
 * Kicker / meta labels / caption render exactly as authored — the source's
 * `text-transform: uppercase` was dropped per KOL casing rules; author those
 * strings in their final case at the call site.
 *
 * THE SECTION ANATOMY, ONCE (SectionSplit ruling, 2026-08-15). The brief asked
 * for a new `SectionSplit` — media slot beside kicker/heading/body/actions,
 * with a flip — and named eleven hand-built kol-website sections as evidence.
 * That is this component: the anatomy already shipped here, and a second one
 * beside it would be the very duplication the brief exists to end. It grew the
 * three things it genuinely lacked instead — `flip`, `titleSize`, `mediaAspect`.
 *
 * ON THREADING PER-SITE TYPE CLASSES — the brief's named "core design
 * question". The answer is that you do not thread one: a consumer picks a ROLE
 * (`titleSize`), and the component emits exactly one type class for the
 * heading. Passing `kol-sans-heading-01` in alongside `.kol-feature-split-pull`
 * would put two equal-specificity rules on one element and let sheet load order
 * decide the winner — the failure ARCHITECTURE §5 records, and the 2026-07-30
 * law that a component's type lives in its own rule. `columnClassName` and
 * friends remain, for LAYOUT.
 *
 * @param {ReactNode} kicker          mono eyebrow above the title (accent color)
 * @param {ReactNode} title           display pull headline; `<em>` renders as the italic accent
 * @param {'pull'|'display-01'|'display-02'|'display-03'|'heading-01'|'heading-02'|'heading-03'|'heading-04'|'heading-05'} [titleSize='pull']
 *   which type ROLE the heading wears — one class, never stacked
 * @param {ReactNode} body            lede paragraph
 * @param {{num: ReactNode, label: string}[]} meta  stats strip (mutually exclusive with `ctas`)
 * @param {ReactNode} ctas            button row (mutually exclusive with `meta`)
 * @param {ReactNode} media           image/video/interactive node for the visual
 *   column; omit for the text-only section (the /CONNECT band shape)
 * @param {string}    [mediaAspect='4/5'] aspect ratio of the media frame
 * @param {boolean}   [mediaHover=false]  zoom the media on frame hover — the same
 *   1.03 / 300ms / reduced-motion-safe treatment CardFeatureItem uses, so the
 *   estate has one motion vocabulary instead of a per-section re-decision
 * @param {boolean}   [flip=false]    media first, text second — the order swaps at
 *   both widths, so the stacked layout leads with the media too
 * @param {ReactNode} caption         mono caption + gradient veil over the media
 * @param {string}    bgImage         URL for an inline cover background on the section
 * @param {boolean}   fullBleed       span the full viewport width (100vw breakout)
 * @param {string}    className       extra classes on the section
 * @param {string}    innerClassName  extra classes on the grid wrapper
 * @param {string}    columnClassName extra classes on the text column
 */
const TITLE_ROLE = {
  pull: 'kol-feature-split-pull',
  'display-01': 'kol-sans-display-01',
  'display-02': 'kol-sans-display-02',
  'display-03': 'kol-sans-display-03',
  'heading-01': 'kol-sans-heading-01',
  'heading-02': 'kol-sans-heading-02',
  'heading-03': 'kol-sans-heading-03',
  'heading-04': 'kol-sans-heading-04',
  'heading-05': 'kol-sans-heading-05',
}

export default function FeatureSplit({
  kicker,
  title,
  titleSize = 'pull',
  body,
  meta,
  ctas,
  media,
  mediaAspect = '4/5',
  mediaHover = false,
  flip = false,
  caption,
  bgImage,
  fullBleed = false,
  className = '',
  innerClassName = '',
  columnClassName = '',
}) {
  const sectionStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined
  const bleed = fullBleed ? 'w-screen ml-[calc(50%-50vw)]' : ''
  return (
    <section
      className={`kol-feature-split px-5 py-16 md:px-8 md:py-24 lg:px-14 lg:py-32 ${bleed} ${className}`.replace(/\s+/g, ' ').trim()}
      style={sectionStyle}
    >
      <div className={`max-w-[1200px] mx-auto grid grid-cols-1 min-[901px]:grid-cols-2 items-center gap-[clamp(48px,6vw,96px)] ${innerClassName}`.trim()}>
        {/* `order` rather than `flex-row-reverse`: the grid is one column below
          * 901px, and DOM order is what decides the stack there. Reversing a row
          * would flip the wide layout and leave the narrow one text-first. */}
        <div
          className={`flex flex-col gap-4 max-w-[640px] ${flip ? 'order-2' : ''} ${columnClassName}`.replace(/\s+/g, ' ').trim()}
        >
          {kicker && <span className="kol-feature-split-kicker">{kicker}</span>}
          {title && <h1 className={TITLE_ROLE[titleSize] ?? TITLE_ROLE.pull}>{title}</h1>}
          {body && <p className="kol-feature-split-body">{body}</p>}
          {meta && meta.length > 0 && (
            <div className="kol-feature-split-meta flex flex-wrap gap-y-7 gap-x-12 pt-4">
              {meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="kol-feature-split-meta-num">{m.num}</span>
                  <span className="kol-feature-split-meta-label">{m.label}</span>
                </div>
              ))}
            </div>
          )}
          {ctas && <div className="flex flex-wrap gap-4 pt-2">{ctas}</div>}
        </div>
        {media && (
          <div
            className={`kol-feature-split-visual relative rounded-[var(--kol-radius-sm)] overflow-hidden ${mediaHover ? 'is-hoverable' : ''} ${flip ? 'order-1' : ''}`.replace(/\s+/g, ' ').trim()}
            style={{ aspectRatio: mediaAspect }}
          >
            {media}
            {caption && <div className="kol-feature-split-visual-veil" aria-hidden="true" />}
            {caption && <span className="kol-feature-split-visual-caption">{caption}</span>}
          </div>
        )}
      </div>
    </section>
  )
}
