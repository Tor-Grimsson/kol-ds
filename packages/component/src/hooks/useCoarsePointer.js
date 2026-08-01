import { useEffect, useState } from 'react'

/**
 * True on coarse-pointer (touch) devices — the DS-wide pointer gate, the
 * sibling of `usePrefersReducedMotion`. Pointer-driven effects check this
 * and render their static form when true: a tilt that follows a cursor is
 * dead weight on a device that has none.
 *
 * Re-evaluates on device/orientation change via the media-query change
 * event (the monorepo source froze this in a module-load const — fixed on
 * recreate). Promoted out of TiltCard 2026-08-01 when InteractiveImage
 * became the second consumer.
 */
export default function useCoarsePointer() {
  const [coarse, setCoarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const onChange = () => setCoarse(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return coarse
}
