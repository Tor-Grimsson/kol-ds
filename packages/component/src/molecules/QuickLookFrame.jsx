import { useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import QuickLookHeader from './QuickLookHeader.jsx'

/* taxonomy-ok: molecule — nests QuickLookHeader (molecule) + kol-icons's Icon. */

/**
 * QuickLookFrame — The preview window. the Finder Quick Look window (user 2026-09-23: *"put them in a container LIKE
 * FINDER … it just makes everything in the design easier to manage if its wrapped together"*).
 * Every kind sat loose on the scrim with its own chrome — a caption line under a picture, a bar
 * floating over a video, a see-through page — so no two kinds looked like one feature. One
 * opaque window now holds all of them:
 *
 *   header  ‹ › n / N · the file's name · its facts · the kind's actions and the close, right-aligned
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
 *
 * THE UTILITY WINDOW (`variant="float"`, float-everything W6 rows 86 · 88, 2026-11-04 — kol-float--style 46:2840): a
 * non-modal float window — no scrim, the scene stays live under it. `kol-float-solid` on `--kol-float-window-r`, 20 in,
 * 18 between its parts; the header is `QuickLookHeader variant="float"` (`icon` · title · `onMinimise` · `onClose`); the
 * body is the caller's (chip tabs, float fields); `status` is the footer line (`Changes saved automatically`, the
 * `kol-float-label` role on fg-64) with the resize corner as its glyph at the right — the same drag as the default grip.
 * @param {'float'}  [variant]
 * @param {string}   [icon]       float: the window's glyph
 * @param {Function} [onMinimise] float: the − control
 * @param {ReactNode} [status]    float: the footer line
 */
export default function QuickLookFrame({ variant, icon, onMinimise, status, title, meta, actions, onClose, nav, size: sizeProp, onResize, footer, className = '', children }) {
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

  const grip = { role: 'separator', 'aria-label': 'Resize', onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }
  if (variant === 'float') {
    return (
      <div ref={ref} style={size ? { width: size.w, height: size.h } : undefined}
        className={`kol-float-solid flex w-full max-w-[562px] flex-col gap-[18px] rounded-[var(--kol-float-window-r)] p-5 text-fg-emphasis ${className}`.trim()}>
        {header && <QuickLookHeader variant="float" icon={icon} title={title} actions={actions} onMinimise={onMinimise} onClose={onClose} />}
        <div className="flex min-h-0 flex-1 flex-col gap-[18px]">{children}</div>
        {footer}
        <div className="flex items-center gap-3">
          <span className="kol-float-label min-w-0 flex-1 truncate text-fg-64">{status}</span>
          <span {...grip} className="inline-flex size-4 cursor-nwse-resize touch-none items-center justify-center text-oq-64 hover:text-oq-96"><Icon name="expand" size={13} /></span>
        </div>
      </div>
    )
  }
  const style = size ? { width: size.w, height: size.h, '--kol-ql-frame-h': `${size.h}px`, '--kol-ql-max-w': `${size.w - 2}px` } : undefined
  return (
    <div ref={ref} style={style}
      className={`kol-quicklook${footer ? ' kol-quicklook--footer' : ''}${size ? ' kol-quicklook--sized' : ''} ${className}`.trim()}>
      {header && <QuickLookHeader title={title} meta={meta} actions={actions} nav={nav} onClose={onClose} />}
      <div className="kol-quicklook-body">{children}</div>
      {footer && <div className="kol-quicklook-footer">{footer}</div>}
      <span className="kol-quicklook-grip" {...grip} />
    </div>
  )
}
