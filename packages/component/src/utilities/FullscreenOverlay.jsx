import { useEffect, useRef } from 'react'
import Button from '../atoms/Button.jsx'

/**
 * FullscreenOverlay — the scrim + centred sheet every overlay in the repo
 * wears. Owns dismissal (Escape, backdrop, close button), scroll lock and
 * stacking; the consumer supplies the panel.
 *
 * The close control is the DS `Button` (quiet, icon-only, the `x` glyph) —
 * the same idiom as ShellLayout's. It was a hand-rolled <button> printing a
 * literal `×` TEXT CHARACTER until 2026-08-01: no icon, no states, and a
 * typographic multiplication sign standing in for a glyph the icon set has
 * always shipped.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function FullscreenOverlay({ open, onClose, closeButton = true, children }) {
  const sheetRef = useRef(null)

  /* Escape closes; Tab is TRAPPED in the sheet (SettingsPanel, 2026-08-26 —
   * the same trap ShellDrawer carries; before this a Tab from the overlay
   * walked into the page underneath). Focus moves into the sheet on open and
   * back to the opener on close. */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose?.(); return }
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
    sheetRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
  }, [open, onClose])

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
    <div className="kol-overlay" role="dialog" aria-modal="true" onMouseDown={onBackdropClick}>
      <div ref={sheetRef} tabIndex={-1} className="kol-overlay-sheet outline-none">
        {closeButton && (
          /* ONE close idiom (FullscreenOverlayCloseIdiom, kol-chess 2026-09-01,
           * user ruling): the estate's close X is the drawer trigger's bare
           * `nav` glyph — the boxed outline treatment was a second design one
           * tap away from the first, and had he kept a box it would have worn
           * `primary`, never `outline`. Same variant, same default square as
           * the trigger. */
          <Button
            variant="nav"
            iconOnly="x"
            className="kol-overlay-close"
            onClick={onClose}
            aria-label="Close"
          />
        )}
        {children}
      </div>
    </div>
  )
}
