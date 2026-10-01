import { useState } from 'react'
import { Knob } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* Drag up/down (200px = the range); ⌥-click resets; on touch hold 500ms for the
 * big ParamSheet. Four sizes, the bipolar legend, the row variants. */
export const variants = ['column', 'row', 'row-left', 'row-right']
export const sizes = ['md', 'sm', 'lg', 'xl']

export default function KnobDemo({ variant = 'column', size = 'md' }) {
  const [v, setV] = useState(35)
  const [b, setB] = useState(-20)
  return (
    <div style={PLATE}>
      <Knob value={v} onChange={setV} label="gain" variant={variant} labelMinWidth={28} size={size} />
      <Knob value={b} onChange={setB} label="pan" bipolar variant={variant} labelMinWidth={28} size={size} />
    </div>
  )
}
