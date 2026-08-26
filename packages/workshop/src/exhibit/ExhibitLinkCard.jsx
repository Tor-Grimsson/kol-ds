import { Link } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-component'

/**
 * ExhibitLinkCard — the card an exhibit's landing page uses for each child
 * page. Recreated from kol-website's `OverviewCard`, which carried a standing
 * note on itself: *"vendored verbatim from elder @kol/ui (no DS twin as of
 * kol-dashboards 0.2.0); lobby to the DS or fold into kol-dashboards if a
 * second consumer app appears."* This is that lobby arriving.
 *
 * Internal hrefs render as a router `<Link>`, external ones as a plain anchor —
 * an exhibit's landing grid routinely mixes both (a sub-page beside the live
 * production instance it documents).
 *
 * @param {string} label        card title
 * @param {string} [subtitle]   one line under the title
 * @param {string} [description] footer line, clamped to one row
 * @param {string} icon         glyph name — the corner mark and the empty-state fill
 * @param {string} [image]      cover image; replaces the oversized glyph
 * @param {string} href         internal path ("/workshop/…") or an absolute URL
 */
export default function ExhibitLinkCard({
  label,
  subtitle,
  description,
  icon,
  image,
  href,
  target,
  rel,
  className = '',
}) {
  const internal = href?.startsWith('/')
  const Tag = internal ? Link : 'a'
  const linkProps = internal ? { to: href } : { href, target, rel }

  return (
    <Tag
      {...linkProps}
      className={`group flex aspect-[4/3] flex-col gap-3 rounded bg-surface-inverse p-4 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="kol-card-kicker">{label}</h3>
          {subtitle && <p className="kol-mono-10 mt-1 italic text-fg-64">{subtitle}</p>}
        </div>
        <Icon name={icon} size={16} />
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden rounded border border-fg-08">
        {image ? (
          <img
            src={image}
            alt={label}
            className="h-full w-full scale-100 object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Icon
            name={icon}
            size={64}
            className="text-auto transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {description && <p className="kol-card-tag line-clamp-1 text-fg-48">{description}</p>}
    </Tag>
  )
}
