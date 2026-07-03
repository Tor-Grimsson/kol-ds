import { useState } from 'react'
import { ColorInputRow } from '@kolkrabbi/kol-component'

const PALETTE = [
  { id: 'primary', label: 'Primary', value: '#6C5CE7' },
  { id: 'secondary', label: 'Secondary', value: '#00B894' },
  { id: 'accent', label: 'Accent', value: '#E17055' },
  { id: 'info', label: 'Info', value: '#0984E3' },
  { id: 'warning', label: 'Warning', value: '#FDCB6E' },
  { id: 'dark', label: 'Dark', value: '#2D3436' },
]

const Frame = ({ children }) => (
  <div style={{ width: 280 }} className="flex flex-col gap-4">
    {children}
  </div>
)

export const Default = () => {
  const [plain, setPlain] = useState('#6C5CE7')
  const [fill, setFill] = useState('#00B894')
  return (
    <Frame>
      <ColorInputRow value={plain} onChange={setPlain} />
      <ColorInputRow label="Fill" value={fill} onChange={setFill} />
    </Frame>
  )
}

export const WithPalette = () => {
  const [value, setValue] = useState('#6C5CE7')
  return (
    <Frame>
      <ColorInputRow label="Fill" value={value} onChange={setValue} paletteRefs={PALETTE} />
    </Frame>
  )
}

export const States = () => {
  const [stroke, setStroke] = useState(null)
  const [token, setToken] = useState('#0984E3')
  return (
    <Frame>
      <ColorInputRow label="Stroke" value={stroke} onChange={setStroke} transparentTone="error" />
      <ColorInputRow
        label="Token"
        value={token}
        onChange={setToken}
        inputVariant="ghost"
        trailing={<span className="kol-mono-12 text-fg-48">--kol-brand</span>}
        onRemove={() => setToken('#0984E3')}
      />
      <ColorInputRow label="Locked" value="#2D3436" onChange={() => {}} disabled />
    </Frame>
  )
}
