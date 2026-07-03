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
 * @param {ReactNode} kicker          mono eyebrow above the title (accent color)
 * @param {ReactNode} title           display pull headline; `<em>` renders as the italic accent
 * @param {ReactNode} body            lede paragraph
 * @param {{num: ReactNode, label: string}[]} meta  stats strip (mutually exclusive with `ctas`)
 * @param {ReactNode} ctas            button row (mutually exclusive with `meta`)
 * @param {ReactNode} media           image/video for the visual column; omit to hide it
 * @param {ReactNode} caption         mono caption + gradient veil over the media
 * @param {string}    bgImage         URL for an inline cover background on the section
 * @param {boolean}   fullBleed       span the full viewport width (100vw breakout)
 * @param {string}    className       extra classes on the section
 * @param {string}    innerClassName  extra classes on the grid wrapper
 * @param {string}    columnClassName extra classes on the text column
 */
export default function FeatureSplit({
  kicker,
  title,
  body,
  meta,
  ctas,
  media,
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
        <div className={`flex flex-col gap-4 max-w-[640px] ${columnClassName}`.trim()}>
          {kicker && <span className="kol-feature-split-kicker">{kicker}</span>}
          {title && <h1 className="kol-feature-split-pull">{title}</h1>}
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
          <div className="kol-feature-split-visual relative aspect-[4/5] rounded-[4px] overflow-hidden">
            {media}
            {caption && <div className="kol-feature-split-visual-veil" aria-hidden="true" />}
            {caption && <span className="kol-feature-split-visual-caption">{caption}</span>}
          </div>
        )}
      </div>
    </section>
  )
}
