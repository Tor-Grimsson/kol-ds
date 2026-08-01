import { useId, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useTilt from '../hooks/useTilt.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import useCoarsePointer from '../hooks/useCoarsePointer.js'

/* The default mask: one closed blob authored in unit-square coordinates, so
 * it scales to any element size. Swap it via the `shape` prop — any path in
 * a 0..1 box works. */
const BLOB =
  'M.96.217L.855.834a.09.09 0 01-.07.072L.166.994A.09.09 0 01.06.9L.04.166A.09.09 0 01.15.073L.89.13a.09.09 0 01.07.087z'

/**
 * InteractiveImage — an image seen through an organic blob mask that
 * re-centres on the cursor, floating over a blurred, scaled copy of
 * itself. The whole stage tilts in 3D toward the pointer.
 *
 * Composed, not forked: the tilt is the shared `useTilt` hook (springs,
 * not tweens — the DS has one tilt and this is it), so the motion here
 * matches TiltCard and BentoCard rather than introducing a second feel.
 * The source's gsap tweens are gone with it; nothing else needed gsap.
 *
 * Motion is gated twice — on coarse-pointer devices and under
 * prefers-reduced-motion the mask sits centred, the tilt never mounts,
 * and no listeners are attached.
 *
 * The two SVG ids are per-instance (`useId`). The monorepo source hard-coded
 * them at module scope, so a second instance on the same page silently
 * clobbered the first one's clip path and pattern — the reason this was
 * lobbied as a fresh effect rather than a migration.
 *
 * Purely image-driven: no tokens, no colors, nothing to theme. Size comes
 * from the consumer via `className` — the stage fills its box.
 *
 * @param {string} src         image source, used by both the mask and the backdrop. Required
 * @param {string} alt         accessible name for the masked image
 * @param {string} className   classes on the root — supplies the size
 * @param {string} shape       SVG path `d` in unit-square coords; the mask outline
 * @param {number} magnitude   max tilt in degrees (±)
 * @param {number} perspective CSS transform perspective, in px
 * @param {number} blur        backdrop blur radius, in px
 * @param {number} backdropScale backdrop zoom, as a multiplier — hides the blur's soft edge
 */
export default function InteractiveImage({
  src,
  alt = '',
  className = '',
  shape = BLOB,
  magnitude = 10,
  perspective = 500,
  blur = 10,
  backdropScale = 1.1,
}) {
  const uid = useId()
  const clipId = `kol-ii-clip-${uid}`
  const patternId = `kol-ii-pattern-${uid}`

  const reducedMotion = usePrefersReducedMotion()
  const coarse = useCoarsePointer()
  const still = reducedMotion || coarse

  const tilt = useTilt({ magnitude, perspective })
  const boxRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  /* Mask centre in element coordinates; null until the pointer arrives, which
   * is also the resting state — `centre` below reads it as dead centre. */
  const [point, setPoint] = useState(null)

  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const centre = point ?? { x: size.width / 2, y: size.height / 2 }

  /* The unit blob is scaled up to the element box, then offset so its centre
   * lands under the pointer rather than at the origin. */
  const maskTransform = `translate(${centre.x - size.width / 2} ${centre.y - size.height / 2}) scale(${size.width} ${size.height})`

  const handleMove = (e) => {
    if (still) return
    tilt.onMouseMove(e)
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect) return
    setPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleLeave = () => {
    if (still) return
    tilt.onMouseLeave()
    setPoint(null)
  }

  return (
    <div
      ref={boxRef}
      className={`relative ${className}`}
      onMouseMove={still ? undefined : handleMove}
      onMouseLeave={still ? undefined : handleLeave}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${src})`,
          filter: `blur(${blur}px)`,
          transform: `scale(${backdropScale})`,
        }}
      />

      <motion.svg
        ref={tilt.ref}
        role="img"
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className="relative w-full h-full"
        viewBox={`0 0 ${size.width} ${size.height}`}
        style={still ? undefined : tilt.style}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={shape} transform={maskTransform} />
          </clipPath>
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={size.width}
            height={size.height}
          >
            <image
              href={src}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          clipPath={`url(#${clipId})`}
        />
      </motion.svg>
    </div>
  )
}
