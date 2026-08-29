import { useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

/* Promoted verbatim from showcase/src/sets/content-card-comparison.jsx
 * (ContentFiltersCollection, kol-r2b2 2026-08-27) — the card's `size` slot:
 * the size at rest, a download link on hover. `href` is the download. */
/* The size string IS the download affordance: "2.4 MB" at rest, a download
 * icon + "Download" on hover, no container of any kind.
 *
 * Both states sit in ONE grid cell so the meta row never reflows. The icon is
 * CLIPPED at zero width at rest and opens to its box on hover, sliding left to
 * right — so it reads as coming out from behind the word rather than fading in
 * beside it. ONE duration and curve for every part and both directions — 500ms
 * on the house curve `--kol-ease-house`, plus a 200ms delay on the icon so the
 * word starts before the glyph. That delay is on the `group-hover:` variant,
 * NOT the base — ENTRY only. With it on the base the exit inherited it too, so
 * the glyph finished retracting at t=700 while the fade ended at t=500: it went
 * invisible at full extension and never appeared to slide back.
 *
 * The glyph is NOT on `.kol-inline-control` — that chrome is for a control you
 * click, and this one is inside the link rather than being it.
 *
 * Both hover parts ink on the OPACITY scale (`text-oq-80`), not an `fg-*` role:
 * a stroke glyph on a flat fg colour reads wrong against the plate, and oq is
 * what the rest of the chrome uses.
 *
 * ONE type class throughout — kol-mono-12. helper-12 is line-height 1 against
 * mono's 16px, so swapping classes moved the line. Only the ink changes.
 */
export default function SizeOrDownload({
  children,
  href,
  icon = 'download',
  confirmIcon = 'check',
  label = 'Download',
  confirmLabel = 'Downloaded',
}) {
  /* The confirm is LOCAL, not ActionButton's — this affordance is the link
   * itself, not an icon control sitting inside one. */
  const [done, setDone] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const click = (event) => {
    /* a real `href` downloads; without one the click is the confirm alone */
    if (!href) event.preventDefault()
    clearTimeout(timer.current)
    setDone(true)
    timer.current = setTimeout(() => setDone(false), 2000)
  }

  return (
    <a
      href={href ?? '#'}
      onClick={click}
      aria-label={done ? confirmLabel : label}
      className="group/size -mx-1 inline-grid items-end justify-items-start rounded-[var(--kol-radius-sm)] px-1 transition-colors duration-500 ease-[var(--kol-ease-house)] hover:bg-oq-04 active:bg-oq-08"
    >
      <span
        className="kol-mono-12 text-oq-80 group-hover/size:opacity-0"
        style={{ gridArea: '1 / 1', transition: 'opacity 500ms var(--kol-ease-house)' }}
      >
        {children}
      </span>

      <span
        className="inline-flex items-center opacity-0 group-hover/size:opacity-100"
        style={{ gridArea: '1 / 1', transition: 'opacity 500ms var(--kol-ease-house)' }}
      >
        <span className="inline-flex w-0 overflow-hidden transition-[width] duration-500 ease-[var(--kol-ease-house)] group-hover/size:w-[20px] group-hover/size:delay-200">
          <span className="inline-flex h-4 w-4 -translate-x-2 items-center justify-center text-oq-80 transition-transform duration-500 ease-[var(--kol-ease-house)] group-hover/size:translate-x-0 group-hover/size:delay-200">
            <Icon name={done ? confirmIcon : icon} size={16} />
          </span>
        </span>
        <span className="kol-mono-12 text-oq-80">{label}</span>
      </span>
    </a>
  )
}
