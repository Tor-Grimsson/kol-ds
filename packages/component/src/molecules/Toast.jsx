import { useEffect, useState } from 'react'
import Link from '../atoms/Link.jsx'

/* taxonomy-ok: molecule — a message and a Link on one floating row */

/**
 * Toast — One short message on a floating row, with one action (plan-2026-11-18-kolbox-system W31.2 batch 4,
 * 2026-11-18; kolbox's Toast, Figma 288:7452). One row: the message (Inter 11 / 15 medium, the ink) then one `Link`,
 * 12 apart; padding 8 top and bottom, 12 right, 16 left; radius 12; the secondary surface on the one floating surface
 * (`.kol-kolbox-surface`), clipped. Its one look. Feedback.
 *
 *   toast({ message: 'Saved', action: 'Show in Files', onAction })   // from anywhere: raises it in the ToastHost
 *   <ToastHost />                                                     // once, at the app's root
 *
 * @param {string}   [message]  the message
 * @param {string}   [action]   the Link's words; none, no Link
 * @param {Function} [onAction] the Link's press
 */
export default function Toast({ message = 'File moved', action = 'Show in kol-ds-ui [library files]', onAction }) {
  return (
    <div role="status" data-toast
      className="kol-toast kol-kolbox-surface flex items-center gap-3 overflow-clip py-2 pr-3 pl-4">
      <span className="kol-toast-message shrink-0 whitespace-nowrap">{message}</span>
      {action && <Link onClick={onAction}>{action}</Link>}
    </div>
  )
}

/* The window event a toast rides on (kolbox's was `kolbox:toast`; KOL's events are `kol:`). */
const TOAST_EVENT = 'kol:toast'

/** toast — raise one Toast in the ToastHost: `toast({ message, action, onAction })`. */
export const toast = (detail) => window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }))

/**
 * ToastHost — The one toast on screen: at the foot of the window, centred, 80 up so it clears an editor's dock, for
 * 4 s or until the next one. Mount it once.
 */
export function ToastHost() {
  const [t, setT] = useState(null)
  useEffect(() => {
    let timer
    const on = (e) => { clearTimeout(timer); setT({ ...e.detail, key: Date.now() }); timer = setTimeout(() => setT(null), 4000) }
    window.addEventListener(TOAST_EVENT, on)
    return () => { window.removeEventListener(TOAST_EVENT, on); clearTimeout(timer) }
  }, [])
  if (!t) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center">
      <div className="pointer-events-auto">
        <Toast key={t.key} message={t.message} action={t.action} onAction={() => { t.onAction?.(); setT(null) }} />
      </div>
    </div>
  )
}
