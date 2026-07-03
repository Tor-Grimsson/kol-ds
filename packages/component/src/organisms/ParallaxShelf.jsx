import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import WorkCard from './WorkCard.jsx'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/* Scroll-driven parallax strength — fraction of scroll delta applied to the
 * shelf. Eases in quadratically with page-scroll progress (min → max). */
const SCROLL_PARALLAX_MIN = 0.1
const SCROLL_PARALLAX_MAX = 0.4
const DRAG_THRESHOLD_SQ = 25
/* Aligned edge gets the big gutter so the first/last card lands under a
 * 1400px content column. */
const EDGE_GUTTER = 'max(4rem, calc((100vw - 1400px) / 2 + 16rem))'

/**
 * ParallaxShelf — one horizontal shelf row: a drag-free Embla carousel of
 * project cards with scroll-driven parallax. As the page scrolls the track is
 * nudged horizontally by `delta × parallax × direction`, the strength easing in
 * the further down the page you are; alternating rows (`fromLeft`) scroll in
 * opposite directions for a woven wall of shelves. Includes a drag-vs-click
 * guard (a drag never fires a card link) and an edge-aligned category label.
 *
 * Calls `useEmblaCarousel` directly (FeaturedCarousel's precedent) because the
 * parallax nudge needs `internalEngine()`, which DS Carousel encapsulates and
 * must not be modified. The source's `WheelGesturesPlugin` is dropped (not a
 * DS dependency). Parallax is disabled under prefers-reduced-motion and on
 * small screens — both fall back to a plain wheel/drag carousel.
 *
 * Card-agnostic via `renderCard`; defaults to DS **WorkCard** with an
 * `index`-staggered ragged height. Pass a plain `items` array of flat project
 * objects (no Sanity keying).
 *
 * Text casing: the label renders verbatim (author `type.label` as e.g.
 * "Client Work") — no text-transform.
 *
 * @param {{label:string}} type       category; `label` renders in the edge caption
 * @param {Array}          items      flat project objects passed to the card renderer
 * @param {boolean}        fromLeft   direction of alignment / start index / parallax sign / label side (default false)
 * @param {Function}       renderCard (item, index) => ReactNode — card renderer (default WorkCard)
 * @param {Function}       onNavigate (href, event) => void — forwarded to the default WorkCard
 * @param {string}         className  extra classes on the section
 */
export default function ParallaxShelf({
  type,
  items = [],
  fromLeft = false,
  renderCard,
  onNavigate,
  className = '',
}) {
  const reduced = usePrefersReducedMotion()
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    align: fromLeft ? 'end' : 'start',
    containScroll: 'trimSnaps',
    ...(fromLeft && { startIndex: items.length - 1 }),
  })

  const sectionRef = useRef(null)
  const lastScrollY = useRef(0)

  // Scroll-driven parallax: page scroll nudges the carousel while in view.
  useEffect(() => {
    if (!emblaApi || reduced || isMobile) return
    lastScrollY.current = window.scrollY

    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const inView = rect.bottom > 0 && rect.top < window.innerHeight
      if (!inView) {
        lastScrollY.current = window.scrollY
        return
      }
      const delta = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY
      const scrollProgress = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1)
      const parallax = SCROLL_PARALLAX_MIN + (SCROLL_PARALLAX_MAX - SCROLL_PARALLAX_MIN) * (scrollProgress * scrollProgress)
      const engine = emblaApi.internalEngine()
      const offset = delta * parallax * (fromLeft ? 1 : -1)
      engine.scrollBody.useDuration(0)
      engine.scrollTo.distance(offset, false)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [emblaApi, fromLeft, reduced, isMobile])

  // Drag-vs-click guard (5px): a drag suppresses the ensuing card-link click.
  const dragged = useRef(false)
  const pointerStart = useRef({ x: 0, y: 0 })
  const onPointerDown = useCallback((e) => {
    dragged.current = false
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }, [])
  const onPointerMove = useCallback((e) => {
    if (dragged.current) return
    const dx = e.clientX - pointerStart.current.x
    const dy = e.clientY - pointerStart.current.y
    if (dx * dx + dy * dy > DRAG_THRESHOLD_SQ) dragged.current = true
  }, [])
  const onClickCapture = useCallback((e) => {
    if (dragged.current) e.preventDefault()
  }, [])

  const card = (item, i) =>
    renderCard ? renderCard(item, i) : <WorkCard key={i} {...item} index={i} onNavigate={onNavigate} />

  return (
    <section ref={sectionRef} className={`py-6 md:py-16 ${className}`.trim()}>
      <div
        className="overflow-visible select-none"
        ref={emblaRef}
        style={{
          paddingLeft: fromLeft ? undefined : EDGE_GUTTER,
          paddingRight: fromLeft ? EDGE_GUTTER : undefined,
        }}
      >
        <div
          className="flex gap-8 items-end"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onClickCapture={onClickCapture}
        >
          {items.map((item, i) => card(item, i))}
        </div>
      </div>

      {type?.label && (
        <div className={`max-w-[1400px] mx-auto mt-4 md:mt-6 ${fromLeft ? 'pr-4 md:pr-64 text-right' : 'pl-4 md:pl-64'}`}>
          <p className="kol-helper-12 text-auto">{type.label}</p>
        </div>
      )}
    </section>
  )
}
