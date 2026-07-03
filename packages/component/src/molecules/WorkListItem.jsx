import Image from './Image.jsx'
import Tag from '../atoms/Tag.jsx'

/**
 * WorkListItem — the list/row view of a `/work` project: the row twin of
 * WorkCard. A horizontal card — a small square thumbnail on the left, then a
 * content column split into a header row (title + tag chips on the left, type +
 * year right-aligned) above a large display preview line (the project
 * description). Hover raises a border; `active` persists that treatment for the
 * last-hovered row so a parent list can mark one active.
 *
 * Shares WorkCard's flat project bag so a `/work` view can toggle grid ⇄ list
 * as a render swap, not a data reshape. The whole row is an anchor (`href`) —
 * the source row was not a link (its parent list owned navigation); as the
 * list-view counterpart to WorkCard it is the click target itself. Thumbnail
 * routes through DS Image (graceful missing-asset fallback); tags render as DS
 * Tag chips. Router-agnostic via `onNavigate(href, event)`.
 *
 * Text casing: no text-transform (KOL rule) — the source's `uppercase` title
 * and `capitalize` type are dropped; strings render verbatim as authored.
 *
 * @param {string}        title        header title
 * @param {string}        thumbnail    thumbnail URL; the block is omitted when absent
 * @param {string[]}      tags         rendered as Tag chips under the title
 * @param {string}        type         right-column label
 * @param {string|number} year         right-column, below type
 * @param {string}        description  large display preview line
 * @param {string}        href         row navigation target
 * @param {boolean}       active       persist the hover treatment (last-hovered row)
 * @param {Function}      onMouseEnter hover callback (parent tracks the active row)
 * @param {Function}      onNavigate   (href, event) => void — anchor click seam for SPA routing
 */
export default function WorkListItem({
  title,
  thumbnail,
  tags,
  type,
  year,
  description,
  href,
  active = false,
  onMouseEnter,
  onNavigate,
}) {
  return (
    <a
      href={href}
      onClick={onNavigate ? (e) => onNavigate(href, e) : undefined}
      onMouseEnter={onMouseEnter}
      className={`self-stretch min-h-24 md:min-h-40 p-4 md:p-6 rounded flex items-stretch gap-4 md:gap-6 mb-4 md:mb-6 overflow-hidden cursor-pointer transition-all duration-300 bg-surface-secondary border ${active ? 'border-fg-16' : 'border-transparent hover:border-fg-16'}`}
    >
      {thumbnail && (
        <div className="shrink-0 w-16 h-16 md:w-28 md:h-28 rounded-[2px] overflow-hidden border border-fg-08">
          <Image src={thumbnail} alt={title} category="work" name={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-col justify-between min-w-0 flex-1 gap-3 md:gap-4">
        <div className="flex justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1 md:gap-2 min-w-0">
            <div className="kol-mono-14 truncate">{title}</div>
            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <Tag key={t} size="sm" variant="naked" hash={false}>{t}</Tag>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 md:gap-2 shrink-0">
            <span className="kol-mono-12 md:kol-mono-14">{type}</span>
            <span className="kol-mono-12 text-fg-64">{year}</span>
          </div>
        </div>

        <p className="kol-sans-heading-03 text-auto leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
          {description}
        </p>
      </div>
    </a>
  )
}
