import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/* taxonomy-ok: nests kol-icons's Icon (a package import the relative-import
 * check can't see). */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * ShellDrawer — THE edge drawer: a portalled panel that slides in from the
 * left or right viewport edge over a dimming backdrop. Distinct from Modal
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
 * @param {string}        side      'left' | 'right' — edge the panel slides from
 * @param {number|string} width     panel width (px number or CSS length); omit for full-width sheet
 * @param {ReactNode}     header    header-row content beside the close button (replaces the source's baked-in wordmark)
 * @param {ReactNode}     children  scrollable panel body
 * @param {string}        className extra classes on the panel
 */
export default function ShellDrawer({
  open,
  onClose,
  side = 'left',
  width,
  header,
  children,
  className = '',
}) {
  const reduced = usePrefersReducedMotion()
  const panelRef = useRef(null)

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

  // Escape closes; Tab is trapped inside the panel while open
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
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
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /* Body scroll-lock + focus in/out. Gated on `present` too so the panel
   * exists before we focus it (it mounts one commit after `open` flips). */
  useEffect(() => {
    if (!(open && present)) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
  }, [open, present])

  if (!present || typeof document === 'undefined') return null

  const slideOut = side === 'right' ? 'translate-x-full' : '-translate-x-full'
  const motionPanel = reduced
    ? ''
    : `transition-transform duration-200 ease-out ${shown ? 'translate-x-0' : slideOut}`
  const motionBackdrop = reduced
    ? ''
    : `transition-opacity duration-200 ease-out ${shown ? 'opacity-100' : 'opacity-0'}`

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/50 ${motionBackdrop}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`fixed inset-y-0 z-[200] flex max-w-full flex-col bg-surface-primary px-4 py-4 shadow-2xl outline-none md:px-5 lg:px-6 ${
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r'
        } border-fg-08 ${width == null ? 'w-full' : ''} ${motionPanel} ${className}`}
        style={width != null ? { width: typeof width === 'number' ? `${width}px` : width } : undefined}
      >
        <div className="mb-6 flex items-center gap-4">
          {header != null && <div className="min-w-0 flex-1">{header}</div>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-0 bg-transparent cursor-pointer text-fg-64 transition-colors hover:bg-fg-08 hover:text-emphasis"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1" style={{ overflowAnchor: 'none' }}>
          {children}
        </div>
      </div>
    </>,
    document.body,
  )
}
