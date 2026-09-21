import { useState } from 'react'
import { XYPad } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* Two axes, one puck — the variable-font explore pad from fxr's type surface,
 * lifted as-is (editor-panels-the-held-specs A6). Ranges and meaning are the
 * caller's; the pad only maps pointer to values and back. Top is high. */
export default function XYPadDemo() {
  const [v, setV] = useState({ x: 100, y: 500 })
  return (
    <div className="flex w-56 flex-col gap-2">
      <XYPad
        xValue={v.x} yValue={v.y}
        xMin={50} xMax={200}
        yMin={100} yMax={900}
        xLabel="Width" yLabel="Weight"
        onChange={(x, y) => setV({ x: Math.round(x), y: Math.round(y) })}
      />
      <span className="kol-helper-10 text-meta">wdth {v.x} · wght {v.y}</span>
    </div>
  )
}
