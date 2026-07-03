import { isValidElement, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from '../molecules/Image.jsx'
import HlsVideo from '../atoms/HlsVideo.jsx'
import OverlayGlassPanel from '../atoms/OverlayGlassPanel.jsx'

/**
 * Per-slide media layer: a `{ src, kind }` descriptor becomes a cover-fit
 * Image / HlsVideo / inert <video> pinned over the frame
 * (`.kol-featured-carousel-media` — absolute inset-0 object-cover, CSS in
 * @kol/theme, out-cascades Image's baked `h-auto`). A ready ReactNode renders
 * as-is and must position itself (give it that same class). `onEnded` /
 * `onTimeUpdate` attach to video elements only — they drive the active slide's
 * auto-advance and the progress bar; images ignore them.
 */
function SlideMedia({ media, onEnded, onTimeUpdate }) {
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
        <video
          src={src}
          poster={poster}
          className="kol-featured-carousel-media"
          style={{ pointerEvents: 'none' }}
          autoPlay
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
 * @param {Array}    items            slides: `{ media: { src, kind: 'image'|'video', poster, srcSet, alt }, title, description, href, ctaLabel, titleClassName }`
 * @param {string}   sectionLabel     header label (default 'Featured')
 * @param {string}   ctaLabel         default CTA copy; per-item `ctaLabel` overrides (default 'Learn more')
 * @param {string}   height           slide-frame height class (default 'h-[440px] md:h-[640px]')
 * @param {Function} renderTitle      custom title renderer `(item) => ReactNode`; wins over the default
 * @param {string}   titleClassName   default title class; per-item `titleClassName` overrides
 * @param {boolean}  showHeader       show the label + `n / total` counter bar (default true)
 * @param {boolean}  autoPlay         auto-advance: timer for image slides, `ended` for video slides (default false)
 * @param {number}   autoPlayInterval image-slide timer in ms (default 5000)
 * @param {Function} onNavigate       `(href, event) => void` CTA click seam for SPA routing
 * @param {Object}   options          embla options passthrough (default `{ align: 'center', loop: true }`)
 * @param {string}   className        extra classes on the section
 */
export default function FeaturedCarousel({
  items = [],
  sectionLabel = 'Featured',
  ctaLabel = 'Learn more',
  height = 'h-[440px] md:h-[640px]',
  renderTitle,
  titleClassName = '',
  showHeader = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  onNavigate,
  options = { align: 'center', loop: true },
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

  return (
    <section
      className={`kol-featured-carousel w-full ${className}`.trim()}
      onMouseEnter={autoPlay ? () => setPaused(true) : undefined}
      onMouseLeave={autoPlay ? () => setPaused(false) : undefined}
    >
      {showHeader && (
        <div className="mb-6 flex items-center gap-4">
          <span className="kol-label-mono-xs text-auto">{sectionLabel}</span>
          <span className="kol-mono-12 text-fg-64">{selectedIndex + 1} / {items.length}</span>
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
                    <div className={`relative overflow-hidden rounded border border-fg-08 bg-surface-secondary ${height}`}>
                      <SlideMedia
                        media={item.media}
                        onEnded={autoPlay && items.length > 1 && active ? advance : undefined}
                        onTimeUpdate={autoPlay && active ? handleVideoTime : undefined}
                      />
                      <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
                        <OverlayGlassPanel maxWidth="max-w-[600px]">
                          {renderTitleNode(item)}
                          {item.description && (
                            <p className="kol-mono-12 text-auto max-w-[600px]">{item.description}</p>
                          )}
                          {item.href && (
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
        </div>

        <div className="kol-embla-controls">
          <button
            type="button"
            className="kol-embla-btn border border-fg-16 hover:border-fg-32 text-auto"
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
          >‹</button>
          <button
            type="button"
            className="kol-embla-btn border border-fg-16 hover:border-fg-32 text-auto"
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
          >›</button>
        </div>
      </div>
    </section>
  )
}
