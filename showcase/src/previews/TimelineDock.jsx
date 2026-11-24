import { useEffect, useRef, useState } from 'react'
import { TimelineDock, sampleTrack } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* The dock with a clock of its own — a 4-second rAF loop, which is exactly
 * the seam: `t` and `onSeek` are props, so this preview's clock, fxr's transport
 * or a scrubbed video can all drive it. Click a lane to add a key, drag a
 * diamond, alt-click to delete; one `onChange` per gesture
 * (editor-panels-the-held-specs B3). The readouts sample the tracks at `t`. */
const SEED = [
  { id: 'circle:x', label: 'Circle · x', keys: [{ t: 0, v: 0, easing: 'linear' }, { t: 0.5, v: 100, easing: 'ease' }, { t: 1, v: 0, easing: 'linear' }] },
  { id: 'circle:opacity', label: 'Circle · opacity', keys: [{ t: 0.2, v: 0.2, easing: 'in-out' }, { t: 0.8, v: 1, easing: 'hold' }] },
]

export const variants = ['default', 'kolbox', 'folio']

export default function TimelineDockPreview({ variant = 'default' }) {
  /* folio (Folio migration batch D): display only, Folio's keys plain positions 0..1 */
  if (variant === 'folio') return (
    <div className="w-full" style={{ background: 'var(--kol-folio-paper)', color: 'var(--kol-folio-ink)' }}><TimelineDock variant="folio" t={0.34} onSeek={() => {}}
      tracks={[{ id: 'flow', label: 'Obstacle flow', keys: [0, 0.33, 0.66] }, { id: 'opacity', label: 'Opacity', keys: [0.16, 0.5, 0.83] }]} /></div>
  )
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return (
    <div className="w-full"><TimelineDock variant="kolbox" title="Untitled" count={2} time={3} duration={12}
      tracks={[{ id: 'a', name: 'Rectangle', icon: 'rectangle', keyframes: [0, 4, 8], visible: true, locked: false, selected: true }, { id: 'b', name: 'Ellipse', icon: 'circle', keyframes: [] }]} /></div>
  )
  const [tracks, setTracks] = useState(SEED)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const start = useRef(performance.now())

  useEffect(() => {
    if (!playing) return
    let raf
    const loop = (now) => { setT(((now - start.current) / 4000) % 1); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div className="flex items-center gap-4 kol-helper-12 text-meta">
        <button type="button" className="kol-mono-12 text-emphasis" onClick={() => setPlaying((p) => !p)}>{playing ? 'pause' : 'play'}</button>
        {tracks.map((tr) => <span key={tr.id}>{tr.label} = {Number(sampleTrack(tr.keys, t)).toFixed(2)}</span>)}
      </div>
      <div className="rounded border border-fg-08 overflow-hidden">
        <TimelineDock
          tracks={tracks}
          t={t}
          onSeek={(next) => { setPlaying(false); setT(next) }}
          onChange={(id, keys) => setTracks((all) => all.map((tr) => (tr.id === id ? { ...tr, keys } : tr)))}
        />
      </div>
    </div>
  )
}
