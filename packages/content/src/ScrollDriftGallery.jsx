import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@kolkrabbi/kol-component'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_BG_KEYFRAMES = [
  { backgroundColor: '#000000', duration: 0 },
  { backgroundColor: '#0a0a08', duration: 0.15 },
  { backgroundColor: '#1a1812', duration: 0.3 },
  { backgroundColor: '#f5f0e8', duration: 0.5 }, // warm cream
  { backgroundColor: '#e8df00', duration: 0.7 }, // acid yellow
  { backgroundColor: '#c8ff00', duration: 0.85 }, // electric chartreuse
  { backgroundColor: '#0a0a0a', duration: 1 }, // back to black
]

// Deterministic per-index layout — depends only on index + count, so it
// survives without any per-item data.
function layoutFor(index, cardSpacing) {
  const seed = (index * 7 + 3) % 24
  const row = index % 3
  const baseY = [8, 35, 62][row] // top / middle / bottom (vh %)
  const y = baseY + ((seed % 7) - 3) * 3 // ± jitter
  const scale = [0.7, 1, 0.85, 1.15, 0.75, 0.95, 1.1, 0.8][index % 8]
  const rotation = ((seed % 5) - 2) * 1.5 // -3..+3 deg
  const parallaxSpeed = [0.6, 0.8, 1, 1.2, 0.7, 0.9, 1.1, 0.85][index % 8]
  const x = index * cardSpacing + (seed % 3) * 60 // horizontal slot + jitter
  const width = scale > 1 ? 400 : scale > 0.85 ? 340 : 280
  return { x, y, scale, rotation, parallaxSpeed, width, index }
}

/**
 * ScrollDriftGallery — a pinned hero where vertical scroll scrubs a horizontal
 * track ("The Drift"): the section pins and page-scroll drives (1) the track
 * sideways, (2) each floating card at its own parallax speed, (3) a keyframed
 * background-color journey, (4) a slow-parallax vertical title, and (5) a
 * bottom progress bar. Card geometry (y-row, scale, rotation, x-slot, width) is
 * derived deterministically from index + count; content is a `renderCard` slot.
 *
 * Requires GSAP ScrollTrigger (registered here). All tweens live in a
 * gsap.context reverted on cleanup, with invalidateOnRefresh + function-based
 * end/x so pin distance and travel recompute on resize. On
 * `prefers-reduced-motion` the rig is skipped entirely and the cards render in
 * a plain horizontally-scrollable row.
 *
 * @param {any[]}    items       cards; drives layout count + totalWidth
 * @param {(item:any,meta:{scale,rotation,width,index})=>ReactNode} renderCard card slot
 * @param {Function} onCardClick (item, index) => void — click on a card
 * @param {number}   totalWidth  scroll/scrub distance (default items.length*cardSpacing + 800)
 * @param {ReactNode} title      giant vertical wordmark (content — author case at call site)
 * @param {ReactNode} intro      opening breathing-space slot
 * @param {ReactNode} outro      end-CTA slot
 * @param {Array<{backgroundColor,duration}>} bgKeyframes background-color journey (fractional durations 0→1)
 * @param {number}   cardSpacing horizontal slot pitch, px (default 520)
 */
export default function ScrollDriftGallery({
  items = [],
  renderCard,
  onCardClick,
  totalWidth,
  title,
  intro,
  outro,
  bgKeyframes = DEFAULT_BG_KEYFRAMES,
  cardSpacing = 520,
}) {
  const bgRef = useRef(null)
  const containerRef = useRef(null)
  const horizontalRef = useRef(null)
  const titleRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const layout = useMemo(
    () => items.map((_, i) => layoutFor(i, cardSpacing)),
    [items, cardSpacing],
  )
  const resolvedTotalWidth = totalWidth ?? items.length * cardSpacing + 800

  useEffect(() => {
    if (reducedMotion) return undefined

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${resolvedTotalWidth}`,
      }

      // (1) Pin + horizontal scrub.
      gsap.to(horizontalRef.current, {
        x: () => -(resolvedTotalWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: { ...trigger, scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      })

      // (2) Background-color journey.
      gsap.to(bgRef.current, { scrollTrigger: { ...trigger, scrub: true }, keyframes: bgKeyframes })

      // (3) Title slow-parallax (0.3× the track).
      gsap.to(titleRef.current, {
        x: () => -(resolvedTotalWidth - window.innerWidth) * 0.3,
        ease: 'none',
        scrollTrigger: { ...trigger, scrub: 1 },
      })

      // (4) Per-card parallax.
      const cards = horizontalRef.current?.querySelectorAll('[data-drift-card]')
      cards?.forEach((card, i) => {
        const meta = layout[i]
        if (!meta) return
        gsap.to(card, {
          x: (meta.parallaxSpeed - 1) * 300,
          ease: 'none',
          scrollTrigger: { ...trigger, scrub: 1 },
        })
      })

      // (5) Progress bar.
      const bar = containerRef.current?.querySelector('[data-drift-progress]')
      if (bar) gsap.to(bar, { width: '100%', ease: 'none', scrollTrigger: { ...trigger, scrub: true } })
    }, containerRef)

    return () => ctx.revert()
  }, [layout, resolvedTotalWidth, bgKeyframes, reducedMotion])

  // Reduced-motion fallback: plain horizontal scroll, no pin, no gsap.
  if (reducedMotion) {
    return (
      <div style={{ backgroundColor: bgKeyframes[bgKeyframes.length - 1]?.backgroundColor || '#0a0a0a' }}>
        <section className="relative overflow-hidden py-16">
          {title != null && (
            <div className="px-6 pb-8" style={{ writingMode: 'horizontal-tb' }}>
              <span className="text-[12vw] font-bold tracking-[-0.04em] leading-none opacity-[0.06]">{title}</span>
            </div>
          )}
          <div className="flex items-center gap-8 overflow-x-auto px-6 pb-6">
            {intro != null && <div className="flex-shrink-0">{intro}</div>}
            {items.map((item, i) => {
              const meta = layout[i]
              return (
                <div
                  key={i}
                  className="flex-shrink-0 cursor-pointer"
                  style={{ width: `${meta.width}px` }}
                  onClick={() => onCardClick?.(item, i)}
                >
                  {renderCard?.(item, meta)}
                </div>
              )
            })}
            {outro != null && <div className="flex-shrink-0">{outro}</div>}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div ref={bgRef} style={{ backgroundColor: bgKeyframes[0]?.backgroundColor || '#000000' }} className="transition-colors duration-0">
      <section ref={containerRef} className="relative h-screen overflow-hidden">
        {/* Vertical title — pinned, slow parallax */}
        {title != null && (
          <div
            ref={titleRef}
            className="absolute left-8 top-0 h-full flex items-center z-10 pointer-events-none select-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            <span className="text-[20vw] font-bold tracking-[-0.04em] leading-none opacity-[0.06] mix-blend-difference">{title}</span>
          </div>
        )}

        {/* Horizontal track */}
        <div ref={horizontalRef} className="absolute top-0 left-0 h-full flex items-start" style={{ width: `${resolvedTotalWidth}px` }}>
          {/* Opening breathing space */}
          {intro != null && (
            <div className="flex-shrink-0 w-[50vw] h-full flex items-center justify-center">{intro}</div>
          )}

          {/* Floating cards */}
          {layout.map((meta, i) => (
            <div
              key={i}
              data-drift-card
              className="absolute cursor-pointer group"
              style={{
                left: `${meta.x + 600}px`, // offset past the opening space
                top: `${meta.y}%`,
                width: `${meta.width}px`,
                transform: `rotate(${meta.rotation}deg) scale(${meta.scale})`,
                transformOrigin: 'center center',
              }}
              onClick={() => onCardClick?.(items[i], i)}
            >
              {renderCard?.(items[i], meta)}
            </div>
          ))}

          {/* End CTA */}
          {outro != null && (
            <div className="absolute top-1/2 -translate-y-1/2 text-center" style={{ left: `${resolvedTotalWidth - 500}px` }}>
              {outro}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-fg-08">
          <div data-drift-progress className="h-full bg-accent-primary" style={{ width: '0%' }} />
        </div>
      </section>
    </div>
  )
}
