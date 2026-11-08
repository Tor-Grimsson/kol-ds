import { Button, Slider, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — float Buttons and a Slider float on the float surface */

/**
 * ReaderBar — The reader's top controls (float-everything W5 row 80, 2026-11-04): the way back with the path
 * ("My library / The Waves") as one 44 capsule at the start; Contents, search, bookmark and the `Aa` reading tools
 * capsule at the end — each its own float, 12 apart. The exploration's `Floating reader controls` (kol-float--style
 * 9:16150).
 *
 * @param {string|string[]} path  the capsule's words, or its crumbs joined by ` / `
 * @param {Function} onBack        the capsule's press
 * @param {Function} onContents    the Contents press; unset, no Contents
 * @param {Function} onSearch · {Function} onBookmark  the glyphs' presses; unset, left out
 * @param {boolean}  bookmarked    the bookmark lit
 * @param {Function} onTools       the `Aa` capsule's press; unset, no capsule
 * @param {string}   toolsLabel    the capsule's words (default "Reading tools")
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what every float on the bar is made of (default `solid`)
 * @param {string}   className
 */
export default function ReaderBar({ path, onBack, onContents, onSearch, onBookmark, bookmarked = false, onTools, toolsLabel = 'Reading tools', surface = 'solid', className = '' }) {
  const surf = floatSurfaceClass(surface)
  return (
    <div className={`kol-reader-bar kol-float-chrome flex items-center justify-between gap-4 ${className}`.trim()}>
      <Button variant="float" size="lg" iconLeft="arrow-left" iconGap={12} onClick={onBack} className={`${surf} pr-5`}>
        {Array.isArray(path) ? path.join('  /  ') : path}
      </Button>
      <div className="flex items-center gap-3">
        {onContents && <Button variant="float" size="lg" iconLeft="list-bullet" onClick={onContents} className={surf}>Contents</Button>}
        {onSearch && <Button variant="float" size="lg" iconOnly="search" aria-label="Search" onClick={onSearch} className={surf} />}
        {onBookmark && <Button variant="float" size="lg" iconOnly="bookmark" aria-label="Bookmark" pressed={bookmarked} onClick={onBookmark} className={surf} />}
        {onTools && (
          <Button variant="float" size="lg" iconRight="chevron-down" onClick={onTools} className={`${surf} pl-4`}>
            <span className="kol-float-body-lg text-emphasis">Aa</span>
            <span>{toolsLabel}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * ProgressDock — The reading position (float-everything W5 row 81, 2026-11-04): a 64 capsule — ‹ and › as 44 float
 * slots, between them the page line (`kol-float-hint`) with the share in `kol-float-timecode` (oq-64), and the Slider
 * float's 3px track under them. The exploration's `Reading progress dock` (kol-float--style 9:16203).
 *
 * @param {number}   page · {number} pages   where the reader is, of how many
 * @param {Function} onPrev · {Function} onNext  the slots' presses
 * @param {Function} onSeek    `(page) => void` — the track's drag
 * @param {Function} formatPage  `(page, pages) => string` (default "Page 125 of 297")
 * @param {number}   width     the dock's width (default 620)
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the dock is made of (default `solid`)
 * @param {string}   className
 */
export function ProgressDock({ page = 1, pages = 1, onPrev, onNext, onSeek, formatPage = (p, n) => `Page ${p} of ${n}`, width = 620, surface = 'solid', className = '' }) {
  const pct = pages > 1 ? Math.round(((page - 1) / (pages - 1)) * 100) : 100
  return (
    <div className={`kol-progress-dock kol-float-chrome flex items-center gap-4 h-16 px-2.5 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()} style={{ width }}>
      <Button variant="float" tone="ghost" size="lg" iconOnly="chevron-left" aria-label="Previous page" onClick={onPrev} disabled={page <= 1} />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="kol-float-hint text-emphasis">{formatPage(page, pages)}</span>
          <span className="kol-float-timecode text-oq-64">{pct}%</span>
        </div>
        <Slider variant="float" readout="none" aria-label="Reading position" min={1} max={pages} step={1} value={page} onChange={onSeek} className="w-full" />
      </div>
      <Button variant="float" tone="ghost" size="lg" iconOnly="chevron-right" aria-label="Next page" onClick={onNext} disabled={page >= pages} />
    </div>
  )
}
