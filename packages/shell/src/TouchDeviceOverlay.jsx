import { useEffect, useState } from 'react'

const STORAGE_KEY = 'kol-touch-warning-dismissed'

/** useTouchPrimary — true on a coarse-pointer device (live). */
export function useTouchPrimary() {
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarse(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return coarse
}

/**
 * TouchDeviceOverlay — "Desktop recommended", once, on a touch-primary device
 * (kol-monitor's overlay, promoted 2026-08-27 — ShellHomeSystem; `AppShell
 * touch="overlay"` mounts it). Dismissal is remembered in localStorage.
 *
 * @param {string} appName   the sentence's subject ("Monitor is built for mouse and keyboard…")
 * @param {string} message   override the sentence whole
 */
export default function TouchDeviceOverlay({ appName = 'This app', message }) {
  const coarse = useTouchPrimary()
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
  })
  if (!coarse || dismissed) return null
  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* storage blocked */ }
    setDismissed(true)
  }
  return (
    <div className="fixed inset-0 select-none bg-fg-inverse-08" style={{ display: 'grid', placeItems: 'center', backdropFilter: 'blur(2px)', zIndex: 100 }}>
      <div className="bg-surface-primary border border-oq-08" style={{ width: 360, borderRadius: 4, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="kol-helper-14 text-fg-96">Desktop recommended</div>
        <div className="kol-mono-12 text-fg-64">
          {message ?? `${appName} is built for mouse and keyboard — drag, tweak and use keyboard shortcuts. Touch input isn't supported yet.`}
        </div>
        <button type="button" onClick={dismiss} className="kol-helper-12 text-fg-96 bg-fg-08 border border-oq-08 cursor-pointer" style={{ padding: '8px 12px', borderRadius: 4, marginTop: 4, alignSelf: 'flex-end' }}>
          Continue anyway
        </button>
      </div>
    </div>
  )
}
