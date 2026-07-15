import { useEffect, useState } from 'react'
import { TiltCard } from '@kolkrabbi/kol-component'
import { AssetPlaceholder } from '@kolkrabbi/kol-component'

/* Ragged-skyline heights, chosen by `index % 3` — a shelf of these reads as an
 * uneven horizon. Overridable via the `heights` prop. */
const HEIGHTS = ['h-[408px] md:h-[560px]', 'h-[372px] md:h-[520px]', 'h-[336px] md:h-[480px]']
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const TYPE_LABELS = { client: 'Client', collection: 'Collection', typeface: 'Typeface', tool: 'Tool', system: 'System' }

/**
 * WorkCard — the grid/shelf project tile for a `/work` listing: a fixed-size
 * media card (the DS **TiltCard** in its `grounded` variant) with a
 * hover-revealed bottom drawer carrying the project title + a meta line
 * (client-or-type · year). The whole card is an anchor to the project detail;
 * it preloads its own thumbnail and plays a staggered rise-and-untilt entrance
 * keyed off its `index` in the shelf.
 *
 * Composes TiltCard (owns the `<img>` + pointer tilt); this organism adds the
 * entrance choreography, the caption drawer, and the link. Router-agnostic:
 * renders a plain `<a href>` plus an `onNavigate(href, event)` seam — call
 * `preventDefault` inside it for SPA navigation. Flat project props (no Sanity):
 * the meta line is composed internally so callers pass raw fields.
 *
 * Text casing: no text-transform (KOL rule) — the source's presentational
 * `uppercase` is dropped; `title`, `client`, `year` render verbatim as authored.
 *
 * @param {string}          title       overlay heading (display type)
 * @param {string}          thumbnail   image URL (preloaded, passed to TiltCard `src`); AssetPlaceholder shows when absent
 * @param {string}          href        link target
 * @param {string}          client      first meta segment; falls back to the type label
 * @param {string}          type        'client'|'collection'|'typeface'|'tool'|'system' — mapped via TYPE_LABELS when no client
 * @param {string|number}   year        second meta segment
 * @param {number}          index       drives stagger height + entrance timing (default 0)
 * @param {number}          perspective CSS perspective in px on fine pointers (default 800)
 * @param {string[]}        heights     override the ragged-height ramp (chosen by index % heights.length)
 * @param {Function}        onNavigate  (href, event) => void — anchor click seam for SPA routing
 * @param {string}          titleClassName  type class for the drawer title (default 'kol-sans-display-02').
 *                          The display-face seam: it REPLACES the type class (color/leading stay
 *                          component-owned), so a consumer restores its own display face without forking.
 */
export default function WorkCard({
  title,
  thumbnail,
  href,
  client,
  type,
  year,
  index = 0,
  perspective = 800,
  heights = HEIGHTS,
  onNavigate,
  titleClassName = 'kol-sans-display-02',
}) {
  const [ready, setReady] = useState(false)
  // Evaluated once at mount (SSR-safe): drop perspective on coarse/small screens.
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    if (!thumbnail) {
      setReady(true)
      return
    }
    let cancelled = false
    const img = new window.Image()
    const done = () => { if (!cancelled) setReady(true) }
    img.onload = done
    img.onerror = done
    img.src = thumbnail
    return () => { cancelled = true }
  }, [thumbnail])

  const height = heights[index % heights.length]
  const meta = [client || TYPE_LABELS[type] || type, year].filter(Boolean).join(' · ')

  const drawer = (
    <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-6 bg-surface-inverse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className={`${titleClassName} text-fg-inverse leading-tight`}>{title}</p>
      {meta && (
        <p className="kol-mono-12 text-fg-inverse opacity-60 tracking-widest mt-2">{meta}</p>
      )}
    </div>
  )

  return (
    <a
      href={href}
      onClick={onNavigate ? (e) => onNavigate(href, e) : undefined}
      className={`flex-none w-[280px] md:w-[400px] ${height} group`}
      style={isMobile ? undefined : { perspective }}
    >
      <div
        className="w-full h-full"
        style={{
          transformOrigin: 'bottom center',
          opacity: ready ? 1 : 0,
          transform: ready
            ? 'rotateX(0deg) translateY(0px)'
            : `rotateX(${20 + (index % 3) * 8}deg) translateY(${30 + (index % 4) * 10}px)`,
          transition: `opacity ${0.7 + (index % 3) * 0.15}s ${EASE} ${index * 0.07}s, transform ${0.7 + (index % 3) * 0.15}s ${EASE} ${index * 0.07}s`,
        }}
      >
        {thumbnail ? (
          <TiltCard
            src={thumbnail}
            alt={title}
            variant="grounded"
            perspective={perspective}
            className="w-full h-full rounded-[4px] border border-fg-04"
          >
            {drawer}
          </TiltCard>
        ) : (
          <div className="relative w-full h-full rounded-[4px] border border-fg-04 overflow-hidden">
            <AssetPlaceholder category="work" name={title} aspectRatio="auto" className="w-full h-full" />
            {drawer}
          </div>
        )}
      </div>
    </a>
  )
}
