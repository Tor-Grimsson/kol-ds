import { Pill } from '@kolkrabbi/kol-component'
import { Image } from '@kolkrabbi/kol-component'
import AuthorLine from './AuthorLine.jsx'

/**
 * ArticleHeader — long-form article masthead: a row of tag Pills, a display
 * title, an author cluster (DS Avatar + name + role), a `date • readingTime`
 * meta line, an optional excerpt, and an optional hero image. Pure
 * presentational composition of a flat prop bag.
 *
 * De-Sanitized: the four embedded Sanity image-URL builders and the
 * `resolveImageUrl` unpacker are gone — `heroImage` is a plain resolved src
 * string handed straight to DS Image (which owns its own missing-asset
 * fallback). The author avatar is the DS Avatar atom (initials), not a
 * hand-rolled `<img>` — so `authorInitial` replaces the Sanity `authorImage`.
 * The app `reveal` entrance utility is dropped.
 *
 * Name and meta render in their authored case — no text-transform (KOL rule),
 * no JS casing; the call site authors each string in the case it should show.
 *
 * RECONCILED 2026-08-15 against kol-website's local twin (167L vs 87L). The
 * 220-line diff was almost entirely app coupling this package removed on
 * purpose — four Sanity URL builders, the `reveal` entrance utility and its
 * inline `--reveal-delay`, `kol-helper-14 uppercase` on the meta line (against
 * the no-text-transform rule), `kol-display-lg` where the prose role class
 * belongs. Three real capabilities were missing here, and only those crossed:
 * an author PHOTO (the twin hand-rolled an `<img>` because Avatar did initials
 * only — fixed in the atom, not here), a responsive-image `srcSet`, and the
 * smaller tag Pill on narrow viewports. The twin did that last one by rendering
 * the whole tag row TWICE behind `lg:hidden`/`hidden lg:flex`; one row with a
 * `tagSize` prop replaces both copies.
 *
 * @param {string[]} tags         Pill labels; row hidden when empty
 * @param {'sm'|'md'|'lg'} [tagSize='md'] Pill size for the tag row
 * @param {string}   title        display title
 * @param {string}   authorName   author name (rendered in its authored case)
 * @param {string}   authorTitle  author role/title line
 * @param {string}   authorInitial avatar glyph; defaults to authorName's first char
 * @param {string}   [authorImage] resolved author-photo src; falls back to the initial
 * @param {string}   date         publication date text
 * @param {string}   readingTime  reading-time text (prefixed `• ` in the meta line)
 * @param {string}   excerpt      lede paragraph; block hidden when falsy
 * @param {string}   heroImage    resolved hero image src (omit → no hero block)
 * @param {string}   [heroImageSrcSet] responsive candidates; the consumer builds
 *                                the string — this package resolves no URLs
 * @param {string}   [heroImageSizes]  the `sizes` attribute for that srcSet
 * @param {object}   partClassName · partStyle  per-part class / style keyed `tags` · `title` · `meta` · `excerpt` · `hero`
 * @param {string}   className    extra classes on the <header>
 */
export default function ArticleHeader({
  tags = [],
  tagSize = 'md',
  title,
  authorName,
  authorTitle,
  authorInitial,
  authorImage,
  date,
  readingTime,
  excerpt,
  heroImage,
  heroImageSrcSet,
  heroImageSizes,
  /* SectionRevealSeams (kol-website 2026-08-26): class + style per part —
   * `tags` · `title` · `meta` · `excerpt` · `hero` — so a consumer's entrance
   * system can stagger them. Nothing animates here. */
  partClassName = {},
  partStyle = {},
  className = '',
}) {
  const part = (key, base) => ({ className: `${base} ${partClassName[key] ?? ''}`.trim(), style: partStyle[key] })
  return (
    <header className={`pb-12 ${className}`.trim()}>
      <div className="max-w-[1400px] mx-auto flex flex-col">
        {tags.length > 0 && (
          <div {...part('tags', 'flex flex-wrap items-center gap-2 pb-6')}>
            {/* Keyed by the label, not the index — the audit finding on the
              * twin, and true here too: an index key re-uses a Pill's state
              * across a tag list that reorders. */}
            {tags.map((tag) => (
              <Pill key={tag} variant="inverse" size={tagSize}>{tag}</Pill>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <h1 {...part('title', 'kol-prose-title text-balance')}>{title}</h1>

          <div {...part('meta', 'flex flex-wrap items-center gap-6 text-fg-64 pb-3')}>
            <AuthorLine
              name={authorName}
              title={authorTitle}
              initial={authorInitial}
              image={authorImage}
            />
            <div className="flex items-center gap-3 kol-helper-12 text-fg-48">
              <span>{date}</span>
              {readingTime && <span>• {readingTime}</span>}
            </div>
          </div>

          {excerpt && (
            <div {...part('excerpt', 'pb-4 w-full lg:w-[80%]')}>
              <p className="kol-mono-14 text-fg-64">{excerpt}</p>
            </div>
          )}

          {heroImage && (
            <div {...part('hero', 'rounded overflow-hidden border border-fg-08')}>
              <Image
                src={heroImage}
                srcSet={heroImageSrcSet}
                sizes={heroImageSizes}
                alt=""
                loading="eager"
                className="object-cover"
                style={{ width: '100%', aspectRatio: '4/2', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
