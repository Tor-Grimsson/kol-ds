import { useState } from 'react'
import { LabeledControl, Slider, Input } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function LabeledControlDemo() {
  const [n, setN] = useState(8)
  const [hex, setHex] = useState('AD5038')
  return (
    <div className="grid grid-cols-2 gap-6 max-w-md">
      <LabeledControl label={`Columns · ${n}`}>
        <Slider min={1} max={32} value={n} onChange={setN} />
      </LabeledControl>
      <LabeledControl label="Hex" hint="6-char">
        <Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} uppercase chars={6} />
      </LabeledControl>
    </div>
  )
}
