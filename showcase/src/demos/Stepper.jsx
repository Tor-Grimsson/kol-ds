import { useState } from 'react'
import { Stepper } from '@kolkrabbi/kol-component'

/* One instance; size rides the toolbar picker (2026-08-09 consistency
 * ruling). Stepper sizes are the shared control ladder Button rides —
 * sm 4/12 mono-12 · md 6/16 mono-14 · lg 8/20 mono-16. */
export const sizes = ['sm', 'md', 'lg']

export default function StepperDemo({ size = 'sm' }) {
  const [v, setV] = useState(2)
  return <Stepper value={v} onChange={(e) => setV(e.target.value)} min={0} max={10} size={size} />
}
