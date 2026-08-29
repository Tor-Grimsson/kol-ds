import { Pill } from '@kolkrabbi/kol-component'
import { Image } from '@kolkrabbi/kol-component'

/**
 * @deprecated 2026-08-26 — absorbed by `ContentCard variant="article"` in @kolkrabbi/kol-component
 * (the Content Set, 2026-08-15). Step 1 of the retirement wave: this export
 * stays and renders unchanged until the next major, then it is removed.
 * Consumers: swap on your next bump. Map + row-by-row diff:
 * docs/documentation/03-components/06-content-card-system.md.
 *
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
 * ListingCard — THE listing card, three sizes (`default` / `hero` / `mini`).
 * Renamed from ArticleCard on the ListingCardSpec ruling (2026-08-15): the
 * anatomy (thumbnail · kicker · title · excerpt · meta · link) is generic
 * listing anatomy — articles, projects, prints, typefaces, tools — and the
 * name follows the role, not the content. `ArticleCard` stays as an alias
 * until the next major. All sizes share the flat view-model and the link seam;
 * `size` picks the layout. Geometry is the spec's table, no longer archaeology:
 * hero 16/9 · heading-03 · clamp 2 — default 16/9 (3/4 opt-in) · mono-20 ·
 * clamp 3 — mini 120×120 fixed · mono-14 · clamp 2. Breakpoint behaviour lives
 * in the CONSUMER: the context decides which preset renders at which width;
 * the card does no internal preset-swapping.
 *
 * - **default** — grid tile: thumbnail (landscape/portrait) over tag Pills, a
 *   mono title, an excerpt, and a `date • readingTime` meta Pill.
 * - **hero** — index masthead: an optional header row (`label` + `meta`),
 *   a big 16/9 image that zooms on hover, then kicker → title → summary.
 *   `showHeader={false}` is the grid usage.
 * - **mini** — sidebar row: a fixed 120×120 thumbnail beside title → summary →
 *   meta.
 *
 * `readmore` was a preset for one day (0.6.0 → dropped by the spec): it never
 * rendered anywhere and "read more" is a CONTEXT, not a size — an
 * end-of-article band renders `mini` cards with a `label` lead-in.
 *
 * De-Sanitized flat props, no router import. Placeholder thumbnails use
 * fg-opacity tokens (theme-aware — no `.dark` style injection). Every string
 * is authored at the call site in its final case — no `text-transform`, no JS
 * casing (KOL rule).
 *
 * TYPE SEAMS — `titleClassName` / `excerptClassName` / `kickerClassName`
 * **REPLACE** the element's type class, they do not stack beside it. That is
 * WorkListItem's established seam and the 2026-07-30 law: two equal-specificity
 * type rules on one element let sheet load order pick the winner. Colour,
 * clamping and hover stay component-owned either way.
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
 * @param {boolean}  frame       hairline around the thumb, hero + default (default FALSE —
 *                               ListingCardThumbBorder, user 2026-08-27: "I hate border";
 *                               the tint box stays). Same contract as ContentCard's `frame`
 * @param {string}   href        link target; `http*`/`mailto` → new tab, else same-tab seam
 * @param {Function} onNavigate  (event) => void — same-tab click seam (SPA intercept)
 * @param {string}   [titleClassName]   REPLACES the title's type class
 * @param {string}   [excerptClassName] REPLACES the excerpt's type class
 * @param {string}   [kickerClassName]  REPLACES the kicker's type class
 * @param {string}   className   extra classes on the root
 */
export default function ListingCard({
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
  frame = false,
  href,
  onNavigate,
  titleClassName,
  excerptClassName,
  kickerClassName,
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
                  {meta.map((item) => <span key={item}>{item}</span>)}
                </div>
              )}
            </div>
          )}
          {/* `kol-media-zoom` = the content-card family's hover zoom (1.06 / 600ms
            * house ease, reduced-motion opt-out, kol-theme) — was its own
            * scale-105 (ListingCardHoverZoom, user 2026-08-27: "too much zoom …
            * not relative to the others"); `is-hero` = the 1.02 hero rung
            * (StackCardHover, same day: "that is TOO MUCH ZOOM") */}
          <div className={`kol-media-zoom is-hero aspect-[16/9] mb-4 overflow-hidden w-full bg-fg-04 rounded ${frame ? 'border border-fg-08 hover:border-fg-16' : ''}`.trim()}>
            {thumbnail && (
              <Image
                src={thumbnail}
                alt={title}
                className="object-cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="space-y-3">
            {kicker && (
              <div className={`${kickerClassName ?? 'kol-helper-16'} tracking-wide text-fg-64`}>{kicker}</div>
            )}
            <h2
              className={`${titleClassName ?? 'kol-sans-heading-03'} transition-opacity duration-200 group-hover:opacity-70 line-clamp-2`}
            >
              {title}
            </h2>
            {body && (
              <p className={`${excerptClassName ?? 'kol-mono-14'} text-fg-48 line-clamp-2`}>{body}</p>
            )}
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
          <h4 className={`${titleClassName ?? 'kol-mono-14'} line-clamp-2 transition-opacity group-hover:opacity-80`}>
            {title}
          </h4>
          {body && <p className={`${excerptClassName ?? 'kol-mono-14'} text-fg-64 line-clamp-2`}>{body}</p>}
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
          className={`kol-media-zoom mb-4 overflow-hidden w-full rounded bg-fg-04 ${frame ? 'border border-fg-08' : ''}`.trim()}
          style={{ aspectRatio: aspect === 'portrait' ? '3/4' : '16/9' }}
        >
          <Thumb src={thumbnail} alt={title} />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Pill key={tag} variant="inverse" size="sm">{tag}</Pill>
            ))}
          </div>
        )}
        <h3
          className={`mb-2 ${titleClassName ?? 'kol-mono-20'} transition-opacity duration-200 group-hover:opacity-70`}
        >
          {title}
        </h3>
        {body && <p className={`mb-2 ${excerptClassName ?? 'kol-mono-14'} text-fg-64 line-clamp-3`}>{body}</p>}
        {(date || readingTime) && (
          <Pill variant="subtle" size="sm">{[date, readingTime].filter(Boolean).join(' • ')}</Pill>
        )}
      </article>
    </CardLink>
  )
}
