import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HlsVideo from '../atoms/HlsVideo.jsx'
import AssetPlaceholder from '../atoms/AssetPlaceholder.jsx'
import Button from '../atoms/Button.jsx'
import Image from '../molecules/Image.jsx'
import useTilt from '../hooks/useTilt.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/* taxonomy-ok: nests the same-file Media helper plus DS atoms/molecules
 * (HlsVideo, AssetPlaceholder, Button, Image) it composes — an organism. */

/**
 * True on coarse-pointer (touch/no-hover) devices. Local to BentoCard, mirrors
 * TiltCard's copy; re-evaluates on device/orientation change via the
 * media-query change event (the monorepo source froze `useIsTouchDevice` in a
 * module-load const — fixed on recreate).
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
 * Media — internal, NOT exported. Sniffs `src` by extension and renders the
 * right full-bleed media element: `.m3u8` → HlsVideo, `.mov|.mp4|.webm` →
 * autoplay <video>, any other src → the Image molecule (its own broken-asset
 * fallback), and no src → AssetPlaceholder. Positioning/fit arrive via
 * `className`; Image gets an inline height so its base `h-auto` can't beat the
 * `size-full` cover fill.
 */
function Media({ src, poster, className }) {
  if (!src) return <AssetPlaceholder className={className} />
  if (/\.m3u8$/i.test(src)) return <HlsVideo src={src} poster={poster} className={className} />
  if (/\.(mov|mp4|webm)$/i.test(src)) {
    return (
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={className}
      />
    )
  }
  return <Image src={src} alt="" className={className} style={{ width: '100%', height: '100%' }} />
}

/**
 * BentoCard — media hover-card for grid/bento walls. Full-bleed auto-detected
 * media (HLS / video / image / placeholder) sits behind a content stack; on a
 * fine pointer, hover reveals a darkening scrim plus subtitle / description /
 * CTA over an always-visible title. No-hover (coarse-pointer) devices show
 * everything statically and drop the media's pointer capture.
 *
 * Motion is gated: the pointer-following 3D tilt (shared `useTilt` framer
 * springs — the monorepo's forked CSS `useBentoTilt` is gone) renders only on
 * a fine pointer with motion allowed; reduced-motion, coarse pointer, or
 * `enableTilt={false}` all fall back to a static card, and reduced-motion also
 * drops the reveal's opacity transition.
 *
 * Zero CMS coupling — flat props. The CTA is a DS Button link (`<a href>`, no
 * router import): `http*`/`mailto` open a new tab; any other href is a
 * same-tab anchor whose `onNavigate(event)` seam lets an SPA intercept
 * (preventDefault + its router) — wired capture-phase so it fires before the
 * default navigation. Title/subtitle/description render exactly as authored;
 * no casing transforms (author strings in their final case at the call site).
 *
 * @param {string}    src            media source; type auto-detected by extension
 * @param {string}    poster         poster frame for HLS/video
 * @param {ReactNode} title          always-visible heading
 * @param {ReactNode} subtitle       hover-revealed line
 * @param {ReactNode} description    hover-revealed paragraph
 * @param {string}    href           CTA target; `http*`/`mailto` → new-tab anchor, else same-tab (onNavigate seam)
 * @param {Function}  onNavigate     (event) => void — same-tab CTA click seam (SPA intercept)
 * @param {ReactNode} buttonLabel    CTA label (no default — author it)
 * @param {ReactNode} bodyContent    extra content injected into the stack
 * @param {number}    overlayOpacity scrim darkness % over the media, 0 disables (default 60)
 * @param {boolean}   alignRight     right-align the card (ms-auto) vs fill (size-full)
 * @param {boolean}   enableTilt     master tilt switch (default true)
 * @param {string}    titleClassName title classes
 * @param {string}    contentClassName inner content-box classes
 * @param {string}    imageClassName media fit/position classes
 * @param {string}    contentStackClassName stack layout classes
 * @param {string}    className      extra classes on the root
 */
export default function BentoCard({
  src,
  poster,
  title,
  subtitle,
  description,
  href,
  onNavigate,
  buttonLabel,
  bodyContent = null,
  overlayOpacity = 60,
  alignRight = false,
  enableTilt = true,
  titleClassName = 'kol-sans-heading-01 text-absolute-white',
  contentClassName = 'max-w-[384px]',
  imageClassName = 'object-cover object-center',
  contentStackClassName = 'relative z-20 h-full flex flex-col justify-start items-start gap-4 p-6 md:p-8',
  className = '',
  ...rest
}) {
  const reduced = usePrefersReducedMotion()
  const coarse = useCoarsePointer()
  const tilt = useTilt()

  const tiltOff = !enableTilt || reduced || coarse
  const Component = tiltOff ? 'div' : motion.div
  const rootStyle = {
    ...(tiltOff ? {} : tilt.style),
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  }
  const tiltHandlers = tiltOff
    ? {}
    : { ref: tilt.ref, onMouseMove: tilt.onMouseMove, onMouseLeave: tilt.onMouseLeave }

  // Reveal choreography. Coarse (no-hover) devices show everything statically;
  // fine pointers reveal on group-hover. The opacity transition is motion, so
  // reduced-motion drops it (content still reveals, just without the fade).
  const fade = reduced ? '' : 'transition-opacity duration-300'
  const revealClass = `${coarse ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${fade}`.trim()

  const mediaClass =
    `absolute left-0 top-0 size-full rounded overflow-hidden ${imageClassName} ${coarse ? 'pointer-events-none' : ''}`.trim()

  const isExternal = href && (href.startsWith('http') || href.startsWith('mailto'))

  return (
    <Component
      className={`relative group ${alignRight ? 'ms-auto' : 'size-full'} ${className}`.trim()}
      {...tiltHandlers}
      {...rest}
      style={{ ...rootStyle, ...rest.style }}
    >
      <Media src={src} poster={poster} className={mediaClass} />

      <div className="relative z-10 flex size-full h-full flex-col justify-start items-start text-auto">
        <div className={`relative z-10 ${contentClassName} w-full h-full self-stretch`}>
          {overlayOpacity > 0 && (
            <div
              className={`absolute -inset-1 rounded ${coarse ? 'opacity-60' : 'opacity-0 group-hover:opacity-100'} ${fade} pointer-events-none`.trim()}
              style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
            />
          )}
          <div className={contentStackClassName}>
            {title && <h3 className={titleClassName}>{title}</h3>}
            {subtitle && <p className={`kol-mono-text text-absolute-white ${revealClass}`}>{subtitle}</p>}
            {description && <p className={`kol-mono-12 text-absolute-white pb-6 ${revealClass}`}>{description}</p>}
            {bodyContent}
            {href && (
              <div className={revealClass}>
                <Button
                  href={href}
                  variant="primary"
                  size="sm"
                  {...(isExternal
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : { onClickCapture: onNavigate })}
                >
                  {buttonLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Component>
  )
}
