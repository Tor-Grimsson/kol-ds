import { useEffect } from 'react'
import { GRAB } from '../utilities/motion.js'
import gsap from 'gsap'

/**
 * useGrabEdge — the proximity-wake grab pill, for ANY resizable edge.
 *
 * Lifted out of kol-shell's `NavRail` 2026-08-30 (OneGrabGestureBothRails,
 * kol-fxr — user: *"why dont we use the grab animation and other sidenav
 * settings to be consistent?"*). fxr's `/labs` renders two rails on one screen,
 * the shell's on the left and a params rail on the right, and only the left one
 * came alive as the cursor neared it. Two implementations of one gesture in two
 * packages, and neither was consumer code, so no consumer could converge them.
 *
 * It lives in kol-component because that is the only package BOTH rails can
 * reach: kol-shell dropped its kol-framework peer in 0.16.0, so shell cannot
 * import framework's hook and framework cannot import shell's. `gsap` and the
 * `GRAB` tuning constants were already here.
 *
 * WHAT IT DOES. Watches the pointer; within `GRAB.near` of the handle's centre
 * line it adds `is-near` (hysteresis out at `GRAB.sleep`, so the pill does not
 * flicker on the boundary) and travels the pill along the edge to meet the
 * cursor — bipolar from the middle across `GRAB.range` of the height, so it
 * never rides up under a logomark. `GRAB.stick` is the dwell: a move smaller
 * than that leaves the pill where it is, which is what stops it twitching.
 *
 * The element needs the `.kol-rail-grab` class for the drawing (kol-animation.css);
 * this hook only supplies `is-near` and `--kol-rail-grab-y`.
 *
 * @param {React.RefObject<HTMLElement>} ref  the grab handle
 */
export default function useGrabEdge(ref) {
  useEffect(() => {
    let raf = 0
    const onMove = ({ clientX, clientY }) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = ref.current
        if (!h) return
        const r = h.getBoundingClientRect()
        const dist = Math.abs(clientX - (r.left + r.width / 2))
        const near = dist <= GRAB.near || (h.classList.contains('is-near') && dist <= GRAB.sleep)
        h.classList.toggle('is-near', near)
        if (!near) return
        /* the travel band: bipolar from the middle, GRAB.range of the height */
        const edge = (r.height * (1 - GRAB.range)) / 2
        const along = Math.min(Math.max(clientY - r.top, edge), r.height - edge)
        if (h.dataset.grabSeeded && Math.abs(along - Number(h.dataset.grabTarget)) < GRAB.stick) return
        h.dataset.grabTarget = String(along)
        const vars = { '--kol-rail-grab-y': `${along}px` }
        /* the CSS fallback is 50%, a percentage — nothing to tween from, so the
         * first sighting sets and every move after tweens */
        if (h.dataset.grabSeeded) gsap.to(h, { ...vars, ...GRAB.travel, overwrite: 'auto' })
        else { gsap.set(h, vars); h.dataset.grabSeeded = '1' }
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [ref])
}
