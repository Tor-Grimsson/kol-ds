import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import useTilt from '../hooks/useTilt.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * True on coarse-pointer (touch) devices. Local to TiltCard; re-evaluates on
 * device/orientation change via the media-query change event (the monorepo
 * source froze this in a module-load const — fixed on recreate).
 */
function useCoarsePointer() {
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

/**
 * TiltCard — self-contained image card with a spring-based 3D tilt that
 * follows the pointer (via the shared useTilt hook). On coarse-pointer
 * devices or when the user prefers reduced motion it renders a plain,
 * tilt-free card — no springs, no listeners.
 *
 * `variant="grounded"` gives a "planted at the bottom" feel: tilt targets
 * are snapped to 3 zones, rescaled, chased by a slower lazy spring, and the
 * card only ever tilts back — never forward — pivoting about its bottom edge
 * (`transform-origin: center bottom`).
 *
 * Purely structural — no tokens, no colors. Corner radius, size, and any
 * surface treatment come from the consumer via `className` (the image
 * wrapper is `rounded-[inherit]`, so the root's radius clips the image);
 * overlays (labels, gradients) render above the image via `children`.
 *
 * @param {string}    src         image source (rendered `object-cover`)
 * @param {string}    alt         image alt text
 * @param {string}    className   classes on the root — supplies size + corner radius
 * @param {string}    variant     'default' (free tilt) | 'grounded' (zone-snapped, bottom-pinned)
 * @param {number}    magnitude   max tilt in degrees (±)
 * @param {number}    perspective CSS transform perspective in px
 * @param {ReactNode} children    content overlaid above the image
 */
export default function TiltCard({
  src,
  alt = '',
  className = '',
  variant = 'default',
  magnitude = 4,
  perspective = 700,
  children,
}) {
  const coarse = useCoarsePointer()
  const reduced = usePrefersReducedMotion()

  if (coarse || reduced) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
        {children}
      </div>
    )
  }

  return (
    <TiltCardInner
      src={src}
      alt={alt}
      className={className}
      variant={variant}
      magnitude={magnitude}
      perspective={perspective}
    >
      {children}
    </TiltCardInner>
  )
}

function TiltCardInner({ src, alt, className, variant, magnitude, perspective, children }) {
  const tilt = useTilt({ magnitude, perspective })
  const grounded = variant === 'grounded'

  /* Zone-based tilt: normalize the spring output back to -1..1, snap it to
   * 3 zones, rescale to ±2.5°, and let a slower lazy spring catch up so the
   * card lags and settles into quantized angles. rotateX is clamped to
   * min(0, …) — grounded cards only ever tilt back. */
  const zones = 3
  const snap = (v) => Math.round(v * zones) / zones
  const lazySpring = { stiffness: 250, damping: 25, mass: 0.6 }

  const targetX = useTransform(tilt.motionValues.rotateX, (v) =>
    grounded ? Math.min(0, snap(-v / magnitude) * 2.5) : v,
  )
  const targetY = useTransform(tilt.motionValues.rotateY, (v) =>
    grounded ? snap(v / magnitude) * 2.5 : v,
  )

  const lazyRotateX = useSpring(targetX, lazySpring)
  const lazyRotateY = useSpring(targetY, lazySpring)

  const style = grounded
    ? { ...tilt.style, rotateX: lazyRotateX, rotateY: lazyRotateY, transformOrigin: 'center bottom' }
    : tilt.style

  return (
    <motion.div
      ref={tilt.ref}
      className={`relative ${className}`}
      style={style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      {children}
    </motion.div>
  )
}
