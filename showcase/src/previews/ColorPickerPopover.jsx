import { useState } from 'react'
import { ColorPickerPopover } from '@kolkrabbi/kol-component'

/* monitor's module colour rows — a set colour, a translucent one, none; ⌥-click resets */
export const sizes = ['xs', 'sm']

export default function ColorPickerPopoverPreview({ size = 'xs' }) {
  const [a, setA] = useState('#E74C3C')
  const [b, setB] = useState('#3C8CE780')
  const [c, setC] = useState('transparent')
  return (
    <div className="flex items-center gap-4 kol-mono-12 text-fg-64">
      {[[a, setA, '#E74C3C'], [b, setB, '#3C8CE780'], [c, setC, 'transparent']].map(([v, set, d], i) => (
        <span key={i} className="flex items-center gap-2">
          <ColorPickerPopover color={v} onChange={set} defaultValue={d} size={size} />
          {v}
        </span>
      ))}
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [v, setV] = useState('#E74C3C')
  return <ColorPickerPopover color={v} onChange={setV} size="sm" />
}
