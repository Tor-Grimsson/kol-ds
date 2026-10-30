import { useState } from 'react'

/**
 * FlipCard — A face that turns to show its back. A face that turns over in place to show its back. Born in kol-hardware's
 * frames (2026-09-27, kol-mirror's channel flip); moved here for record's project cards (DocumentLibraryAndBoardParts,
 * kol-website 2026-10-29 — *"DASHBOARD NEEDS TO CONSUME DS COMPONENTS"*), and kol-hardware re-exports it. The body
 * turns; everything around it holds still, so the back is the same shaped object as the front.
 *
 * THE FACES SWAP BY BACKFACE, NOT BY A CLOCK (FlipCardFaceSwap, kol-monitor 2026-10-24 — user: *"the card flipps,
 * but the image snaps in once its landed. not believable."*). Both faces hide their backface and the back is pre-rotated
 * 180° in the preserve-3d turner, so the back shows exactly as the card passes edge-on, whatever the easing. The face
 * that is away is `inert` (and aria-hidden): out of tab order.
 *
 * TWO SHAPES. Without `height` the front sets the card's size and the back lies over it, scrolling what does not fit
 * (mirror's strip). With `height` the card is a fixed tile and each face scrolls its own overflow (record's 240 card).
 *
 * @param {boolean}   flipped         controlled; omit it and the card keeps its own (`defaultFlipped`)
 * @param {Function}  onFlippedChange (flipped) => void
 * @param {ReactNode|Function} front · back   a node, or `({ flipped, flip, setFlipped }) => node` — a face's own
 *                                    button turns the card ("Details →", "‹ Back")
 * @param {number|string} width       the card's width
 * @param {number|string} height      a fixed height (record's 240); omitted, the front's height
 * @param {number}    duration        ms (default 450, mirror's)
 */
export default function FlipCard({ flipped: flippedProp, defaultFlipped = false, onFlippedChange, front, back, width, height, duration = 450, className = '' }) {
  const [own, setOwn] = useState(defaultFlipped)
  const flipped = flippedProp ?? own
  const setFlipped = (v) => {
    const next = typeof v === 'function' ? v(flipped) : v
    if (flippedProp === undefined) setOwn(next)
    onFlippedChange?.(next)
  }
  const api = { flipped, flip: () => setFlipped(!flipped), setFlipped }
  const face = (f) => (typeof f === 'function' ? f(api) : f)
  const hidden = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
  const fixed = height != null
  const scroll = { overflowY: 'auto', scrollbarWidth: 'none' }
  return (
    <div className={className} style={{ perspective: 1400, position: 'relative', width, height }}>
      <div style={{ transition: `transform ${duration}ms ease`, transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'none', ...(fixed ? { position: 'relative', height: '100%' } : null) }}>
        <div aria-hidden={flipped || undefined} inert={flipped || undefined} style={fixed ? { position: 'absolute', inset: 0, ...scroll, ...hidden } : hidden}>
          {face(front)}
        </div>
        <div
          aria-hidden={!flipped || undefined}
          inert={!flipped || undefined}
          style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', ...scroll, ...hidden }}
        >
          {face(back)}
        </div>
      </div>
    </div>
  )
}
