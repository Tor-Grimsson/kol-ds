/**
 * FlipCard — A face that turns to show its back. a face that turns over in place to show its back (frames group, 2026-09-27). Lifted
 * from kol-mirror's channel flip (`styles/components.css` .mirror-flip-*), where a strip turns
 * to its patch panel. The body turns; everything around it holds still, so the back is the same
 * shaped object as the front.
 *
 * THE FACES SWAP BY BACKFACE, NOT BY A CLOCK (FlipCardFaceSwap, kol-monitor 2026-10-24 — user: *"the card flipps,
 * but the image snaps in once its landed. not believable."*). It swapped `visibility` at a fixed duration / 2, but
 * `ease` crosses edge-on at ~a third of the turn, so from there to the swap neither face showed — a blank card for
 * ~110ms of a 450 — and the back popped in near the end. Both faces hide their backface and the back is pre-rotated
 * 180° in the preserve-3d turner, so the back shows exactly as the card passes edge-on, whatever the easing. The
 * face that is away is `inert` (and aria-hidden), which is what the visibility had been for: out of tab order.
 *
 * @param {boolean}   flipped
 * @param {ReactNode} front · back
 * @param {number|string} width   the card's width (the back is laid over the front at it)
 * @param {number}    duration    ms (default 450, mirror's)
 */
export default function FlipCard({ flipped = false, front, back, width, duration = 450, className = '' }) {
  const hidden = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
  return (
    <div className={className} style={{ perspective: 1400, position: 'relative', width }}>
      <div style={{ transition: `transform ${duration}ms ease`, transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
        <div aria-hidden={flipped || undefined} inert={flipped || undefined} style={hidden}>
          {front}
        </div>
        <div
          aria-hidden={!flipped || undefined}
          inert={!flipped || undefined}
          style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', overflowY: 'auto', scrollbarWidth: 'none', ...hidden }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
