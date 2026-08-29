import { isValidElement, useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from '../atoms/Image.jsx'
import HlsVideo from '../atoms/HlsVideo.jsx'
import EmblaNav from '../molecules/EmblaNav.jsx'
import OverlayGlassPanel from '../utilities/OverlayGlassPanel.jsx'

/**
 * Per-slide media layer: a `{ src, kind }` descriptor becomes a cover-fit
 * Image / HlsVideo / inert <video> pinned over the frame
 * (`.kol-featured-carousel-media` — absolute inset-0 object-cover, CSS in
 * @kol/theme, out-cascades Image's baked `h-auto`). A ready ReactNode renders
 * as-is and must position itself (give it that same class). `onEnded` /
 * `onTimeUpdate` attach to video elements only — they drive the active slide's
 * auto-advance and the progress bar; images ignore them.
 */
/* The plain (non-HLS) video plays only while its slide is on stage
 * (FeaturedCarouselFullWidth, 2026-08-26): every slide's video used to
 * autoplay, so the peeking neighbours ran beside the active one. */
function InertVideo({ active, ...props }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (active) v.play?.()?.catch?.(() => {})
    else v.pause()
  }, [active])
  return <video ref={ref} autoPlay={active} {...props} />
}

function SlideMedia({ media, active = true, onEnded, onTimeUpdate }) {
  if (!media) return null
  if (isValidElement(media)) return media

  const { src, kind = 'image', poster, srcSet, alt = '' } = media

  if (kind === 'video') {
    // Non-HLS file (mp4/webm): a plain inert video. HLS manifests and the
    // poster-only case go through HlsVideo, which owns hls.js attachment and
    // the non-interactive hardening set. `loop` is dropped once `onEnded` is
    // wired so the active slide plays once, then advances.
    if (src && !src.endsWith('.m3u8')) {
      return (
        <InertVideo
          active={active}
          src={src}
          poster={poster}
          className="kol-featured-carousel-media"
          style={{ pointerEvents: 'none' }}
          loop={!onEnded}
          muted
          playsInline
          controls={false}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
        />
      )
    }
    return (
      <HlsVideo
        src={src}
        poster={poster}
        active={active}
        className="kol-featured-carousel-media"
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
    )
  }

  return (
    <Image
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? '100vw' : undefined}
      alt={alt}
      loading="eager"
      className="kol-featured-carousel-media"
    />
  )
}

/**
 * @deprecated 2026-08-26 as a consumer import — `SectionHero media={[…]}` is
 * the one hero (SectionHeroRound2); this stays as its engine and renders
 * unchanged. Removed from the barrel at the next major.
 *
 * FeaturedCarousel — a full-width carousel of featured media: each wide slide
 * is a fixed-height frame with an image or HLS-video background and a centered
 * OverlayGlassPanel (title / description / CTA), plus prev/next and optional
 * autoplay with a progress bar.
 *
 * Rebuilt on the DS Carousel *core*: it renders the same embla + `kol-embla`
 * chrome (`.is-slides` wide-slide mode, `kol-embla-controls` prev/next) rather
 * than the `Carousel` component, because the autoplay ring needs the embla api
 * that Carousel encapsulates and Carousel.jsx must not be modified. The
 * autoplay/progress behavior lives here, wrapped around that core — a timer
 * for image slides, the video's `ended` event for video slides, and a progress
 * bar fed by the same clock (rAF for images, `timeupdate` for video).
 *
 * Presentational — no copy, no CDN paths, no routes. The monorepo source's
 * foundry coupling (name-based title size ramp, per-typeface `fontFamily`, the
 * `'Explore Typeface'` default) is dropped: titles default to a plain KOL type
 * class and are fully overridable via `renderTitle` / `titleClassName`. The
 * CTA is a plain anchor styled with the DS button classes plus an `onNavigate`
 * seam (router-agnostic — call `preventDefault` inside it for SPA nav).
 *
 * RECONCILED 2026-08-15 against kol-website's fork (231L vs 259L, 458 diff
 * lines). They were never a fork — two different engines. The fork ran
 * framer-motion `AnimatePresence` over an index, which means **no drag at all**;
 * this one runs embla, so the canon call went to the engine here, and with it
 * the `{ media }` descriptor, OverlayGlassPanel, and the progress ring. Five
 * capabilities crossed the other way — `children`, `fullWidth`, `rounded`, the
 * `show*` visibility toggles and `subtitle` — plus the header nav placement.
 * Deliberately NOT carried: the foundry title coupling (a size ramp keyed on
 * the literal strings 'Málrómur'/'Tröllatunga' and a per-typeface inline
 * `fontFamily`), `kol-label-mono-xs` (a deleted legacy family), and the hidden
 * block that eagerly preloaded every slide image — embla plus `loading="eager"`
 * on the visible slide covers that without fetching a whole gallery up front.
 *
 * @param {Array}    items            slides: `{ media: { src, kind: 'image'|'video', poster, srcSet, alt }, title, subtitle, description, href, ctaLabel, titleClassName, descriptionClassName, showTitle, showDescription, showCta }`
 * @param {string}   sectionLabel     header label (default 'Featured')
 * @param {string}   ctaLabel         default CTA copy; per-item `ctaLabel` overrides (default 'Learn more')
 * @param {string}   height           slide-frame height class (default 'h-[440px] md:h-[640px]')
 * @param {Function} renderTitle      custom title renderer `(item) => ReactNode`; wins over the default
 * @param {string}   titleClassName   default title class; per-item `titleClassName` overrides
 * @param {string}   descriptionClassName default description class; per-item overrides
 * @param {boolean}  showHeader       show the label + `n / total` counter bar (default true)
 * @param {boolean}  showTitle        global title visibility; per-item `showTitle` overrides (default true)
 * @param {boolean}  showDescription  global description visibility; per-item overrides (default true)
 * @param {boolean}  showCta          global CTA visibility; per-item `showCta` overrides (default true)
 * @param {boolean}  fullWidth        the slide FILLS the container (`.is-full`,
 *                                    kol-framework.css ≥0.25.0) and the section
 *                                    drops its own vertical padding; default false
 *                                    keeps the 72vw peek
 * @param {boolean}  rounded          frame border + radius (default true)
 * @param {'stack'|'header'} navPosition  prev/next under the viewport, or in the
 *                                    header row beside the counter (default 'stack')
 * @param {boolean}  autoPlay         auto-advance: timer for image slides, `ended` for video slides (default false)
 * @param {number}   autoPlayInterval image-slide timer in ms (default 5000)
 * @param {Function} onNavigate       `(href, event) => void` CTA click seam for SPA routing
 * @param {Object}   options          embla options passthrough (default `{ align: 'center', loop: true }`)
 * @param {node}     children         a STATIC overlay pinned over the stage — it does
 *                                    not travel with the slides (pointer-events pass
 *                                    through except on the child itself)
 * @param {string}   className        extra classes on the section
 */
export default function FeaturedCarousel({
  items = [],
  sectionLabel = 'Featured',
  ctaLabel = 'Learn more',
  height = 'h-[440px] md:h-[640px]',
  renderTitle,
  titleClassName = '',
  descriptionClassName = '',
  showHeader = true,
  showTitle = true,
  showDescription = true,
  showCta = true,
  fullWidth = false,
  rounded = true,
  navPosition = 'stack',
  autoPlay = false,
  autoPlayInterval = 5000,
  onNavigate,
  options = { align: 'center', loop: true },
  children,
  className = '',
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap())
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const advance = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const currentHasVideo = items[selectedIndex]?.media?.kind === 'video'

  // Reset the progress bar whenever the active slide changes.
  useEffect(() => setProgress(0), [selectedIndex])

  // Image slides: one rAF loop is the source of truth for both the progress
  // bar and the auto-advance (video slides drive their own via 'ended' /
  // 'timeupdate', so this bails when the active slide is a video or paused).
  useEffect(() => {
    if (!autoPlay || items.length <= 1 || currentHasVideo || paused) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / autoPlayInterval, 1)
      setProgress(p)
      if (p >= 1) return advance()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [autoPlay, autoPlayInterval, items.length, selectedIndex, currentHasVideo, paused, advance])

  const handleVideoTime = (e) => {
    const { currentTime, duration } = e.currentTarget
    if (duration) setProgress(currentTime / duration)
  }

  const renderTitleNode = (item) => {
    if (renderTitle) return renderTitle(item)
    if (!item.title) return null
    return (
      <span className={`kol-sans-display-01 text-emphasis block leading-none ${item.titleClassName || titleClassName}`.trim()}>
        {item.title}
      </span>
    )
  }

  if (items.length === 0) return null

  const showProgress = autoPlay && items.length > 1

  const nav = (
    <EmblaNav
      onPrev={() => emblaApi?.scrollPrev()}
      onNext={() => emblaApi?.scrollNext()}
      canPrev={canPrev}
      canNext={canNext}
      placement={navPosition === 'header' ? 'inline' : 'stack'}
      prevLabel="Previous slide"
      nextLabel="Next slide"
    />
  )

  return (
    <section
      className={`kol-featured-carousel w-full ${fullWidth ? 'is-full' : 'py-16'} ${className}`.trim()}
      onMouseEnter={autoPlay ? () => setPaused(true) : undefined}
      onMouseLeave={autoPlay ? () => setPaused(false) : undefined}
    >
      {showHeader && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* migrated off the deleted legacy kol-label-* family — label renders as authored */}
            <span className="kol-helper-12 text-auto">{sectionLabel}</span>
            <span className="kol-mono-12 text-fg-64">{selectedIndex + 1} / {items.length}</span>
          </div>
          {navPosition === 'header' && nav}
        </div>
      )}

      <div className="kol-embla is-slides">
        <div className="relative">
          {showProgress && (
            <div className="absolute left-0 right-0 top-0 z-20 h-[2px] bg-fg-08">
              <div
                className="h-full origin-left bg-fg-64"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          )}

          <div className="kol-embla-viewport" ref={emblaRef}>
            <div className="kol-embla-container">
              {items.map((item, i) => {
                const active = i === selectedIndex
                return (
                  <div key={i} className="kol-embla-slide">
                    <div
                      className={`relative overflow-hidden bg-surface-secondary ${rounded ? 'rounded border border-fg-08' : ''} ${height}`.replace(/\s+/g, ' ')}
                    >
                      <SlideMedia
                        media={item.media}
                        active={active}
                        onEnded={autoPlay && items.length > 1 && active ? advance : undefined}
                        onTimeUpdate={autoPlay && active ? handleVideoTime : undefined}
                      />
                      <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
                        <OverlayGlassPanel maxWidth="max-w-[600px]">
                          {(item.showTitle ?? showTitle) && renderTitleNode(item)}
                          {item.subtitle && (
                            <span className="kol-mono-10 text-fg-64">{item.subtitle}</span>
                          )}
                          {(item.showDescription ?? showDescription) && item.description && (
                            <p
                              className={`kol-mono-12 text-auto max-w-[600px] ${item.descriptionClassName || descriptionClassName}`.trim()}
                            >
                              {item.description}
                            </p>
                          )}
                          {(item.showCta ?? showCta) && item.href && (
                            <a
                              href={item.href}
                              onClick={onNavigate ? (e) => onNavigate(item.href, e) : undefined}
                              className="kol-btn kol-btn-primary kol-btn-sm kol-mono-12"
                            >
                              {item.ctaLabel || ctaLabel}
                            </a>
                          )}
                        </OverlayGlassPanel>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pinned over the stage, OUTSIDE the viewport — a caption or badge
            * that must not travel with the slides. Clicks pass through except
            * on the child itself. */}
          {children && (
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
              <div className="pointer-events-auto w-full">{children}</div>
            </div>
          )}
        </div>

        {navPosition !== 'header' && nav}
      </div>
    </section>
  )
}
