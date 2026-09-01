import { Icon } from '@kolkrabbi/kol-icons'
import useCoarsePointer from '../hooks/useCoarsePointer.js'
import useInViewAttention from '../hooks/useInViewAttention.js'

/* taxonomy-ok: nests only kol-icons's Icon (a package import the
 * relative-import check can't see). */

/**
 * SectionCardItem — the card SectionCards is made of. Renamed from
 * CardFeatureItem 2026-08-26 (user: the composition is the card, so its parts
 * are card ITEMS); `CardFeatureItem` stays as a deprecated alias.
 *
 * SectionCardItem — fixed-height feature card: a title + optional icon
 * header, a flexible visual middle, and a mono description footer. The
 * card's visual is polymorphic: an `.svg` URL string renders as a
 * `mask-image` block tinted with `currentColor` (theme-correct line-art),
 * any other string renders as a cover-fit `<img>`, a ReactNode renders
 * as-is, and no visual falls back to a large 96px `Icon` (the header's
 * `icon` name). The grid child of FeaturesCardSection.
 *
 * Optionally the whole card is a link. `http*` / `mailto` hrefs open in a
 * new tab; any other href renders a plain same-tab anchor with an
 * `onNavigate(event)` seam — an SPA consumer intercepts there
 * (preventDefault + its router) instead of this component importing one.
 *
 * Title and description render exactly as authored — no casing transforms;
 * author strings in their final case at the call site.
 *
 * @param {ReactNode} title            header heading (kol-helper-16)
 * @param {string}    icon             Icon name for the header (16px)
 * @param {string|ReactNode} visual    image URL, `.svg` mask URL, or inline node; NONE = a text-only tile (title + description, min-h 180, the .feature-card frame/hover)
 * @param {ReactNode} description      footer line (kol-mono-12, muted)
 * @param {string}    backgroundColor  card background utility class (default: bg-surface-primary with a visual, transparent text-only)
 * @param {string}    href             link target; `http*`/`mailto` → new tab, else plain same-tab anchor
 * @param {Function}  onNavigate       (event) => void — click seam on the same-tab anchor (SPA intercept)
 * @param {'auto'|'9/6'|'10/6'|'16/9'|'1/1'} imageAspectRatio  aspect class on the visual middle
 * @param {'in-view'|'static'} [coarseReveal='in-view']  what counts as attention on a device with no
 *   hover (CardSetInViewAttention, kol-website 2026-08-31). A touch device cannot hold hover and the
 *   card is an anchor, so a tap navigates — the whole hover vocabulary was dead on a phone and the
 *   zoom never fired at all. `in-view` stamps `data-attention` on the card crossing the viewport's
 *   centre band, which the theme's hover rules ALSO key on, so hover and in-view resolve to ONE
 *   treatment rather than two parallel sets that drift. `static` opts out — a wall of small tiles
 *   does not want a tile lighting up as it passes the centre. Fine pointers never change.
 * @param {number}    zoom  hover zoom scale for THIS card's visual (default 1.03, the shipped value).
 *   Per-feature because the right amount belongs to the artwork, not the component: 3% is correct on
 *   a dense photographic visual and invisible on sparse line-art, and one set can hold both
 *   (CardFeatureZoomScale, kol-website 2026-08-31).
 * @param {string}    imagePosition    `<img>` object-position
 */
export default function SectionCardItem({
  title,
  icon,
  visual,
  description,
  backgroundColor,
  href,
  onNavigate,
  imageAspectRatio = 'auto',
  zoom,
  coarseReveal = 'in-view',
  imagePosition = 'center',
  className = '',
  style,
}) {
  const coarse = useCoarsePointer()
  const [viewRef, attention] = useInViewAttention(coarse && coarseReveal === 'in-view')

  const isSvgUrl = typeof visual === 'string' && visual.endsWith('.svg')
  /* TEXT-ONLY (FoundrySpecimenSections, 2026-08-27): no `visual` = a title +
   * description tile — the frame and hover of kol-website's .feature-card, no
   * 96px icon fallback. Hover only, never a persistent selected state. */
  const textOnly = visual == null
  const bg = backgroundColor ?? (textOnly ? 'bg-transparent' : 'bg-surface-primary')

  const aspectClasses = {
    'auto': '',
    '9/6': 'aspect-[9/6]',
    '10/6': 'aspect-[10/6]',
    '16/9': 'aspect-video',
    '1/1': 'aspect-square',
  }
  /* A MEDIA BOX MAY NOT RESOLVE TO ZERO HEIGHT (CardFeatureVisualCollapses,
   * kol-website 2026-08-31). With no ratio the box was `flex-1` and nothing
   * else — `flex: 1 1 0%`, basis ZERO, so its own content contributed nothing
   * and its height was donated entirely by the parent. Where no ancestor
   * supplies a definite height it resolves to 0 and the card silently drops to
   * title + subtitle: no broken image, no failed request, just a short card and
   * a reader who never learns a visual was meant to be there. Reported from a
   * real iPhone; not reproducible on this machine in any of the three engines,
   * which is exactly what a donated-height collapse looks like.
   * 3/2 is the geometry those cards already render at (316 wide → 211 tall at
   * 390), so nothing moves where it currently works. */
  const aspectClass = aspectClasses[imageAspectRatio] || 'aspect-[3/2]'

  const content = textOnly ? (
    <>
      <div className="w-full flex items-start justify-between gap-2">
        <h3 className="kol-helper-16">{title}</h3>
        {icon && <Icon name={icon} size={16} className="shrink-0" />}
      </div>
      <p className="kol-mono-12 text-fg-48">{description}</p>
    </>
  ) : (
    <>
      <div className="w-full flex items-center justify-between gap-2">
        <h3 className="kol-helper-16">{title}</h3>
        {icon && <Icon name={icon} size={16} className="shrink-0" />}
      </div>

      {/* kol-card-feature-visual: zooms on card hover (chrome in kol-theme —
        * CardFeatureHoverZoom 2026-08-12); all three visual forms ride the same
        * wrapper, reduced-motion opts out. The AMOUNT is `zoom`, published as
        * `--kol-card-feature-zoom` and defaulting to the shipped 1.03. */}
      <div className={`kol-card-feature-visual w-full flex-auto flex items-center justify-center overflow-hidden ${aspectClass}`.trim()}>
        {visual ? (
          typeof visual === 'string' ? (
            isSvgUrl ? (
              /* currentColor line-art: the SVG paints as a mask over bg-current */
              <div
                className="w-full h-full bg-current rounded"
                style={{
                  maskImage: `url(${visual})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: `url(${visual})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
            ) : (
              <img
                src={visual}
                alt={typeof title === 'string' ? title : ''}
                className="w-full h-full object-cover rounded"
                style={{ objectPosition: imagePosition }}
              />
            )
          ) : (
            visual
          )
        ) : (
          <Icon name={icon} size={96} />
        )}
      </div>

      <p className="kol-mono-12 text-fg-48">{description}</p>
    </>
  )

  /* the card publishes the amount; the theme rule reads it with 1.03 as the
   * fallback, so a card that sets nothing renders exactly as it always did */
  const rootStyle = zoom != null ? { ...style, '--kol-card-feature-zoom': zoom } : style

  const baseClasses = textOnly
    ? `kol-card-feature kol-card-feature--text w-full flex-1 min-h-[180px] p-4 md:p-5 lg:p-6 gap-2 ${bg} rounded border border-fg-08 flex flex-col justify-between items-start overflow-hidden ${className}`
    : `kol-card-feature w-full flex-1 h-[304px] md:h-72 p-4 md:p-6 gap-4 ${bg} rounded border border-fg-08 flex flex-col justify-between items-start overflow-hidden ${className}`.trim()

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto')

    if (isExternal) {
      return (
        <a
          ref={viewRef}
          data-attention={attention || undefined}
          href={href}
          className={`${baseClasses} hover:border-fg-32 transition-colors duration-300`}
          style={rootStyle}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      )
    }

    return (
      <a
        ref={viewRef}
        data-attention={attention || undefined}
        href={href}
        onClick={onNavigate}
        className={`${baseClasses} hover:border-fg-24 transition-colors duration-300`}
        style={rootStyle}
      >
        {content}
      </a>
    )
  }

  return <div ref={viewRef} data-attention={attention || undefined} className={baseClasses} style={rootStyle}>{content}</div>
}
