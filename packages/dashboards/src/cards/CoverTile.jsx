/** CoverTile — a book as its cover: the typeset jacket at 5:7, the title and author captioned under it (float-everything
 * W7 row 108, 2026-11-04; the exploration's "The Waves · Virginia Woolf").
 *
 * `cover` is a node — the jacket as the consumer typesets it — or `src` an image of it; the tile only sizes it (`width`,
 * default 192) and keeps the paper's corners (1px). `title` in Inter panel, `author` in label under it; `onClick` makes
 * the tile pressable (opens the book). */
import { PRESS } from './_shared/float.js'

export default function CoverTile({ cover, src, title, author, width = 192, onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={`flex flex-col items-start text-left shrink-0 rounded-[var(--kol-float-list-r)] ${onClick ? PRESS : ''} ${className}`.trim()} style={{ width }}>
      <span className="block w-full aspect-[5/7] rounded-[1px] overflow-hidden bg-fg-08">
        {cover ?? (src && <img src={src} alt="" className="block w-full h-full object-cover" />)}
      </span>
      {(title || author) && (
        <span className="flex flex-col gap-0.5 mt-3 min-w-0 w-full">
          {title && <span className="kol-float-panel text-fg-96 truncate">{title}</span>}
          {author && <span className="kol-float-label text-fg-64 truncate">{author}</span>}
        </span>
      )}
    </Tag>
  )
}
