/* The page's live data hook and the Edit mode's card sizing — the drawing is kol-dashboards' (W5.1); the old
 * section switcher, DeployBar, WeekdayGrid, SiteExtras and OneCard went to _tmp/2026-11-04-metric-local-parts/. */
import { createContext, useContext, useRef, useState } from 'react'
import { ResizeHandle } from '@kolkrabbi/kol-component'
import useMetricsData from '../useMetricsData.js'

/* the live hook, at the live page's 30 days.
 * ponytail: its range is its own (30d), not the date picker's — wire setRange to the picker if they must move together */
export function useLive() {
  return useMetricsData({ mainHost: 'kolkrabbi.io' })
}

/* 12.5 — Edit mode: every card gets a grip on its foot; dragging it sets the card's height, kept per viewer (browser
 * storage — a convenience, never shared). Outside Edit a stored height holds and the grip is gone. */
export const Editing = createContext(false)
const read = (k) => { try { return Number(localStorage.getItem(k)) || null } catch { return null } }
export function Sized({ id, className = '', children }) {
  const editing = useContext(Editing)
  const ref = useRef(null)
  const base = useRef(null)
  const key = `demo9-card-${id}`
  const [h, setH] = useState(() => read(key))
  /* /demo-10 (13.6): the DS grab gesture on the card's foot (kol/ResizeHandle.jsx), not a hand-made pill — the
   * pre-/demo-10 raw-button pill retired (MetricRebuild 2026-10-31: `ten` is always on in this app) */
  return (
    <div ref={ref} data-card={id}
      className={`relative min-w-0 [&>section]:h-full ${className} ${editing ? 'rounded outline outline-1 outline-dashed outline-[var(--kol-fg-24)]' : ''}`}
      style={{ height: h || undefined, overflow: h ? 'hidden' : undefined }}>
      {children}
      {editing && (
        <ResizeHandle axis="y"
          onDrag={(d) => { if (base.current == null) base.current = ref.current.offsetHeight; setH(Math.max(120, Math.round(base.current + d))) }}
          onEnd={() => { base.current = null; try { localStorage.setItem(key, String(ref.current.offsetHeight)) } catch {} }} />
      )}
    </div>
  )
}
