import { useState } from 'react'
import { LabeledControl, Slider, Input } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* `panel` is the hardware panel label (was kol-hardware `PanelLabel`): helper-8, uppercase,
 * hugging the control, in four positions. */
export const variants = ['default', 'panel']

export default function LabeledControlPreview({ variant = 'default' }) {
  const [n, setN] = useState(8)
  const [hex, setHex] = useState('AD5038')
  if (variant === 'panel') {
    const dot = <span className="block size-2 rounded-full bg-fg-64" />
    return (
      <div className="flex items-center gap-4">
        {['top', 'bottom', 'left', 'right'].map((pos) => (
          <LabeledControl key={pos} variant="panel" label={pos} labelPosition={pos} gap={4}>{dot}</LabeledControl>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-6 max-w-md">
      <LabeledControl label={`COLUMNS · ${n}`}>
        <Slider min={1} max={32} value={n} onChange={setN} />
      </LabeledControl>
      <LabeledControl label="HEX" hint="6-char">
        <Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} chars={6} />
      </LabeledControl>
    </div>
  )
}
