import Pill from '../atoms/Pill.jsx'
import Avatar from '../atoms/Avatar.jsx'
import Image from '../molecules/Image.jsx'

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
 * Name and meta render uppercase via a presentational class only — strings are
 * authored as-is at the call site, no JS casing.
 *
 * @param {string[]} tags         Pill labels; row hidden when empty
 * @param {string}   title        display title
 * @param {string}   authorName   author name (rendered uppercase via class)
 * @param {string}   authorTitle  author role/title line
 * @param {string}   authorInitial avatar glyph; defaults to authorName's first char
 * @param {string}   date         publication date text
 * @param {string}   readingTime  reading-time text (prefixed `• ` in the meta line)
 * @param {string}   excerpt      lede paragraph; block hidden when falsy
 * @param {string}   heroImage    resolved hero image src (omit → no hero block)
 * @param {string}   className    extra classes on the <header>
 */
export default function ArticleHeader({
  tags = [],
  title,
  authorName,
  authorTitle,
  authorInitial,
  date,
  readingTime,
  excerpt,
  heroImage,
  className = '',
}) {
  const initial = authorInitial ?? (authorName ? authorName.trim().charAt(0) : '')

  return (
    <header className={`pb-12 ${className}`.trim()}>
      <div className="max-w-[1400px] mx-auto flex flex-col">
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-6">
            {tags.map((tag, i) => (
              <Pill key={i} variant="inverse" size="md">{tag}</Pill>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <h1 className="kol-prose-title text-balance">{title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-fg-64 pb-3">
            <div className="flex items-center gap-4">
              <Avatar initial={initial} size="lg" />
              <div className="flex flex-col">
                <span className="kol-helper-12 uppercase text-fg-48">{authorName}</span>
                <span className="kol-mono-12 text-fg-64">{authorTitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 kol-helper-12 uppercase text-fg-48">
              <span>{date}</span>
              {readingTime && <span>• {readingTime}</span>}
            </div>
          </div>

          {excerpt && (
            <div className="pb-4 w-full lg:w-[80%]">
              <p className="kol-mono-14 text-fg-64">{excerpt}</p>
            </div>
          )}

          {heroImage && (
            <div className="rounded overflow-hidden border border-fg-08">
              <Image
                src={heroImage}
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
