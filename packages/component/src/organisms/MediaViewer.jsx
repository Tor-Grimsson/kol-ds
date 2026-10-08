import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Icon } from '@kolkrabbi/kol-icons'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'

/**
 * MediaViewer — THE fullscreen paged media viewer. One viewer for every
 * lightbox/gallery opener (the monorepo's ImageLightbox, FullscreenGallery
 * and WorkDetail's inline gallery all collapse onto this).
 *
 * Composed, not forked: the shell (scrim, scroll-lock, Escape, backdrop-close,
 * close button, stacking) is FullscreenOverlay; paging (touch swipe, snap,
 * wrap-around) is embla — the same core Carousel wraps, wired directly here
 * because Carousel's API has no controlled index and its slide chrome is
 * strip-width, not full-stage. ArrowLeft/ArrowRight bind to scrollPrev/Next.
 *
 * Controlled: the parent owns `index`. Embla's select event reports back
 * through `onIndexChange`; an external `index` change scrolls the stage.
 *
 * @param {boolean}  open           viewer visible
 * @param {Array}    media          [{ url, alt?, kind: 'image' | 'video', caption? }]
 * @param {number}   index          active item index (parent-owned)
 * @param {Function} onIndexChange  fires with the new index on page
 * @param {Function} onClose        close request (Esc, backdrop, close button)
 * @param {Function|ReactNode} actions  optional row under the stage; a function
 *   receives `(activeItem, index)` so openers can offer per-item actions
 *   (MediaPicker's Use / Copy URL) without forking a second lightbox
 */

/* Inverse-tier chip tokens: the overlay scrim is surface-inverse, and .kol-overlay
 * carries no surface-context class, so the standard fg ramp doesn't flip there. */
/* FIXED at the viewport edges, never inside the sheet (DocPageAndKindShowcase,
 * kol-r2b2 2026-08-27 — absolute to the stage they sat inside the plate and
 * centred on stage + caption, "too low"); the body stops 10rem short of the
 * edges so nothing runs under them. */
const CHIP =
  'kol-embla-btn fixed top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center border border-fg-inverse-16 text-inverse hover:border-fg-inverse-32 md:flex'

/* Mounted only while the overlay is open, so embla initializes fresh each open
 * with `startIndex` frozen at mount — no reInit games on later index changes. */
function ViewerStage({ media, index, onIndexChange }) {
  const [options] = useState(() => ({ loop: true, startIndex: index }))
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  // embla → parent: keep the parent authoritative over the active index
  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => onIndexChange?.(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => emblaApi.off('select', onSelect)
  }, [emblaApi, onIndexChange])

  // parent → embla: external index changes scroll the stage
  useEffect(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() !== index) emblaApi.scrollTo(index)
  }, [emblaApi, index])

  // Escape lives in FullscreenOverlay; the viewer only adds arrow paging
  useEffect(() => {
    if (!emblaApi) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') emblaApi.scrollPrev()
      if (e.key === 'ArrowRight') emblaApi.scrollNext()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [emblaApi])

  /* THE STAGE SETS ITS OWN WIDTH (2026-10-08, apps/media/viewer): FullscreenOverlay's sheet hugs
   * its content, and the overlay is a grid whose one track is sized by that content — so `w-full`
   * here resolved against nothing, the embla track grew to every slide side by side (six slides,
   * 3888px at 1440) and the stage showed blank with the first image 1.6k off the left edge. The
   * viewport minus the overlay's 24px lane each side is the width a fullscreen stage means. */
  return (
    <div className="relative w-[calc(100vw-3rem)]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-center">
          {media.map((item, i) => (
            <figure key={i} className="flex min-w-0 flex-[0_0_100%] flex-col items-center justify-center gap-3 [&>*]:max-w-[calc(100vw-10rem)]">
              {item.kind === 'video' ? (
                <video
                  src={item.url}
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="max-h-[90vh] max-w-full object-contain"
                />
              ) : (
                <img src={item.url} alt={item.alt || ''} className="max-h-[90vh] max-w-full object-contain" />
              )}
              {item.caption && (
                <figcaption className="kol-helper-12 text-fg-inverse-64">{item.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {media.length > 1 && (
        <>
          <button
            type="button"
            className={`${CHIP} left-6`}
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev() }}
          >
            <Icon name="chevron-left" size={20} />
          </button>
          <button
            type="button"
            className={`${CHIP} right-6`}
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext() }}
          >
            <Icon name="chevron-right" size={20} />
          </button>
        </>
      )}
    </div>
  )
}

export default function MediaViewer({ open, media = [], index = 0, onIndexChange, onClose, actions }) {
  if (!open || !media[index]) return null

  const actionRow = typeof actions === 'function' ? actions(media[index], index) : actions

  return (
    /* `scrim` (2026-10-08, apps/media/viewer): without it the overlay painted its opaque light
     * surface, and the viewer's inverse ink — caption, the paging chips — drew light on light and
     * read as "an image and nothing else". The chips (md and up) and the caption were always there. */
    <FullscreenOverlay open scrim onClose={onClose}>
      <ViewerStage media={media} index={index} onIndexChange={onIndexChange} />
      {/* on a phone the chips are off and a swipe pages — the position says there is more */}
      {media.length > 1 && (
        <div className="md:hidden mt-3 text-center kol-helper-12 text-fg-inverse-64" aria-live="polite">{index + 1} / {media.length}</div>
      )}
      {actionRow && (
        <div className="mt-4 flex items-center justify-center gap-2">{actionRow}</div>
      )}
    </FullscreenOverlay>
  )
}
