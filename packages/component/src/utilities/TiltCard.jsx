import { motion } from 'framer-motion'
import useTilt from '../hooks/useTilt.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import useCoarsePointer from '../hooks/useCoarsePointer.js'

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
  /* the grounded feel — zones, ±2.5°, the lazy spring, the bottom pivot — lives
   * in useTilt now (ShelfCardTiltWrapsCard, 2026-08-27), so the shelf's card
   * wrapper and this frame are one motion, not two copies of eight lines */
  const tilt = useTilt({ magnitude, perspective, grounded: variant === 'grounded' })

  return (
    <motion.div
      ref={tilt.ref}
      className={`relative ${className}`}
      style={tilt.style}
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
