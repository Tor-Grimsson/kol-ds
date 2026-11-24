import { useState } from 'react'
import { LogoSystem } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* A mark built from a few measures: drag a handle to change its measure, double-click one to give the drags back.
 * The settings are the host's; here only the drags are kept. */
const SETTINGS = { harmony: 'golden', join: 'union', bar: true, foot: true, construction: true, math: true, fill: 'grey', handles: true, grid: 'off' }

export default function LogoSystemPreview() {
  const [over, setOver] = useState(null)
  return (
    <div className="aspect-[3/2] w-full">
      <LogoSystem settings={{ ...SETTINGS, over }} onDrag={(k, v) => setOver((o) => ({ ...o, [k]: v }))} onDragReset={() => setOver(null)} />
    </div>
  )
}

/* Index card: the mark alone. */
export function Card() {
  return (
    <div className="h-40 w-full">
      <LogoSystem settings={SETTINGS} peek />
    </div>
  )
}
