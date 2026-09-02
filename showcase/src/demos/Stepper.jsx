import { useState } from 'react'
import { Stepper } from '@kolkrabbi/kol-component'

/* One instance; size rides the toolbar picker (2026-08-09 consistency
 * ruling). Stepper sizes are the shared control ladder Button rides —
 * sm 4/12 mono-12 · md 6/16 mono-14 · lg 8/20 mono-16. */
export const sizes = ['sm', 'md', 'lg', 'xs']

/* xs is the panel rung (ControlsXsRung, 2026-09-01); `options` steps a LIST —
 * the rack's ‹ value › Selector as a variant of this — wrapping at both ends,
 * reporting the option in the same `{ target: { value } }` shape. */
export default function StepperDemo({ size = 'sm' }) {
  const [v, setV] = useState(2)
  const [wave, setWave] = useState('tri')
  return (
    <div className="flex items-center gap-4">
      <Stepper value={v} onChange={(e) => setV(e.target.value)} min={0} max={10} size={size} />
      <Stepper value={wave} onChange={(e) => setWave(e.target.value)} options={['sine', 'tri', 'saw', 'sqr']} size={size} />
      {/* inline: the rack's ‹ value › on one line, no field (StepperInlineVariant) */}
      <Stepper value={wave} onChange={(e) => setWave(e.target.value)} options={['sine', 'tri', 'saw', 'sqr']} size={size} layout="inline" className="uppercase" />
    </div>
  )
}
