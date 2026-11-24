import { startTransition, useEffect, useState, useSyncExternalStore } from 'react'

/* The canvas zoom, published from inside the DS viewport (CanvasArea's ZoomProbe reads its
 * CanvasZoomContext) so the title line, which sits outside it, can show it — in REAL terms since
 * plan 33: screen px per frame px, 1 = 100% (Affinity's), not the DS's fitted-relative zoom. */
let zoom = 1
const subs = new Set()
/* THE SETTLED ZOOM (plan-2026-11-18-kolbox-system W18): the same value once the zoom has rested for SETTLE_MS. The
 * profile found the menu bar's data (MenuTop, kolbox's useMenus) subscribed live for the Zoom submenu's check marks,
 * so a pinch re-rendered the whole menu bar, or the whole editor screen, on every wheel event (14 to 15ms each). Menus
 * read the settled value; the small readouts stay live. */
const SETTLE_MS = 150
let settled = 1
let settleTimer = null
const settledSubs = new Set()
export const setZoom = (z) => {
  if (z === zoom) return
  zoom = z
  subs.forEach((f) => f())
  clearTimeout(settleTimer)
  settleTimer = setTimeout(() => { if (settled !== zoom) { settled = zoom; settledSubs.forEach((f) => f()) } }, SETTLE_MS)
}
export const getZoom = () => zoom
export const useZoom = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => zoom)
/* a transition, not a store snapshot: the one settled render of a large menu bar yields to the frames around it */
export function useZoomSettled() {
  const [z, setZ] = useState(settled)
  useEffect(() => {
    const f = () => startTransition(() => setZ(settled))
    settledSubs.add(f)
    f()
    return () => settledSubs.delete(f)
  }, [])
  return z
}
