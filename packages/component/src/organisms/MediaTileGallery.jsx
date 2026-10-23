import { useState } from 'react'
import MediaViewer from './MediaViewer.jsx'

/**
 * MediaTileGallery — Media tiles that open a fullscreen viewer. a stack or grid of framed media tiles that open THE
 * shared fullscreen MediaViewer at the clicked tile, paged across all items
 * (the monorepo's FullscreenGallery recreated on the shared viewer instead of
 * its nav-less single image; the AssetFigure/AssetGrid deps are dropped —
 * tile and grid are inlined).
 *
 * Tiles are real <button>s, so Space + Enter activation comes free. Captions
 * render verbatim — authored case, no auto-casing.
 *
 * @param {Array}  items          [{ url, alt?, kind?: 'image' | 'video', caption? }] — the viewer's media shape
 * @param {string} layout         'stack' (flow column, default) | 'grid' | 'waterfall' — CSS columns, each
 *                                 item at its own aspect, no crop (MediaGalleryModes, kol-branding 2026-10-21)
 * @param {number} cols           column count from sm up (grid · waterfall); two below sm
 * @param {Function} onOpen       `(index) => void` — a host that owns the viewer takes the click; no viewer here then
 * @param {string} tileClassName  extra classes merged onto each tile button
 */
export default function MediaTileGallery({ items = [], layout = 'stack', cols = 4, tileClassName = '', onOpen }) {
  const [current, setCurrent] = useState(null)

  if (!items.length) return null

  const isGrid = layout === 'grid'
  const isFall = layout === 'waterfall'

  return (
    <>
      {/* `cols` is the count from `sm` up; below it the grid is two across (08-breakpoints rule 6 —
        * grid collapse is canonical, first break sm). The count rides a variable so the theme's one
        * phone rule can override it: an inline `gridTemplateColumns` could not be out-ranked. */}
      <div
        className={isGrid ? 'kol-media-tiles grid gap-4' : isFall ? 'columns-2 gap-4 sm:[column-count:var(--kol-media-tiles-cols)]' : 'flex flex-col gap-4'}
        style={isGrid || isFall ? { '--kol-media-tiles-cols': cols } : undefined}
      >
        {items.map((item, i) => (
          <figure key={i} className={isFall ? 'mb-4 min-w-0 break-inside-avoid' : 'min-w-0'}>
            <button
              type="button"
              className={`block w-full cursor-zoom-in overflow-hidden rounded border border-fg-08 bg-fg-04 ${tileClassName}`.trim()}
              onClick={() => (onOpen ?? setCurrent)(i)}
            >
              <img src={item.url} alt={item.alt || ''} loading="lazy" className="block h-auto w-full" />
            </button>
            {item.caption && (
              <figcaption className="kol-helper-12 text-meta mt-2">{item.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      {!onOpen && <MediaViewer
        open={current != null}
        media={items}
        index={current ?? 0}
        onIndexChange={setCurrent}
        onClose={() => setCurrent(null)}
      />}
    </>
  )
}
