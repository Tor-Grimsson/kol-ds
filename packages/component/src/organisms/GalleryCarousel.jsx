import { useRef, useState } from 'react'
import Carousel from './Carousel.jsx'
import MediaViewer from './MediaViewer.jsx'

/* Drag-vs-click guard: DS Carousel owns Embla's drag physics but does NOT
 * forward a click-allowed signal, so a free-scroll drag that ends on a tile
 * would otherwise fire its onClick and open the viewer. This 5px pointer-move
 * threshold suppresses that click — self-contained, no Embla api needed. */
const DRAG_THRESHOLD_SQ = 25

/**
 * GalleryCarousel — the project-detail media gallery: a horizontal, drag-scroll
 * shelf of image/video tiles where clicking a tile opens THE shared fullscreen
 * MediaViewer starting at that tile.
 *
 * Composed from DS pieces, not forked: the shelf is DS **Carousel** in its
 * default `dragFree` mode; the fullscreen stage is DS **MediaViewer** (the one
 * paged viewer every lightbox collapses onto) opened at the clicked index. The
 * source's bespoke Embla wiring + `WheelGesturesPlugin` + hand-rolled
 * `internalEngine()` drag guard are dropped; a lightweight pointer-distance
 * guard keeps a drag from opening the viewer.
 *
 * Media is normalized (no Sanity): each item `{ url, kind: 'image'|'video',
 * aspect?, alt? }`. `kind` replaces the `_type` sniff; `aspect` replaces the
 * authored aspect-ratio string ladder (fallback `defaultAspect`). Videos
 * autoplay muted/looped inline in the track.
 *
 * @param {Array}  media          [{ url, kind: 'image'|'video', aspect?, alt? }]
 * @param {string} title          alt-text fallback (`${title} ${i+1}`)
 * @param {number} defaultAspect  tile aspect when an item omits `aspect` (default 0.8)
 * @param {string} className      extra classes on the section
 */
export default function GalleryCarousel({ media = [], title = '', defaultAspect = 0.8, className = '' }) {
  const [viewerIndex, setViewerIndex] = useState(null)
  const pointerStart = useRef({ x: 0, y: 0 })
  const dragged = useRef(false)

  if (!media.length) return null

  const onPointerDown = (e) => {
    dragged.current = false
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerMove = (e) => {
    if (dragged.current) return
    const dx = e.clientX - pointerStart.current.x
    const dy = e.clientY - pointerStart.current.y
    if (dx * dx + dy * dy > DRAG_THRESHOLD_SQ) dragged.current = true
  }

  return (
    <section className={className}>
      <Carousel>
        {media.map((item, i) => {
          const aspect = item.aspect ?? defaultAspect
          return (
            <div
              key={item.url || i}
              className="w-full overflow-hidden rounded-[2px] cursor-pointer"
              style={{ aspectRatio: aspect }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onClick={() => { if (!dragged.current) setViewerIndex(i) }}
            >
              {item.kind === 'video' ? (
                <video src={item.url} autoPlay muted playsInline loop className="w-full h-full object-cover" />
              ) : (
                <img src={item.url} alt={item.alt || `${title} ${i + 1}`} className="w-full h-full object-cover" />
              )}
            </div>
          )
        })}
      </Carousel>

      <MediaViewer
        open={viewerIndex !== null}
        media={media}
        index={viewerIndex ?? 0}
        onIndexChange={setViewerIndex}
        onClose={() => setViewerIndex(null)}
      />
    </section>
  )
}
