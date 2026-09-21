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
 * this hook only supplies `is-near` and the travel variable.
 *
 * BOTH AXES (BrowsePageRulingsAndSeams, kol-r2b2 2026-09-02). A rail has one
 * vertical edge; `ColumnBrowser` has a vertical handle per column AND a
 * horizontal one along its foot, and the user's ruling is that they wear the
 * same gesture. `axis` says which way the pill TRAVELS, and the near test is
 * always the other one — a vertical line is approached across x, a horizontal
 * line across y:
 *
 *   axis: 'y'  (default)  vertical edge  · near on x · travels on y · --kol-rail-grab-y
 *   axis: 'x'             horizontal edge · near on y · travels on x · --kol-rail-grab-x
 *
 * The `-y` name is kept as it shipped rather than renamed to something
 * axis-neutral: it is a published token the rail's CSS reads, and the pair
 * `-x`/`-y` names two real axes rather than one concept twice.
 *
 * TUNING IS PER-EDGE (BrowsePageRulingsAndSeams, 2026-09-02 — user: *"its a bit
 * different, its not like the sidenav"*). The rail's dwell-and-throw is its own
 * ruling, not a house constant every edge inherits: `ColumnBrowser`'s handles
 * were ruled on their own feel in kol-r2b2 — a longer chase and a much smaller
 * retarget threshold, so the pill tracks the pointer closely instead of landing
 * and holding. `GRAB` stays the default, so the rail does not move.
 *
 * @param {React.RefObject<HTMLElement>} ref  the grab handle
 * EVERY tuning key the constants carry is an option, so a whole set spreads in
 * (`useGrabEdge(ref, { axis, ...GRAB_COLUMN })`) with nothing silently dropped
 * — a key the hook did not read would be a seam wired to nothing.
 *
 * @param {{axis?: 'x'|'y', near?: number, sleep?: number, travel?: object, stick?: number, range?: number}} [options]
 *        `axis` — which way the pill travels (default 'y').
 *        `near` / `sleep` — wake and sleep distance from the line, the hysteresis pair.
 *        `travel` — the gsap chase (default `GRAB.travel`).
 *        `stick` — px the pointer must move before the pill re-targets (default `GRAB.stick`).
 *        `range` — the travel band as a fraction of the edge (default `GRAB.range`).
 */
export default function useGrabEdge(ref, {
  axis = 'y',
  near: nearAt = GRAB.near,
  sleep = GRAB.sleep,
  travel = GRAB.travel,
  stick = GRAB.stick,
  range = GRAB.range,
} = {}) {
  useEffect(() => {
    let raf = 0
    const onMove = ({ clientX, clientY }) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = ref.current
        if (!h) return
        const r = h.getBoundingClientRect()
        const vertical = axis === 'y'
        /* the near test is ACROSS the line, the travel ALONG it */
        const across = vertical ? clientX - (r.left + r.width / 2) : clientY - (r.top + r.height / 2)
        const dist = Math.abs(across)
        const near = dist <= nearAt || (h.classList.contains('is-near') && dist <= sleep)
        h.classList.toggle('is-near', near)
        if (!near) return
        /* the travel band: bipolar from the middle, `range` of the span */
        const span = vertical ? r.height : r.width
        const start = vertical ? r.top : r.left
        const point = vertical ? clientY : clientX
        const edge = (span * (1 - range)) / 2
        const along = Math.min(Math.max(point - start, edge), span - edge)
        if (h.dataset.grabSeeded && Math.abs(along - Number(h.dataset.grabTarget)) < stick) return
        h.dataset.grabTarget = String(along)
        const vars = { [vertical ? '--kol-rail-grab-y' : '--kol-rail-grab-x']: `${along}px` }
        /* the CSS fallback is 50%, a percentage — nothing to tween from, so the
         * first sighting sets and every move after tweens */
        if (h.dataset.grabSeeded) gsap.to(h, { ...vars, ...travel, overwrite: 'auto' })
        else { gsap.set(h, vars); h.dataset.grabSeeded = '1' }
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [ref, axis, nearAt, sleep, travel, stick, range])
}
