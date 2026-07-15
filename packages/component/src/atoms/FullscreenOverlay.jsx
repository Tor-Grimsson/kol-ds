import { useEffect, useRef } from 'react'

export default function FullscreenOverlay({ open, onClose, closeButton = true, children }) {
  const sheetRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
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
      <div ref={sheetRef} className="kol-overlay-sheet">
        {closeButton && (
          <button
            type="button"
            className="kol-overlay-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
