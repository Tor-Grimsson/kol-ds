import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: nests only kol-icons's Icon (a package import the
 * relative-import check can't see). */

/**
 * CardFeatureItem — fixed-height feature card: a title + optional icon
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
 * @param {string}    icon             Icon name for the header (16px); also the 96px no-visual fallback
 * @param {string|ReactNode} visual    image URL, `.svg` mask URL, or inline node
 * @param {ReactNode} description      footer line (kol-mono-12, muted)
 * @param {string}    backgroundColor  card background utility class
 * @param {string}    href             link target; `http*`/`mailto` → new tab, else plain same-tab anchor
 * @param {Function}  onNavigate       (event) => void — click seam on the same-tab anchor (SPA intercept)
 * @param {'auto'|'9/6'|'10/6'|'16/9'|'1/1'} imageAspectRatio  aspect class on the visual middle
 * @param {string}    imagePosition    `<img>` object-position
 */
export default function CardFeatureItem({
  title,
  icon,
  visual,
  description,
  backgroundColor = 'bg-surface-primary',
  href,
  onNavigate,
  imageAspectRatio = 'auto',
  imagePosition = 'center',
}) {
  const isSvgUrl = typeof visual === 'string' && visual.endsWith('.svg')

  const aspectClasses = {
    'auto': '',
    '9/6': 'aspect-[9/6]',
    '10/6': 'aspect-[10/6]',
    '16/9': 'aspect-video',
    '1/1': 'aspect-square',
  }
  const aspectClass = aspectClasses[imageAspectRatio] || ''

  const content = (
    <>
      <div className="w-full flex items-center justify-between gap-2">
        <h3 className="kol-helper-16">{title}</h3>
        {icon && <Icon name={icon} size={16} className="shrink-0" />}
      </div>

      <div className={`w-full flex-1 flex items-center justify-center overflow-hidden ${aspectClass}`.trim()}>
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

  const baseClasses = `w-full flex-1 h-[304px] md:h-72 p-4 md:p-6 gap-4 ${backgroundColor} rounded border border-fg-08 flex flex-col justify-between items-start overflow-hidden`

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto')

    if (isExternal) {
      return (
        <a
          href={href}
          className={`${baseClasses} hover:border-fg-32 transition-colors duration-300`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      )
    }

    return (
      <a
        href={href}
        onClick={onNavigate}
        className={`${baseClasses} hover:border-fg-24 transition-colors duration-300`}
      >
        {content}
      </a>
    )
  }

  return <div className={baseClasses}>{content}</div>
}
