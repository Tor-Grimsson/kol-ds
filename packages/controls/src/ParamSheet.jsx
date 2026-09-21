import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { Slider } from '@kolkrabbi/kol-component'

/**
 * ParamSheet — a knob or fader, big, at the bottom of the screen. Opened by a
 * long-press on the control (touch only): a rack knob is 24px and a finger is
 * not, so precision on a phone comes from a full-width track, not from zoom
 * (user, 2026-09-01: "if sometimes things are hard to reach"). Long-press, not
 * double-tap — Safari owns double-tap, and ⌥-click is already reset.
 *
 * The DS Slider is the track and the readout; this file only owns the plate
 * and the scrim. The long-press arming is `armLongPress`.
 *
 * @param {string}   label
 * @param {number}   value · min · max · step (default 1) · defaultValue
 * @param {Function} onChange  `(value) => void`
 * @param {Function} onClose   Esc and tap-outside call it
 */
export default function ParamSheet({ label, value, min, max, step = 1, defaultValue, onChange, onClose }) {
  useEffect(() => {
    const key = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [onClose])

  return createPortal(
    /* NO SCRIM, deliberately (overlay-scrim-outliers sweep, 2026-09-03): lifted
       verbatim from monitor's rack, where the tap-away backdrop is untinted so
       the rack stays readable while a value is dragged on the sheet. */
    <div className="fixed inset-0" style={{ zIndex: 'var(--kol-z-modal)' }} onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 bg-surface-primary border-t border-fg-08 p-4 pb-8 text-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Slider label={label || 'value'} value={value} min={min} max={max} step={step} defaultValue={defaultValue} onChange={onChange} />
      </div>
    </div>,
    document.body,
  )
}
