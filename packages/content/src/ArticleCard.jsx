import { Pill } from '@kolkrabbi/kol-component'
import { Image } from '@kolkrabbi/kol-component'

/**
 * Optional link wrapper — the one place routing lives. `http*`/`mailto` hrefs
 * open in a new tab; any other href renders a plain same-tab anchor with an
 * `onNavigate(event)` seam an SPA consumer intercepts (preventDefault + its
 * router). No `href` → the bare content, no anchor.
 */
function CardLink({ href, onNavigate, className, children }) {
  if (!href) return <div className={className}>{children}</div>
  const isExternal = href.startsWith('http') || href.startsWith('mailto')
  return (
    <a
      href={href}
      onClick={isExternal ? undefined : onNavigate}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer noopener' : undefined}
      className={className}
    >
      {children}
    </a>
  )
}

/** Cover-fit thumbnail (or fg-token placeholder box when no src). */
function Thumb({ src, alt }) {
  if (!src) return null
  return (
    <Image
      src={src}
      alt={alt}
      className="object-cover"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}

/**
 * ArticleCard — one blog-card family with three sizes (`default` / `hero` /
 * `mini`), collapsing what were three byte-identical duplicate components. All
 * three share the flat view-model (title, excerpt, thumbnail, tags, meta) and
 * the link seam; `size` picks the layout.
 *
 * - **default** — grid tile: thumbnail (landscape/portrait) over tag Pills, a
 *   mono title, an excerpt, and a `date • readingTime` meta Pill.
 * - **hero** — index masthead: an optional header row (`label` + `meta`),
 *   a big 16/9 image that zooms on hover, then kicker → title → summary.
 * - **mini** — sidebar row: a fixed 120×120 thumbnail beside title → summary →
 *   meta.
 *
 * De-Sanitized flat props, no router import. Placeholder thumbnails use
 * fg-opacity tokens (theme-aware — no `.dark` style injection). Every string
 * is authored at the call site in its final case — no `text-transform`, no JS
 * casing (KOL rule).
 *
 * @param {'default'|'hero'|'mini'} size  layout preset (default 'default')
 * @param {string}   title       card title
 * @param {string}   excerpt     summary/excerpt paragraph (alias: `summary`)
 * @param {string}   summary     alias for `excerpt` (hero/mini call it this)
 * @param {string}   kicker      hero-only eyebrow above the title
 * @param {string}   label       hero header label (was the hardcoded "Featured")
 * @param {string[]} meta        hero header chips / mini meta line (joined ` • `)
 * @param {string}   date        default meta — left of the `•`
 * @param {string}   readingTime default meta — right of the `•`
 * @param {string[]} tags        default: rendered as Pills; hero/mini: `data-tags` only
 * @param {string}   thumbnail   image src (omit → fg-token placeholder)
 * @param {'landscape'|'portrait'} aspect  default thumbnail ratio (default 'landscape')
 * @param {boolean}  showHeader  hero: show the label/meta header row (default true)
 * @param {string}   href        link target; `http*`/`mailto` → new tab, else same-tab seam
 * @param {Function} onNavigate  (event) => void — same-tab click seam (SPA intercept)
 * @param {string}   className   extra classes on the root
 */
export default function ArticleCard({
  size = 'default',
  title,
  excerpt,
  summary,
  kicker,
  label,
  meta,
  date,
  readingTime,
  tags = [],
  thumbnail,
  aspect = 'landscape',
  showHeader = true,
  href,
  onNavigate,
  className = '',
}) {
  const body = excerpt ?? summary
  const dataTags = tags?.length ? tags.join(' ') : undefined

  if (size === 'hero') {
    return (
      <CardLink href={href} onNavigate={onNavigate} className={`block group ${className}`.trim()}>
        <article className="w-full" data-tags={dataTags}>
          {showHeader && (label || meta?.length) && (
            <div className="flex justify-between items-center mb-4">
              {label && <div className="kol-helper-14 text-fg-64">{label}</div>}
              {meta?.length > 0 && (
                <div className="flex gap-3 kol-helper-12 text-fg-48">
                  {meta.map((item, i) => <span key={i}>{item}</span>)}
                </div>
              )}
            </div>
          )}
          <div className="aspect-[16/9] mb-4 overflow-hidden w-full bg-fg-04 border border-fg-08 hover:border-fg-16 rounded">
            {thumbnail && (
              <Image
                src={thumbnail}
                alt={title}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="space-y-3">
            {kicker && (
              <div className="kol-helper-16 tracking-wide text-fg-64">{kicker}</div>
            )}
            <h2 className="kol-sans-heading-03 transition-opacity duration-200 group-hover:opacity-70 line-clamp-2">
              {title}
            </h2>
            {body && <p className="kol-mono-14 text-fg-48 line-clamp-3">{body}</p>}
          </div>
        </article>
      </CardLink>
    )
  }

  if (size === 'mini') {
    const metaText = Array.isArray(meta) ? meta.join(' • ') : meta
    return (
      <CardLink
        href={href}
        onNavigate={onNavigate}
        className={`group flex gap-6 items-start transition-opacity hover:opacity-80 ${className}`.trim()}
      >
        <div className="flex-shrink-0 w-[120px] h-[120px] overflow-hidden rounded bg-fg-12" data-tags={dataTags}>
          <Thumb src={thumbnail} alt={title} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <h4 className="kol-mono-14 line-clamp-2 transition-opacity group-hover:opacity-80">{title}</h4>
          {body && <p className="kol-mono-14 text-fg-64 line-clamp-2">{body}</p>}
          {metaText && <div className="kol-helper-12 text-fg-80">{metaText}</div>}
        </div>
      </CardLink>
    )
  }

  // size === 'default'
  return (
    <CardLink href={href} onNavigate={onNavigate} className={`block group cursor-pointer w-full max-w-full ${className}`.trim()}>
      <article className="w-full max-w-full" data-tags={dataTags}>
        <div
          className="mb-4 overflow-hidden w-full rounded bg-fg-04 border border-fg-08"
          style={{ aspectRatio: aspect === 'portrait' ? '3/4' : '16/9' }}
        >
          <Thumb src={thumbnail} alt={title} />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <Pill key={i} variant="inverse" size="sm">{tag}</Pill>
            ))}
          </div>
        )}
        <h3 className="mb-2 kol-mono-20 transition-opacity duration-200 group-hover:opacity-70">{title}</h3>
        {body && <p className="mb-2 kol-mono-14 text-fg-64">{body}</p>}
        {(date || readingTime) && (
          <Pill variant="subtle" size="sm">{[date, readingTime].filter(Boolean).join(' • ')}</Pill>
        )}
      </article>
    </CardLink>
  )
}
