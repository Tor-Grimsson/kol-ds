import { useEffect, useRef, useState } from 'react'
import SlideRenderer from './SlideRenderer.jsx'
import { SLIDE_W, SLIDE_H } from './slideDoc.js'

/* taxonomy-ok: molecule — SlideRenderer measured into a 16:9 box */

/**
 * SlideThumb — one 1920×1080 slide rendered live inside a 16:9 box (kol-olina's brand decks). Measure
 * the box, `zoom` the stage by `width / 1920` — zoom, not transform, so the stage occupies the space
 * it draws in. Serves a card's thumbnail, the filmstrip and the full presentation alike.
 *
 * @param {Object} doc  a slide document
 */
export default function SlideThumb({ doc }) {
  const boxRef = useRef(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width
      if (w > 0) setScale(w / SLIDE_W)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={boxRef} className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
      {/* scale 0 until measured — a 1:1 frame would flash a 1920px slide inside a 380px card */}
      {scale > 0 && (
        <div className="relative" style={{ width: SLIDE_W, height: SLIDE_H, zoom: scale }} aria-hidden="true">
          <SlideRenderer doc={doc} />
        </div>
      )}
    </div>
  )
}
