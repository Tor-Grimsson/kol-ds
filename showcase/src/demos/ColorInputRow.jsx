import { useState } from 'react'
import { ColorInputRow } from '@kolkrabbi/kol-component'

export const stage = 'md'

const PALETTE = [
  { id: 'primary', label: 'Primary', value: '#6C5CE7' },
  { id: 'secondary', label: 'Secondary', value: '#00B894' },
  { id: 'accent', label: 'Accent', value: '#E17055' },
  { id: 'info', label: 'Info', value: '#0984E3' },
  { id: 'warning', label: 'Warning', value: '#FDCB6E' },
  { id: 'dark', label: 'Dark', value: '#2D3436' },
]

export default function ColorInputRowDemo() {
  const [plain, setPlain] = useState('#6C5CE7')
  const [fill, setFill] = useState('#00B894')
  const [stroke, setStroke] = useState(null)
  const [token, setToken] = useState('#0984E3')

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Bare row: preview chip + hex input, commits on blur/Enter */}
      <ColorInputRow value={plain} onChange={setPlain} />

      {/* Labeled + palette-ref popover behind the swatch */}
      <ColorInputRow label="Fill" value={fill} onChange={setFill} paletteRefs={PALETTE} />

      {/* Null value → transparent "None" swatch, error tone */}
      <ColorInputRow label="Stroke" value={stroke} onChange={setStroke} transparentTone="error" />

      {/* Ghost input + trailing token name + remove button */}
      <ColorInputRow
        label="Token"
        value={token}
        onChange={setToken}
        inputVariant="ghost"
        trailing={<span className="kol-mono-12 text-fg-48">--kol-brand</span>}
        onRemove={() => setToken('#0984E3')}
      />
    </div>
  )
}
