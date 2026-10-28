import { VectorLoader } from '@kolkrabbi/kol-component'

/**
 * SiteHero — A site's landing: a full-screen image, a wash, the mark, the name. kol-website apps/brand's `Landing`, class
 * for class (ArticleRendererHomeHeroSelection, kol-website 2026-10-28 — three hand-built copies: brand's Landing, record's
 * Home, site-hub's Home; web's /stack hero wears the same wash). Every part is optional, so the next site needs no copy.
 *
 * Not `PageHero`: that is a page's opening band (label · title · lede beside a mark). This is the home page itself.
 *
 * @param {Object}    image      `{ src, srcSet?, sizes?, position?, alt? }` — the ground, `object-cover`, `sizes` 100vw by default
 * @param {ReactNode} media      any node in place of `image` (a video, a canvas), filling the ground
 * @param {ReactNode|string} mark  a node, or an SVG url inlined in currentColor (`VectorLoader`); the hero sizes it, the
 *                               landing's clamp(140px, 16vw, 220px)
 * @param {string}    markTitle  the mark's accessible name when it is a url
 * @param {ReactNode} title      the h1, `kol-prose-display uppercase`
 * @param {ReactNode} tagline    `kol-prose-tagline`
 * @param {ReactNode} actions    buttons under the tagline, wrapped and centred
 * @param {number|{light,dark}|false} overlay  the wash: the inverse ink mixed over the image, 32 % light · 80 % dark by
 *                               default (the sites' line); a number sets both, `false` drops it
 * @param {'center'|'start'} align  the text column — centred (default) or from the left
 * @param {string}    minHeight  default `100dvh`
 */
export default function SiteHero({ image, media, mark, markTitle, title, tagline, actions, overlay, align = 'center', minHeight = '100dvh', className = '' }) {
  const start = align === 'start'
  const wash = overlay === false ? null
    : typeof overlay === 'number' ? { '--kol-site-hero-mix': `${overlay}%`, '--kol-site-hero-mix-dark': `${overlay}%` }
    : overlay && typeof overlay === 'object' ? { ...(overlay.light != null && { '--kol-site-hero-mix': `${overlay.light}%` }), ...(overlay.dark != null && { '--kol-site-hero-mix-dark': `${overlay.dark}%` }) }
    : {}
  return (
    <section className={`relative flex items-center ${start ? 'justify-start' : 'justify-center'} overflow-hidden ${className}`.trim()} style={{ minHeight }}>
      {(image || media) && (
        <div className="absolute inset-0 w-full h-full">
          {media ?? (
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.srcSet ? (image.sizes ?? '100vw') : undefined}
              alt={image.alt ?? ''}
              className="w-full h-full object-cover"
              style={{ objectPosition: image.position ?? 'center' }}
            />
          )}
        </div>
      )}
      {wash && <div className="kol-site-hero-overlay absolute inset-0 w-full h-full pointer-events-none" style={wash} aria-hidden="true" />}

      <div className={`relative z-[1] flex flex-col gap-10 px-8 ${start ? 'items-start text-left' : 'items-center text-center'}`}>
        {mark && (
          <div className="w-[clamp(140px,16vw,220px)] text-emphasis">
            {typeof mark === 'string'
              ? <VectorLoader src={mark} size="100%" className="block" role={markTitle ? 'img' : undefined} aria-label={markTitle} />
              : mark}
          </div>
        )}

        {title && <h1 className="kol-prose-display uppercase">{title}</h1>}

        {tagline && <p className="kol-prose-tagline">{tagline}</p>}

        {actions && <div className={`flex flex-wrap items-center gap-3 mt-4 ${start ? 'justify-start' : 'justify-center'}`}>{actions}</div>}
      </div>
    </section>
  )
}
