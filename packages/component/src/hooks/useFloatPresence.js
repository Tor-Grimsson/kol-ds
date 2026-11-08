import { useEffect, useRef, useState } from 'react'

/**
 * useFloatPresence — keeps a float in the tree for `ms` after `open` goes false, so its leave can play
 * (FloatActionStatesAndMotion, kol-website 2026-11-04). CSS cannot animate an unmount; this is the whole of the JS.
 * Reduced motion, or `ms` 0, unmounts at once.
 *
 * @param {boolean} open
 * @param {number}  ms   how long the leave runs (`floatMotion(motion).ms`)
 * @returns {{ mounted: boolean, entering: boolean, exiting: boolean }}  `entering` — opened after having been closed (never
 *   on first mount, so a page does not animate its chrome in on load)
 */
export default function useFloatPresence(open, ms) {
  const [state, setState] = useState(open ? 'open' : 'closed')
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return undefined }
    if (open) { setState('enter'); return undefined }
    const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!ms || still) { setState('closed'); return undefined }
    setState('exit')
    const t = setTimeout(() => setState('closed'), ms)
    return () => clearTimeout(t)
  }, [open, ms])
  return { mounted: open || state !== 'closed', entering: open && state !== 'open', exiting: !open && state !== 'closed' }
}
