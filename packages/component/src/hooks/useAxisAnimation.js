import { useCallback, useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'

/**
 * useAxisAnimation — ping-pong rAF over a variable-font axis range.
 *
 * Owns a single numeric value that auto-oscillates between `min` and `max`
 * (bouncing at each end) while `running` is true, then hands the value + a
 * setter back to the caller so a slider can scrub it (scrub = call `setValue`,
 * flip `running` off). This is the reusable core lifted out of the monorepo's
 * VariableFontSection, whose auto-oscillator was inline and unguarded.
 *
 * Timing uses the `performance.now()` interval-accumulator pattern (the same
 * shape as fontviewer's GlyphAnimator) rather than a `Date.now()` / `delta>16`
 * throttle — the accumulator carries the sub-interval remainder so the step is
 * frame-rate independent and doesn't jitter.
 *
 * Reduced-motion gate: when the user asks for reduced motion the loop never
 * mounts and the hook returns its static default (`initial`, else the range
 * midpoint) — the widget still renders and stays scrubbable, it just doesn't
 * auto-play. `reduced` is returned so the caller can reflect it in its
 * play/pause affordance.
 *
 * The value is axis-agnostic: the render boundary decides whether it feeds
 * `fontWeight` (wght) or `font-variation-settings` (wdth/slnt/…).
 *
 * @param {Object}  opts
 * @param {number}  opts.min      - Lower bound of the oscillation + slider min (default 300).
 * @param {number}  opts.max      - Upper bound of the oscillation + slider max (default 900).
 * @param {number}  opts.step     - Units advanced per frame (default 2).
 * @param {number}  opts.fps      - Target frame cadence for the accumulator (default 60).
 * @param {boolean} opts.running  - Whether the loop is active (default true). Gated by reduced-motion.
 * @param {number}  opts.initial  - Starting / reduced-motion static value (default range midpoint).
 * @returns {{ value: number, setValue: (v:number)=>void, reduced: boolean }}
 */
export default function useAxisAnimation({
  min = 300,
  max = 900,
  step = 2,
  fps = 60,
  running = true,
  initial,
} = {}) {
  const reduced = usePrefersReducedMotion()
  const staticDefault = initial ?? Math.round((min + max) / 2)

  const [value, setValueState] = useState(staticDefault)
  const valueRef = useRef(staticDefault)
  const dirRef = useRef(1)
  const rafRef = useRef(null)

  // External override (slider scrub). Keeps the ref in sync so a subsequent
  // resume ping-pongs from where the user left it, not from a stale value.
  const setValue = useCallback((v) => {
    valueRef.current = v
    setValueState(v)
  }, [])

  useEffect(() => {
    if (reduced || !running) return

    const interval = 1000 / fps
    let last = performance.now()

    const animate = (now) => {
      const elapsed = now - last
      if (elapsed >= interval) {
        let next = valueRef.current + dirRef.current * step
        if (next >= max) {
          next = max
          dirRef.current = -1
        } else if (next <= min) {
          next = min
          dirRef.current = 1
        }
        valueRef.current = next
        setValueState(next)
        // Carry the sub-interval remainder so the cadence stays even.
        last = now - (elapsed % interval)
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, running, min, max, step, fps])

  return { value, setValue, reduced }
}
