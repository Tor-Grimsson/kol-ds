import { useState } from 'react'
import { Knob } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* Drag up/down (200px = the range); ⌥-click resets; on touch hold 500ms for the
 * big ParamSheet. Four sizes, the bipolar legend, the row variants. */
export const variants = ['column', 'row', 'row-left', 'row-right']
export const sizes = ['md', 'sm', 'lg', 'xl']

export default function KnobDemo({ variant = 'column', size = 'md' }) {
  const [v, setV] = useState(35)
  const [b, setB] = useState(-20)
  return (
    <div style={ROW}>
      <Knob value={v} onChange={setV} label="gain" variant={variant} labelMinWidth={28} size={size} />
      <Knob value={b} onChange={setB} label="pan" bipolar variant={variant} labelMinWidth={28} size={size} />
    </div>
  )
}
