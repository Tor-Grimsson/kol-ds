import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { ContentCard, useCoarsePointer, useTilt } from '@kolkrabbi/kol-component'

/* WorkCard's ragged ladder, lifted (WorkCardAndShelf, 2026-08-27 — user: "it should
 * be using the same card with 3 height sizes"): the shelf renders ContentCard
 * work on it; WorkCard itself is retiring. */
const HEIGHTS = ['h-[408px] md:h-[560px]', 'h-[372px] md:h-[520px]', 'h-[336px] md:h-[480px]']
const TYPE_LABELS = { client: 'Client', collection: 'Collection', typeface: 'Typeface', tool: 'Tool', system: 'System' }
import { usePrefersReducedMotion } from '@kolkrabbi/kol-component'

/* Scroll-driven parallax strength — fraction of scroll delta applied to the
 * shelf. Eases in quadratically with page-scroll progress (min → max). */
const SCROLL_PARALLAX_MIN = 0.1
const SCROLL_PARALLAX_MAX = 0.4
const DRAG_THRESHOLD_SQ = 25
/* Aligned edge gets the big gutter so the first/last card lands under a
 * 1400px content column. */
const EDGE_GUTTER = 'max(4rem, calc((100vw - 1400px) / 2 + 16rem))'

/* The retired WorkCard's entrance, verbatim (ShelfCardMotion, kol-website
 * 2026-08-27 — lived in the site's `ShelfEnter` until the shelf card carried
 * it): a perspective wrapper and a rotateX/translateY settle staggered by
 * index on the house curve — one rAF after mount flips `ready`, plain CSS
 * transition. Under prefers-reduced-motion it renders settled. */
const ENTER_EASE = 'var(--kol-ease-house)'
function ShelfEnter({ index, settled = false, children }) {
  const [ready, setReady] = useState(settled)
  useEffect(() => {
    if (settled) return undefined
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [settled])
  return (
    <div className="h-full" style={{ perspective: 800 }}>
      <div
        className="h-full"
        style={{
          transformOrigin: 'bottom center',
          opacity: ready ? 1 : 0,
          transform: ready ? 'rotateX(0deg) translateY(0px)' : `rotateX(${20 + (index % 3) * 8}deg) translateY(${30 + (index % 4) * 10}px)`,
          transition: `opacity ${0.7 + (index % 3) * 0.15}s ${ENTER_EASE} ${index * 0.07}s, transform ${0.7 + (index % 3) * 0.15}s ${ENTER_EASE} ${index * 0.07}s`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* THE TILT WRAPS THE CARD, NOT THE IMAGE (ShelfCardTiltWrapsCard, kol-website
 * 2026-08-27 — user on /work: "it does but is clipped by some mask container").
 * 0.12.0 put TiltCard in the media slot, under ContentMedia's and the card's
 * overflow-hidden — the frame, border and radius stayed still while the
 * artwork leaned inside them, and the work card's `.kol-media-zoom > img` rule
 * died with the <img> two levels down. The retired WorkCard tilted at its ROOT.
 * So: the DS's ONE hook, grounded, on a wrapper around the whole card — border
 * and radius lean with the artwork — and a plain <img> back in the slot so the
 * zoom fires again. No new component: the Tilt family stays three. */
function ShelfTilt({ children }) {
  const tilt = useTilt({ grounded: true })
  return (
    <motion.div ref={tilt.ref} className="h-full" style={tilt.style} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
      {children}
    </motion.div>
  )
}

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
 * DS dependency) — consumers re-inject it (or any Embla plugin) through the
 * `plugins` pass-through; the DS itself stays plugin-free. Parallax is
 * disabled under prefers-reduced-motion and on small screens — both fall
 * back to a plain wheel/drag carousel.
 *
 * Card-agnostic via `renderCard`; defaults to `ContentCard work` on the ragged
 * ladder with the retired WorkCard's two motions (ShelfCardMotion, kol-website
 * 2026-08-27 — shelf-only; the site's grid card is a plain ContentCard): the
 * staggered perspective **entrance** (`enter`) and `TiltCard variant="grounded"`
 * in the media slot (`tilt`). Pass a plain `items` array of flat project
 * objects (no Sanity keying).
 *
 * Text casing: the label renders verbatim (author `type.label` as e.g.
 * "Client Work") — no text-transform.
 *
 * @param {{label:string}} type       category; `label` renders in the edge caption
 * @param {Array}          items      flat project objects passed to the card renderer
 * @param {boolean}        fromLeft   direction of alignment / start index / parallax sign / label side (default false)
 * @param {Function}       renderCard (item, index) => ReactNode — card renderer (default: ContentCard work on the ragged ladder)
 * @param {Function}       onNavigate (href, event) => void — forwarded to the default card
 * @param {string[]}       heights    override the ragged ladder (index % heights.length)
 * @param {boolean}        enter      the entrance settle on the default card (default true; settled under reduced motion)
 * @param {boolean}        tilt       grounded TiltCard in the default card's media slot (default true; TiltCard falls back to the plain image on coarse pointer / reduced motion)
 * @param {string}         titleClass · metaClass  forwarded to the default card's ContentText (the site passes its face)
 * @param {string}         className  extra classes on the section
 * @param {Array}          plugins    Embla plugins, forwarded verbatim to `useEmblaCarousel`
 *                         (e.g. the consumer's own WheelGesturesPlugin) — the DS carries none
 */
export default function ParallaxShelf({
  type,
  items = [],
  fromLeft = false,
  renderCard,
  heights = HEIGHTS,
  enter = true,
  tilt = true,
  titleClass,
  metaClass,
  onNavigate,
  className = '',
  plugins,
}) {
  const reduced = usePrefersReducedMotion()
  const coarse = useCoarsePointer()
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    align: fromLeft ? 'end' : 'start',
    containScroll: 'trimSnaps',
    ...(fromLeft && { startIndex: items.length - 1 }),
  }, plugins)

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

  const card = (item, i) => {
    if (renderCard) return renderCard(item, i)
    const meta = [item.client || TYPE_LABELS[item.type] || item.type, item.year].filter(Boolean).join(' · ')
    const media = item.thumbnail ? <img src={item.thumbnail} alt="" loading="lazy" /> : undefined
    const node = (
      <ContentCard
        variant="work"
        ratio="auto"
        className="h-full"
        title={item.title}
        meta={meta || undefined}
        media={media}
        href={item.href}
        onNavigate={onNavigate ? (e) => onNavigate(item.href, e) : undefined}
        titleClass={titleClass}
        metaClass={metaClass}
      />
    )
    /* coarse pointer / reduced motion: a plain card, as TiltCard rendered it */
    const tilted = tilt && !coarse && !reduced ? <ShelfTilt>{node}</ShelfTilt> : node
    return (
      <div key={item.href ?? i} className={`flex-none w-[280px] md:w-[400px] ${heights[i % heights.length]}`}>
        {enter ? <ShelfEnter index={i} settled={reduced}>{tilted}</ShelfEnter> : tilted}
      </div>
    )
  }

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
          {/* the edge caption is the eyebrow (WorkCardAndShelf, 2026-08-27) */}
          <p className="kol-eyebrow text-fg-64">{type.label}</p>
        </div>
      )}
    </section>
  )
}
