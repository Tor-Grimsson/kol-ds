import { isValidElement } from 'react'
import HlsVideo from '../atoms/HlsVideo.jsx'
import Image from '../molecules/Image.jsx'

/** Height presets; anything else is passed through as a class string. */
const HEIGHTS = {
  screen: 'h-screen',
  lg: 'h-[440px] md:h-[640px]',
  md: 'h-[320px] md:h-[440px]',
}

/**
 * Background layer: a media descriptor becomes a cover-fit Image / HlsVideo /
 * inert <video> (`.kol-full-bleed-hero-media` pins it absolute + object-cover
 * — CSS in @kol/theme); a ready ReactNode renders as-is and must position
 * itself (give it that same class).
 */
function MediaLayer({ media }) {
  if (!media) return null
  if (isValidElement(media) || typeof media !== 'object') return media

  const { src, kind = 'image', poster, srcSet, alt = '' } = media

  if (kind === 'video') {
    // Non-HLS file (mp4/webm): a plain inert video element. HLS manifests —
    // and the poster-only case — go through the HlsVideo atom, which owns
    // hls.js attachment and the full non-interactive hardening set.
    if (src && !src.endsWith('.m3u8')) {
      return (
        <video
          src={src}
          poster={poster}
          className="kol-full-bleed-hero-media"
          style={{ pointerEvents: 'none' }}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        />
      )
    }
    return <HlsVideo src={src} poster={poster} className="kol-full-bleed-hero-media" />
  }

  return (
    <Image
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? '100vw' : undefined}
      alt={alt}
      loading="eager"
      className="kol-full-bleed-hero-media"
    />
  )
}

/**
 * FullBleedHero — full-bleed media hero: cover-fit background media (image or
 * video) filling a fixed-height section, an optional surface scrim, and one
 * content slot laid over it. The third member of the hero family — BrandHero
 * and SubPageHero are band heroes; this is the media one. The canonical
 * recipe drops an OverlayGlassPanel into `panel`; that recipe with
 * `kind: 'video'` + `height="screen"` IS the monorepo's StudioHero, folded in
 * here as a capability rather than a separate component.
 *
 * Presentational — no copy, no CDN paths, no routes. All text is authored
 * inside the caller's panel/children. The source's `opacity-${n}` dynamic
 * Tailwind class (JIT-invisible) is replaced by the scrim's inline style; the
 * source's image self-dim (`imageOpacity={40}`) is expressed here as
 * `overlayOpacity={60}` — a surface-primary veil over full-opacity media.
 *
 * @param {ReactNode|{src, kind, poster, srcSet, alt}} media  background — descriptor ({ kind: 'image'|'video' }) or a self-positioning node
 * @param {number}    overlayOpacity 0–100 surface-primary scrim over the media (inline opacity; default 0 = none)
 * @param {string}    height         'screen' | 'lg' | 'md' preset, or any Tailwind height class string
 * @param {ReactNode} panel          content slot, usually a caller-authored OverlayGlassPanel; wins over children
 * @param {ReactNode} children       fallback content slot when `panel` is omitted
 * @param {string}    align          'center' | 'start' | 'end' — horizontal placement of the content (vertically centered)
 * @param {string}    className      extra classes on the section
 */
export default function FullBleedHero({
  media,
  overlayOpacity = 0,
  height = 'lg',
  panel,
  children,
  align = 'center',
  className = '',
}) {
  const heightCls = HEIGHTS[height] || height
  const alignCls =
    align === 'start' ? 'justify-start'
    : align === 'end' ? 'justify-end'
    : 'justify-center'

  return (
    <section className={`kol-full-bleed-hero relative isolate w-full overflow-hidden ${heightCls} ${className}`.trim()}>
      <MediaLayer media={media} />
      {overlayOpacity > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'var(--kol-surface-primary)', opacity: overlayOpacity / 100 }}
        />
      )}
      <div className={`relative z-10 flex h-full w-full items-center ${alignCls} p-6 md:p-10`}>
        {panel ?? children}
      </div>
    </section>
  )
}
