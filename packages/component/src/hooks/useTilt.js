import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Pointer-driven 3D tilt (framer-motion springs) — the ONE tilt hook.
 * Ported from the monorepo's useBentoTiltMotion; TiltCard, BentoCard and
 * friends all compose this instead of forking their own.
 *
 * Returns `{ ref, style, onMouseMove, onMouseLeave, motionValues }` —
 * spread `ref`/handlers on a `motion.div` and pass `style` to it.
 * `motionValues` exposes the raw springs for derived variants
 * (e.g. TiltCard's `grounded` zone-snapping).
 *
 * Defaults are the design: tilt ±4°, spring 350/35, perspective 700,
 * rest position center (0.5/0.5).
 */
export default function useTilt({
  magnitude = 4,
  perspective = 700,
  stiffness = 350,
  damping = 35,
} = {}) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [magnitude, -magnitude]), { stiffness, damping })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-magnitude, magnitude]), { stiffness, damping })

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
    style: { rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: perspective },
    onMouseMove,
    onMouseLeave,
    motionValues: { mouseX, mouseY, rotateX, rotateY },
  }
}
