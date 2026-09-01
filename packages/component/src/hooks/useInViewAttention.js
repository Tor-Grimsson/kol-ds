import { useEffect, useRef, useState } from 'react'

/**
 * useInViewAttention — which card has the reader's attention when there is no
 * hover to give it. Returns `[ref, active]`; put the ref on the card's root.
 *
 * ── WHY THIS IS A SHARED HOOK (CardSetInViewAttention, kol-website 2026-08-31)
 * Every card in the set expresses attention as `:hover`, and a touch device
 * cannot hold hover — the cards are anchors, so a tap navigates rather than
 * dwelling. On a phone the whole hover vocabulary is dead: zooms never fire,
 * borders never step, media never scales.
 *
 * `TiltBento` solved that for ONE component in 0.145.0 with its own observer.
 * The second component to need it could not have it, so kol-website ended up
 * carrying `useMobileActiveCard.js` — the same observer, the same root margin —
 * to put `.is-viewing` on `.kol-card-feature`. A DS behaviour living in a
 * consumer, and the third consumer would have written it again. Two components
 * solving one thing two ways in one evening is the cost, not the behaviour.
 *
 * ── THE MECHANISM
 * An IntersectionObserver whose root is squeezed to the viewport's middle band
 * intersects only the element crossing the centre line. At most one full-width
 * card in a column is ever active — the same "one at a time" hover gives a
 * mouse — with NO cross-card coordination and no shared store: each card
 * answers for itself. A "most-visible card wins" rule would need the cards to
 * know about each other, which none of them has a way to arrange.
 *
 * `-45%` top and bottom is TiltBento's measured value, carried unchanged rather
 * than re-derived. A wall of small tiles wants none of this — that is what the
 * `enabled` flag is for, and every consuming component exposes it as an escape.
 *
 * @param {boolean} enabled  usually `coarse && mode !== 'static'`
 * @param {string}  band     root margin; the default is the ruled centre band
 * @returns {[React.RefObject, boolean]}
 */
export default function useInViewAttention(enabled, band = '-45% 0px -45% 0px') {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: band,
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [enabled, band])

  /* never leaks a stale `true` when the flag goes off (a pointer change, or a
   * consumer switching the escape on) */
  return [ref, enabled && active]
}
