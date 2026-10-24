import { useEffect, useRef, useState } from 'react'
import { pushLayer, popLayer, isTopLayer } from '../utilities/layerStack.js'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import CloseButton from '../atoms/CloseButton.jsx'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/* taxonomy-ok: nests kol-icons's Icon (a package import the relative-import
 * check can't see). */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Rail — A surface docked to an edge. A surface docked to an edge (RailOverlay, kol-monitor 2026-10-17 — user ruling: *"rail and overlay"*).
 * Anything docked to an edge — left, right, top or bottom — that collapses and expands is a rail; anything
 * floating over the page that closes is an overlay. Drawer, shelf, panel and sheet are retired as names
 * (`ShellDrawer` is this component's old name, an alias).
 *
 *   mode="over" (default) — the rail slides over the page on a scrim, with focus trap, Escape and scroll lock:
 *                           what ShellDrawer always was.
 *   mode="push"           — the rail sits in the layout and pushes it: inline, no scrim, no trap; `open`
 *                           expands it, closed it collapses to nothing. Its parent owns the flex row/column.
 *   resizable             — a grab line on the inner edge (the edge facing the page) drags the rail's size
 *                           between `minSize` and `maxSize`; on a bottom rail that is its TOP edge.
 *
 * Formerly — the edge drawer: a portalled panel that slides in from the
 * left, right or BOTTOM viewport edge over a dimming backdrop. Distinct from Modal
 * (centered prompt/confirm) and FullscreenOverlay (fills the whole viewport,
 * not an edge sheet). Escape, backdrop click and the built-in close button
 * all call `onClose`; body scroll locks while open; focus moves into the
 * panel on open, is trapped there, and returns to the opener on close.
 *
 * The slide transition is gated on prefers-reduced-motion: reduced users get
 * an instant mount/unmount with no transform animation.
 *
 * Presentational shell — the parent owns the open state and supplies the
 * header slot and body; no navigation or routing logic lives here.
 *
 * @param {boolean}       open      drawer visible (drives slide in/out)
 * @param {Function}      onClose   close request (Esc / backdrop / close button)
 * @param {string}        side      'left' | 'right' | 'bottom' — edge the panel slides from.
 *                                  `bottom` (ShellDrawerBottomSide, kol-mirror 2026-09-01) is the
 *                                  phone's sheet: full viewport width, slides up from +100% on Y,
 *                                  takes `height` where the sides take `width`, and pads its foot by
 *                                  `env(safe-area-inset-bottom)` so the last row clears the home bar.
 *                                  ONE DETENT — open or closed. A collapsed bar that grows on tap is
 *                                  a second height the consumer owns (mirror's 56px → 68dvh); this
 *                                  sheet does not carry it, and says so rather than half-build it.
 * @param {number|string} width     panel width (px number or CSS length); omit for full-width sheet — sides only
 * @param {number|string} height    panel height (px number or CSS length); omit for a content-sized sheet — `bottom` only
 * @param {ReactNode}     header    header-row content beside the close button (replaces the source's baked-in wordmark)
 * @param {boolean}       backdrop  render the dimming scrim (default true); false = panel alone, no darken/blur, close via × / Esc
 * @param {'xs'|'sm'|'md'|'lg'} closeSize  the close control's rung (default 'sm' — match the controls in the panel)
 * @param {boolean}       closeHover  the close's hover wash (default true); `false` keeps its box, drops the wash (CloseButton `hover`)
 * @param {ReactNode}     children  scrollable panel body
 * @param {string}        className extra classes on the panel
 */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const px = (v) => (v == null ? undefined : typeof v === 'number' ? `${v}px` : v)

export default function Rail({
  open,
  onClose,
  side = 'left',
  mode = 'over',
  resizable = false,
  minSize = 120,
  maxSize = 960,
  onResize,
  width,
  height,
  header,
  closeSide = 'end',
  backdrop = true,
  /* THE CLOSE SITS ON THE ROW'S RUNG (user 2026-09-03, on the settings drawer:
   * *"does this button follow the size ladder?"*). It was pinned `md` (32) while
   * every control in the panel below it — the switches, the dropdowns, the reset
   * frame — is `sm` (26), so the one control that is not a setting was the
   * largest thing on the surface. A size is a height and a row is one height;
   * `sm` is the default because a drawer header sits over its own controls.
   * Named `closeSize`, not `size` — `size` is already the panel's own box. */
  closeSize = 'sm',
  closeHover = true,
  children,
  className = '',
  /* SettingsPanelApproved (2026-08-27): the settings drawer has neither */
  edge = true,
  shadow = true,
}) {
  const reduced = usePrefersReducedMotion()
  const panelRef = useRef(null)
  const vertical = side === 'top' || side === 'bottom'
  /* the rail's own size once dragged; null = the `width` / `height` given */
  const [dragged, setDragged] = useState(null)
  const startResize = (e) => {
    if (!resizable) return
    e.preventDefault()
    const box = panelRef.current?.getBoundingClientRect()
    const start = { x: e.clientX, y: e.clientY, size: vertical ? box?.height ?? 0 : box?.width ?? 0 }
    /* the inner edge faces the page: dragging toward the page grows a left/top rail, away grows right/bottom */
    const sign = side === 'left' || side === 'top' ? 1 : -1
    const move = (ev) => {
      const d = vertical ? ev.clientY - start.y : ev.clientX - start.x
      const next = clamp(start.size + d * sign, minSize, maxSize)
      setDragged(next)
      onResize?.(next)
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); document.body.style.cursor = ''; document.body.style.userSelect = '' }
    document.body.style.cursor = vertical ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  const grab = resizable && (
    <span
      role="separator"
      aria-orientation={vertical ? 'horizontal' : 'vertical'}
      aria-label="Resize"
      onPointerDown={startResize}
      className={`absolute z-10 touch-none transition-colors hover:bg-oq-16 active:bg-oq-24 ${vertical ? 'inset-x-0 h-1.5 cursor-row-resize' : 'inset-y-0 w-1.5 cursor-col-resize'} ${side === 'bottom' ? 'top-0' : side === 'top' ? 'bottom-0' : side === 'right' ? 'left-0' : 'right-0'}`}
    />
  )
  const push = mode === 'push'

  /* Mount/slide state machine: `present` keeps the portal mounted through
   * the exit slide; `shown` drives the transform/opacity classes. Reduced
   * motion collapses both onto `open` — instant show/hide, no transform. */
  const [present, setPresent] = useState(open)
  const [shown, setShown] = useState(open)

  useEffect(() => {
    if (reduced) {
      setPresent(open)
      setShown(open)
      return undefined
    }
    if (open) {
      setPresent(true)
      // double rAF: let the off-screen position paint before sliding in
      let raf2
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true))
      })
      return () => {
        cancelAnimationFrame(raf1)
        if (raf2) cancelAnimationFrame(raf2)
      }
    }
    setShown(false)
    const t = setTimeout(() => setPresent(false), 200) // matches duration-200
    return () => clearTimeout(t)
  }, [open, reduced])

  // Escape closes; Tab is trapped inside the panel while open — while this is the TOP layer
  // (`layerStack`: a sheet opened over the drawer owns the keyboard until it closes)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    if (!open || push) return undefined
    const layer = pushLayer()
    const onKey = (e) => {
      if (!isTopLayer(layer)) return
      if (e.key === 'Escape') {
        onCloseRef.current?.()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const nodes = panel.querySelectorAll(FOCUSABLE)
      if (!nodes.length) {
        e.preventDefault()
        panel.focus()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (!panel.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { popLayer(layer); document.removeEventListener('keydown', onKey) }
  }, [open])

  /* Body scroll-lock + focus in/out. Gated on `present` too so the panel
   * exists before we focus it (it mounts one commit after `open` flips). */
  useEffect(() => {
    if (!(open && present) || push) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
  }, [open, present, push])

  const extent = dragged ?? (vertical ? height : width)
  /* the edge that faces the page carries the border, on every side */
  const edgeCls = edge ? ({ left: 'border-r', right: 'border-l', top: 'border-b', bottom: 'border-t' })[side] : ''

  if (push) {
    /* in the layout: the rail's size animates between 0 and its extent; its parent owns the row/column */
    const sizeStyle = vertical ? { height: open ? px(extent) ?? 'auto' : 0 } : { width: open ? px(extent) ?? 'auto' : 0 }
    return (
      <div
        ref={panelRef}
        aria-hidden={!open || undefined}
        className={`relative shrink-0 overflow-hidden bg-surface-primary border-oq-08 ${open ? edgeCls : ''} ${reduced ? '' : 'transition-[width,height] duration-200 ease-out'} ${className}`}
        style={sizeStyle}
      >
        {grab}
        <div className="flex h-full flex-col p-[var(--kol-pad-overlay)]">
          {header != null && <div className="mb-6 min-w-0">{header}</div>}
          <div className="flex-1 overflow-auto" style={{ overflowAnchor: 'none' }}>{children}</div>
        </div>
      </div>
    )
  }

  if (!present || typeof document === 'undefined') return null

  const slideOut = { bottom: 'translate-y-full', top: '-translate-y-full', right: 'translate-x-full', left: '-translate-x-full' }[side] ?? '-translate-x-full'
  const motionPanel = reduced
    ? ''
    : `transition-transform duration-200 ease-out ${shown ? (vertical ? 'translate-y-0' : 'translate-x-0') : slideOut}`
  const place = vertical
    ? `inset-x-0 ${side === 'bottom' ? 'bottom-0' : 'top-0'} w-full max-h-full ${edgeCls}`
    : `inset-y-0 max-w-full ${side === 'right' ? 'right-0' : 'left-0'} ${edgeCls} ${extent == null ? 'w-full' : ''}`
  /* padding per side (RailOverlay): a bottom rail clears the home bar at its foot; a top rail its notch */
  const size = vertical
    ? { ...(extent != null ? { height: px(extent) } : {}), ...(side === 'bottom' ? { paddingBottom: 'calc(var(--kol-pad-overlay) + env(safe-area-inset-bottom, 0px))' } : { paddingTop: 'calc(var(--kol-pad-overlay) + env(safe-area-inset-top, 0px))' }) }
    : extent != null ? { width: px(extent) } : undefined
  const motionBackdrop = reduced
    ? ''
    : `transition-opacity duration-200 ease-out ${shown ? 'opacity-100' : 'opacity-0'}`

  return createPortal(
    <>
      {backdrop && (
        /* A BUTTON, not a div (OverlayScrimTapDismiss, 2026-09-01): iOS Safari
         * does not bubble tap-clicks from non-interactive elements, so a div
         * scrim's onClick never fires on a phone — the same line that broke
         * the search overlay's dismiss. */
        <button
          type="button"
          aria-label="Close"
          className={`fixed inset-0 z-[100] kol-overlay-scrim ${motionBackdrop}`}
          onClick={onClose}
        />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        /* `edge` / `shadow` (SettingsPanelApproved, 2026-08-27): the approved settings
         * drawer has neither — the sheet meets the page flat */
        className={`fixed z-[200] flex flex-col bg-surface-primary p-[var(--kol-pad-overlay)] outline-none ${backdrop && shadow ? 'shadow-2xl' : ''} ${place} border-oq-08 ${motionPanel} ${className}`}
        style={size}
      >
        {grab}
        {/* closeSide="start": the reference sets the × glyph ~9px deeper than
          * the label column's edge, with extra top air (both reference frames
          * 2026-08-09 measure the same inset) */}
        <div className={`mb-6 flex items-center gap-4${closeSide === 'start' ? ' pt-3 pl-2' : ''}`}>
          {/* closeSide="start" — the record-surface anatomy (reference frame,
            * 2026-08-09): × leads, the header's actions sit at the far end. */}
          {closeSide === 'start' && (
            /* bare glyph, no container (user 2026-08-09: "the X close icon
             * does not need a container") — body ink at rest, emphasis on hover */
            <CloseButton onClick={onClose} size={closeSize} hover={closeHover} className="shrink-0" />
          )}
          {header != null && <div className="min-w-0 flex-1">{header}</div>}
          {/* A NORMAL ICON BUTTON (user 2026-09-02: *"it should just be like a
            * normal button with a close icon, its not new?"*). It carried
            * `iconSize={14}` — kept in 2026-08-01 to preserve the glyph size the
            * hand-rolled button before it happened to have — so the box sat at
            * the md rung's 32px around a glyph six under it, and it read as an
            * oversized empty square. No override: the rung sets both. */}
          {closeSide !== 'start' && (
            <CloseButton onClick={onClose} size={closeSize} hover={closeHover} className="ml-auto shrink-0" />
          )}
        </div>
        <div className="flex-1 overflow-y-auto pr-1" style={{ overflowAnchor: 'none' }}>
          {children}
        </div>
      </div>
    </>,
    document.body,
  )
}
