import { useRef, useEffect, useState } from 'react'
import { JackSocket } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* Outputs and inputs, rest · connected · pending; the last one glows with a
 * live signal fed through `signalRef` (a sine, so the rim breathes). */
export const sizes = ['md', 'sm']

export default function JackSocketDemo({ size = 'md' }) {
  const sig = useRef({ type: 'scalar', value: 0 })
  /* `ringRef` hands the RING to a consumer's hit-test registry — here it just
   * reports the ring's size so the seam is visibly wired */
  const ring = useRef(null)
  const [ringPx, setRingPx] = useState(null)
  useEffect(() => { setRingPx(ring.current?.getBoundingClientRect().width ?? null) }, [])
  useEffect(() => {
    let raf, t = 0
    const tick = () => { t += 0.03; sig.current = { type: 'scalar', value: 50 + 50 * Math.sin(t) }; raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div style={ROW}>
      <JackSocket size={size} type="out" label="out" />
      <JackSocket size={size} type="out" label="out" active />
      <JackSocket size={size} type="out" label="out" pending />
      <JackSocket size={size} type="in" label="in" color="#4ade80" />
      <JackSocket size={size} type="in" label="in" color="#4ade80" dimPending />
      <JackSocket size={size} type="in" label="cv" color="#497DA2" active />
      <JackSocket size={size} type="out" label="sig" active signalRef={sig} ringRef={ring} />
      <span className="kol-helper-8 text-fg-32" data-ring-px={ringPx}>{ringPx ? `ring ${ringPx}px` : ''}</span>
    </div>
  )
}
