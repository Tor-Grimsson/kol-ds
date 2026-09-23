import { useEffect, useRef } from 'react'
import { pushLayer, popLayer, isTopLayer } from './layerStack.js'
import CloseButton from './CloseButton.jsx'

/**
 * FullscreenOverlay — the scrim + centred sheet every overlay in the repo
 * wears. Owns dismissal (Escape, backdrop, close button), scroll lock and
 * stacking; the consumer supplies the panel.
 *
 * The close control is the DS `Button` (icon-only, the `x` glyph) — the estate's
 * ONE close idiom, and therefore ONE SIZE: `sm` (26), matching `ShellDrawer`'s
 * (2026-09-03). It took Button's `md` default while the drawer's went to `sm`,
 * which is two sizes for one idiom — the thing the single-idiom ruling exists to
 * stop. It was a hand-rolled <button> printing a
 * literal `×` TEXT CHARACTER until 2026-08-01: no icon, no states, and a
 * typographic multiplication sign standing in for a glyph the icon set has
 * always shipped.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function FullscreenOverlay({
  open, onClose, closeButton = true,
  /* WHERE FOCUS LANDS ON OPEN. The sheet takes it by default, which is right
   * for a browser and wrong for a sheet opened to be TYPED IN: a child's
   * `autoFocus` cannot win, because child effects run BEFORE the parent's and
   * this one moves focus afterwards — so the field focuses and is immediately
   * robbed, with nothing in either file looking wrong (kol-fxr measured it on
   * design-editor 0.10.0: Save As routed into the dialog correctly and focus
   * sat on `.kol-overlay-sheet`). Pass a ref to the node that should hold it.
   * A ref that is empty on mount falls back to the sheet, so a conditional
   * field cannot leave the overlay unfocused.
   *
   * The ref may point at the control ITSELF or at a WRAPPER around it — the
   * first focusable descendant is taken. That is deliberate: a DS input is a
   * component, not a DOM node, and whether it forwards a ref is a detail no
   * caller should have to know to put focus in it. A plain `<div ref>` always
   * works. */
  initialFocus,
  /* A DIM BACKDROP INSTEAD OF THE SURFACE (user 2026-09-23, on Quick Look: *"its overlay, not a
   * black background … just dim the background slightly"*). The flat surface is still the default
   * — that is the 2026-08-27 ruling, made because a wash read as a halo around a lightboxed image
   * — so this is opt-in per overlay rather than a reversal for every consumer of the component. */
  scrim = false,
  children,
}) {
  const sheetRef = useRef(null)

  /* Escape closes; Tab is TRAPPED in the sheet (SettingsPanel, 2026-08-26 —
   * the same trap ShellDrawer carries; before this a Tab from the overlay
   * walked into the page underneath). Focus moves into the sheet on open and
   * back to the opener on close. */
  /* `onClose` through a ref: an inline handler is a new function every render, and with it in the
   * deps the effect re-ran on every render — re-pushing this layer to the TOP of the stack and
   * re-stealing focus while a sheet above it was open. */
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    if (!open) return
    const layer = pushLayer()
    const onKey = (e) => {
      if (!isTopLayer(layer)) return
      if (e.key === 'Escape') { onCloseRef.current?.(); return }
      if (e.key !== 'Tab') return
      const sheet = sheetRef.current
      if (!sheet) return
      const nodes = sheet.querySelectorAll(FOCUSABLE)
      if (!nodes.length) { e.preventDefault(); sheet.focus(); return }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (!sheet.contains(active)) { e.preventDefault(); first.focus() }
      else if (e.shiftKey && (active === first || active === sheet)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement
    const wanted = initialFocus?.current
    const target = wanted
      ? (typeof wanted.focus === 'function' && wanted.matches?.(FOCUSABLE)
          ? wanted
          : wanted.querySelector?.(FOCUSABLE) ?? wanted)
      : sheetRef.current
    target?.focus?.()
    return () => {
      popLayer(layer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
  }, [open, initialFocus])

  if (!open) return null

  /* Dismiss ONLY when the backdrop itself is hit. The old check ("target not
   * inside the sheet") closed the overlay on clicks in PORTALLED children —
   * React portals bubble events through the React tree, so a Dropdown panel
   * opened from inside the sheet (mounted on <body> via FloatingPortal)
   * registered as an outside click and killed the overlay on option-select. */
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  return (
    <div className={`kol-overlay${scrim ? ' kol-overlay-scrim' : ''}`} role="dialog" aria-modal="true" onMouseDown={onBackdropClick}>
      <div ref={sheetRef} tabIndex={-1} className="kol-overlay-sheet outline-none">
        {closeButton && (
          /* ONE close idiom (FullscreenOverlayCloseIdiom, kol-chess 2026-09-01,
           * user ruling): the estate's close X is the drawer trigger's bare
           * `nav` glyph — the boxed outline treatment was a second design one
           * tap away from the first, and had he kept a box it would have worn
           * `primary`, never `outline`. Same variant as the trigger; the SQUARE
           * is `sm` since 2026-09-03, one size for the one idiom. */
          <CloseButton className="kol-overlay-close" onClick={onClose} />
        )}
        {children}
      </div>
    </div>
  )
}
