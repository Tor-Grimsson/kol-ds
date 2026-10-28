// The transport's React side (TransportAndTimeline, 2026-10-28) — the clock itself is plain JS, `createTransport()` in
// `@kolkrabbi/kol-hardware/signal`. These read one clock: the state snapshot (re-renders on a change, never per frame), the
// play state alone, and the shaped time per frame for whatever draws it (a head, a readout, a bound value).
import { useEffect, useState, useSyncExternalStore } from 'react'

const never = () => () => {}

/* the state snapshot — `{ playing, rate, mode, loopIn, loopOut, swing, ease, looping, hold }`; mirror's useTransport */
export function useTransport(transport) {
  return useSyncExternalStore(transport ? transport.subscribe : never, () => transport?.state, () => transport?.state)
}

/* the play state alone — a <video> following play/pause without a per-frame subscription */
export function useTransportPlaying(transport) {
  return useSyncExternalStore(transport ? transport.subscribe : never, () => !!transport?.playing, () => !!transport?.playing)
}

/* the shaped time, sampled each frame at up to `fps` (mirror's TimeStrip `useNow`, 30 by default); `enabled: false` stops it */
export function useTransportNow(transport, { fps = 30, enabled = true } = {}) {
  const [now, setNow] = useState(() => transport?.now() ?? 0)
  useEffect(() => {
    if (!transport || !enabled) return undefined
    let raf
    let last = 0
    const gap = 1000 / fps
    const tick = (ts) => {
      if (ts - last > gap) { last = ts; setNow(transport.now()) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [transport, fps, enabled])
  return now
}
