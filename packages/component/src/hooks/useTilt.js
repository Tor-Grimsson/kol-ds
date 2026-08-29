import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { SPRING } from '../utilities/motion.js'

/**
 * Pointer-driven 3D tilt (framer-motion springs) — the ONE tilt hook.
 * Ported from the monorepo's useBentoTiltMotion; the Tilt family — TiltCard,
 * TiltBento — composes this instead of forking their own.
 *
 * Returns `{ ref, style, onMouseMove, onMouseLeave, motionValues }` —
 * spread `ref`/handlers on a `motion.div` and pass `style` to it.
 * `motionValues` exposes the raw springs for derived variants
 * (e.g. TiltCard's `grounded` zone-snapping).
 *
 * Defaults are the design: tilt ±4°, spring 350/35, perspective 700,
 * rest position center (0.5/0.5). The two spring sets are `SPRING.tilt` and
 * `SPRING.lazy` in `utilities/motion.js` — the JS mirror of kol-animation.css,
 * so a tween elsewhere in the estate cannot drift from this feel (2026-08-28).
 *
 * `grounded` (ShelfCardTiltWrapsCard, kol-website 2026-08-27 — lifted out of
 * TiltCardInner so the shelf and the card share ONE feel, no new component):
 * the "planted at the bottom" tilt — targets snapped to 3 zones, rescaled to
 * ±2.5°, chased by a lazy spring (250/25/0.6), rotateX clamped to min(0, …) so
 * it only ever tilts back, pivoting about `center bottom`.
 */
export default function useTilt({
  magnitude = 4,
  perspective = 700,
  stiffness = SPRING.tilt.stiffness,
  damping = SPRING.tilt.damping,
  grounded = false,
} = {}) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springX = useSpring(useTransform(mouseY, [0, 1], [magnitude, -magnitude]), { stiffness, damping })
  const springY = useSpring(useTransform(mouseX, [0, 1], [-magnitude, magnitude]), { stiffness, damping })

  /* the grounded springs always exist (hooks are unconditional) and are only
   * SELECTED when asked for — a free tilt pays two idle springs, nothing more */
  const zones = 3
  const snap = (v) => Math.round(v * zones) / zones
  const lazy = SPRING.lazy
  const lazyX = useSpring(useTransform(springX, (v) => Math.min(0, snap(-v / magnitude) * 2.5)), lazy)
  const lazyY = useSpring(useTransform(springY, (v) => snap(v / magnitude) * 2.5), lazy)
  const rotateX = grounded ? lazyX : springX
  const rotateY = grounded ? lazyY : springY

  const onMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const onMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return {
    ref,
    style: {
      rotateX,
      rotateY,
      transformStyle: 'preserve-3d',
      transformPerspective: perspective,
      ...(grounded ? { transformOrigin: 'center bottom' } : null),
    },
    onMouseMove,
    onMouseLeave,
    motionValues: { mouseX, mouseY, rotateX, rotateY },
  }
}
