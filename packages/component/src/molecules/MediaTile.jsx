/* taxonomy-ok: molecule — lays out a caller's preview node and a name; no DS parts of its own. */

/**
 * MediaTile — one file in the grid view, Finder's icon view (user 2026-09-23: *"skip the container
 * card, just show the title and preview, give it hilight focus state … we are fighting the card
 * component"*). The grid borrowed `ContentCard` from the content-filters set — a card with a date,
 * a size and two buttons — so the one view of files that should read like the other two carried
 * a different item. This is the rows' and columns' item at tile size: a preview and a name.
 *
 * Selected: a rounded wash behind the preview and the name on a pill — the two marks Finder uses.
 * The verbs live where they live in the other views: the right-click menu and the Quick Look
 * header. `data-marquee-key` makes it a drag-select target like a row.
 *
 * @param {ReactNode} preview   the file's picture — the caller's image or `KindPreview fit="tile"`
 * @param {string}    name      the file's name
 * @param {boolean}   selected
 * @param {string}    markKey   the key the marquee reports
 */
export default function MediaTile({ preview, name, selected = false, markKey, onClick, onDoubleClick, onContextMenu, className = '' }) {
  return (
    <div className={`kol-media-tile-item ${className}`.trim()} data-selected={selected || undefined} data-marquee-key={markKey}
      role="button" tabIndex={0} aria-pressed={selected}
      onClick={onClick} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onDoubleClick?.(e) } }}>
      <div className="kol-media-tile-thumb">{preview}</div>
      <span className="kol-media-tile-name">{name}</span>
    </div>
  )
}
