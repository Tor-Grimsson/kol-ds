/**
 * FlipCard — a face that turns over in place to show its back (frames group, 2026-09-27). Lifted
 * from kol-mirror's channel flip (`styles/components.css` .mirror-flip-*), where a strip turns
 * to its patch panel. The body turns; everything around it holds still, so the back is the same
 * shaped object as the front.
 *
 * @param {boolean}   flipped
 * @param {ReactNode} front · back
 * @param {number|string} width   the card's width (the back is laid over the front at it)
 * @param {number}    duration    ms (default 450, mirror's)
 */
export default function FlipCard({ flipped = false, front, back, width, duration = 450, className = '' }) {
  const half = `visibility 0s ${duration / 2}ms`
  return (
    <div className={className} style={{ perspective: 1400, position: 'relative', width }}>
      <div style={{ transition: `transform ${duration}ms ease`, transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
        <div style={{ backfaceVisibility: 'hidden', transition: half, visibility: flipped ? 'hidden' : 'visible' }}>
          {front}
        </div>
        <div
          aria-hidden={!flipped}
          style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', overflowY: 'auto', scrollbarWidth: 'none', transition: half, visibility: flipped ? 'visible' : 'hidden' }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
