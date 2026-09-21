import { useState } from 'react'
import { KeyframeEditor } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* The clock is the demo's — `t` in, `onSeek` / `onPause` out — so selecting
 * a key holds the readout on that pose and "Add @ playhead" stamps wherever
 * the slider sits (editor-panels-the-held-specs A5). Rotations edit in
 * degrees and store in radians; the readout shows the stored value. */
export default function KeyframeEditorDemo() {
  const [kfs, setKfs] = useState()
  const [t, setT] = useState(0.35)
  const [paused, setPaused] = useState(false)
  return (
    <div className="flex w-64 flex-col gap-3">
      <label className="flex items-center gap-2 kol-helper-10 text-meta">
        playhead <input type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => { setT(Number(e.target.value)); setPaused(false) }} className="flex-1" />
        <span className="tabular-nums">{t.toFixed(2)}{paused ? ' · paused' : ''}</span>
      </label>
      <KeyframeEditor keyframes={kfs} onChange={setKfs} t={t} onSeek={setT} onPause={() => setPaused(true)} />
      <span className="kol-helper-10 text-meta">{(kfs ?? []).length || 2} keys</span>
    </div>
  )
}
