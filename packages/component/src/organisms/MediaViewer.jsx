import { useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import FullscreenOverlay from '../atoms/FullscreenOverlay.jsx'

/**
 * MediaViewer — THE fullscreen paged media viewer. One viewer for every
 * lightbox/gallery opener (the monorepo's ImageLightbox, FullscreenGallery
 * and WorkDetail's inline gallery all collapse onto this).
 *
 * The shell (scrim, scroll-lock, Escape, backdrop-close, close button) is
 * FullscreenOverlay — not reimplemented. This adds paging: prev/next chips,
 * arrow keys, touch swipe, wrap-around.
 *
 * ponytail: paging is ~20 lines of state + swipe, so it's inline rather than
 * composing Carousel — embla's drag physics buy nothing for a one-item stage;
 * revisit if momentum/preview-of-next is ever wanted.
 *
 * @param {boolean}  open           viewer visible
 * @param {Array}    media          [{ url, alt?, kind: 'image' | 'video' }]
 * @param {number}   initialIndex   item shown on open
 * @param {Function} onClose        close request
 * @param {Function} onIndexChange  fires with the new index on page
 */
export default function MediaViewer({ open, media = [], initialIndex = 0, onClose, onIndexChange }) {
  const [index, setIndex] = useState(initialIndex)
  const touchStart = useRef(null)

  // re-anchor to initialIndex each time the viewer opens
  useEffect(() => {
    if (open) setIndex(initialIndex)
  }, [open, initialIndex])

  const page = (delta) => {
    if (media.length < 2) return
    setIndex((i) => {
      const next = (i + delta + media.length) % media.length
      onIndexChange?.(next)
      return next
    })
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') page(-1)
      if (e.key === 'ArrowRight') page(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, media.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const item = media[index]
  if (!open || !item) return null

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (delta > 50) page(-1)
    if (delta < -50) page(1)
    touchStart.current = null
  }

  const chip = 'absolute top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-fg-04 hover:bg-fg-08 transition-colors cursor-pointer border-0'

  return (
    <FullscreenOverlay open={open} onClose={onClose}>
      <div className="relative flex h-full w-full items-center justify-center" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {media.length > 1 && (
          <button type="button" className={`${chip} left-4`} aria-label="Previous" onClick={() => page(-1)}>
            <Icon name="chevron-left" size={20} />
          </button>
        )}
        {item.kind === 'video' ? (
          <video
            key={item.url}
            src={item.url}
            autoPlay
            muted
            loop
            playsInline
            className="max-h-[85vh] max-w-full object-contain"
          />
        ) : (
          <img src={item.url} alt={item.alt || ''} className="max-h-[85vh] max-w-full object-contain" />
        )}
        {media.length > 1 && (
          <button type="button" className={`${chip} right-4`} aria-label="Next" onClick={() => page(1)}>
            <Icon name="chevron-right" size={20} />
          </button>
        )}
      </div>
    </FullscreenOverlay>
  )
}
