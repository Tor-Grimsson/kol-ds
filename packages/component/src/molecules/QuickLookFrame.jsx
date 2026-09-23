import { useRef, useState } from 'react'
import Button from '../atoms/Button.jsx'
import CloseButton from '../utilities/CloseButton.jsx'

/* taxonomy-ok: molecule — nests Button (atom) + CloseButton (utility). */

/**
 * QuickLookFrame — the Finder Quick Look window (user 2026-09-23: *"put them in a container LIKE
 * FINDER … it just makes everything in the design easier to manage if its wrapped together"*).
 * Every kind sat loose on the scrim with its own chrome — a caption line under a picture, a bar
 * floating over a video, a see-through page — so no two kinds looked like one feature. One
 * opaque window now holds all of them:
 *
 *   header  close · ‹ › n / N · the file's name · its facts · the kind's actions, right-aligned
 *   body    the media at its own aspect ratio, capped to the viewport — the window hugs it
 *   footer  the transport, when the kind has one (`PlaybackBar docked`)
 *
 * RESIZABLE (user 2026-09-23, Finder's corner): drag the bottom-right corner and the window takes
 * that size; the body's caps follow it, so media still fits and documents get the room. `size` /
 * `onResize` let a caller keep the size across files (Finder keeps it); without them the window
 * holds its own.
 *
 * @param {string}    title    the file's name
 * @param {ReactNode} meta     facts after the name (size · dimensions · length)
 * @param {ReactNode} actions  the kind's controls, right-aligned in the header
 * @param {Function}  onClose  shows the close control when given
 * @param {Object}    nav      `{ index, total, onPrev, onNext }` — ‹ › and `1 / 2` beside the close,
 *                             Finder's, when the window pages through more than one file
 * @param {Object}    size     `{ w, h }` in px, or null for the automatic size
 * @param {Function}  onResize ({ w, h }) => void while the corner is dragged
 * @param {ReactNode} footer   the transport row
 * @param {ReactNode} children the body
 */
export default function QuickLookFrame({ title, meta, actions, onClose, nav, size: sizeProp, onResize, footer, className = '', children }) {
  const [own, setOwn] = useState(null)
  const size = sizeProp !== undefined ? sizeProp : own
  const setSize = onResize ?? setOwn
  const ref = useRef(null)
  const drag = useRef(null)
  const header = title || meta || actions || onClose || nav

  const onPointerDown = (e) => {
    e.preventDefault()
    const box = ref.current.getBoundingClientRect()
    drag.current = { x: e.clientX, y: e.clientY, w: box.width, h: box.height }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    /* the window is centred, so a corner drag grows it on both sides — twice the pointer's travel */
    const w = Math.max(360, Math.min(window.innerWidth - 32, d.w + (e.clientX - d.x) * 2))
    const h = Math.max(240, Math.min(window.innerHeight - 32, d.h + (e.clientY - d.y) * 2))
    setSize({ w: Math.round(w), h: Math.round(h) })
  }
  const onPointerUp = () => { drag.current = null }

  const style = size ? { width: size.w, height: size.h, '--kol-ql-frame-h': `${size.h}px`, '--kol-ql-max-w': `${size.w - 2}px` } : undefined
  return (
    <div ref={ref} style={style}
      className={`kol-quicklook${footer ? ' kol-quicklook--footer' : ''}${size ? ' kol-quicklook--sized' : ''} ${className}`.trim()}>
      {header && (
        <div className="kol-quicklook-header">
          {/* THE ESTATE'S CLOSE IDIOM, and every header control wears it (user 2026-09-23): bare at
            * rest, a wash on hover — a filled container read as a second surface on the header */}
          {onClose && <CloseButton size="sm" onClick={onClose} />}
          {nav?.total > 1 && (
            /* the pager is its own group: the count sits off the chevrons, and the group sits clear of
             * the file's name (user 2026-09-23) */
            <span className="flex items-center gap-1 mr-3">
              <Button variant="nav" size="sm" iconOnly="chevron-left" onClick={nav.onPrev} aria-label="Previous" />
              <Button variant="nav" size="sm" iconOnly="chevron-right" onClick={nav.onNext} aria-label="Next" />
              <span className="kol-mono-12 text-meta tabular-nums ml-3">{nav.index + 1} / {nav.total}</span>
            </span>
          )}
          {title && <span className="kol-mono-12 text-strong truncate">{title}</span>}
          {meta && <span className="kol-mono-12 text-meta truncate">{meta}</span>}
          <span className="flex-1" />
          {actions}
        </div>
      )}
      <div className="kol-quicklook-body">{children}</div>
      {footer && <div className="kol-quicklook-footer">{footer}</div>}
      <span className="kol-quicklook-grip" role="separator" aria-label="Resize"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} />
    </div>
  )
}
