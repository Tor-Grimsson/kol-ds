import { useState } from 'react'
import MediaViewer from './MediaViewer.jsx'

/**
 * MediaTileGallery — a stack or grid of framed media tiles that open THE
 * shared fullscreen MediaViewer at the clicked tile, paged across all items
 * (the monorepo's FullscreenGallery recreated on the shared viewer instead of
 * its nav-less single image; the AssetFigure/AssetGrid deps are dropped —
 * tile and grid are inlined).
 *
 * Tiles are real <button>s, so Space + Enter activation comes free. Captions
 * render verbatim — authored case, no auto-casing.
 *
 * @param {Array}  items          [{ url, alt?, kind?: 'image' | 'video', caption? }] — the viewer's media shape
 * @param {string} layout         'stack' (flow column, default) | 'grid'
 * @param {number} cols           grid column count (grid layout only)
 * @param {string} tileClassName  extra classes merged onto each tile button
 */
export default function MediaTileGallery({ items = [], layout = 'stack', cols = 4, tileClassName = '' }) {
  const [current, setCurrent] = useState(null)

  if (!items.length) return null

  const isGrid = layout === 'grid'

  return (
    <>
      <div
        className={isGrid ? 'grid gap-4' : 'flex flex-col gap-4'}
        style={isGrid ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
      >
        {items.map((item, i) => (
          <figure key={i} className="min-w-0">
            <button
              type="button"
              className={`block w-full cursor-zoom-in overflow-hidden rounded border border-fg-08 bg-fg-04 ${tileClassName}`.trim()}
              onClick={() => setCurrent(i)}
            >
              <img src={item.url} alt={item.alt || ''} loading="lazy" className="block h-auto w-full" />
            </button>
            {item.caption && (
              <figcaption className="kol-helper-12 text-meta mt-2">{item.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      <MediaViewer
        open={current != null}
        media={items}
        index={current ?? 0}
        onIndexChange={setCurrent}
        onClose={() => setCurrent(null)}
      />
    </>
  )
}
