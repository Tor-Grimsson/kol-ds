/** AssetRow — an asset as a 54 row: its thumbnail, the name with a mono meta line, a ✓ at the right when selected
 * (float-everything W7 row 110, 2026-11-04; the exploration's "Luminous portrait · 1200 × 1500 · PNG · ✓").
 *
 * `thumb` a node or `src` an image, in a 44 × 54 frame with an 8 round; `name` in Inter panel, `meta` in mono ruler;
 * `selected` shows the check, `onSelect` makes the row a toggle. */
import { Icon } from '@kolkrabbi/kol-icons'
import { PRESS } from './_shared/float.js'

export default function AssetRow({ thumb, src, name, meta, selected = false, onSelect, className = '' }) {
  const Tag = onSelect ? 'button' : 'div'
  return (
    <Tag type={onSelect ? 'button' : undefined} onClick={onSelect} aria-pressed={onSelect ? selected : undefined}
      className={`flex items-center gap-3 w-full text-left min-w-0 rounded-[var(--kol-float-list-r)] ${onSelect ? `${PRESS} p-1 -m-1` : ''} ${className}`.trim()}
      style={selected && onSelect ? { background: 'var(--kol-fg-16)' } : undefined}>
      <span className="block w-11 h-[54px] rounded-[var(--kol-float-list-r)] overflow-hidden bg-fg-08 shrink-0">
        {thumb ?? (src && <img src={src} alt="" className="block w-full h-full object-cover" />)}
      </span>
      <span className="flex-1 min-w-0 flex flex-col gap-[3px]">
        <span className="kol-float-panel text-fg-96 truncate">{name}</span>
        {meta && <span className="kol-float-ruler text-fg-72 truncate">{meta}</span>}
      </span>
      {selected && <Icon name="check" size={14} className="text-oq-88 shrink-0 mr-1" />}
    </Tag>
  )
}
