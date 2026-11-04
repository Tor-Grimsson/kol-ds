import { useState } from 'react'
import { MenuDatePicker } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

const GROUPS = [
  [{ key: 'day', label: 'Today', kbd: 'D' }, { key: 'yesterday', label: 'Yesterday', kbd: 'E' }],
  [{ key: '7d', label: 'Last 7 Days', kbd: 'W' }, { key: '28d', label: 'Last 28 Days', kbd: 'F' }],
  [{ key: 'custom', label: 'Custom Range', kbd: 'C' }],
]
const labelOf = (key) => GROUPS.flat().find((r) => r.key === key)?.label

export function Card() {
  return <MenuDatePicker groups={GROUPS} value="28d" label={labelOf('28d')} />
}

export const tones = CONTROL_TONES
export const aligns = ALIGNS
/* `float` (float-everything W2 row 33): the date chip — the value in mono on the well, the float list under it */
export const variants = ['default', 'float']

export default function MenuDatePickerPreview({ tone, align = 'start', variant = 'default' }) {
  const [value, setValue] = useState('28d')
  const [compare, setCompare] = useState(false)
  return (
    <div className={`flex min-h-[120px] w-full items-start justify-center ${toneWrap(tone)}`}>
      <MenuDatePicker key={align + variant} align={align} variant={variant === 'float' ? 'float' : undefined} groups={GROUPS} value={value} onChange={setValue} label={variant === 'float' ? '2026-07-01' : labelOf(value)}
        compare={{ label: compare ? 'Disable comparison' : 'Compare', kbd: 'X', onClick: () => setCompare((c) => !c) }} />
    </div>
  )
}
