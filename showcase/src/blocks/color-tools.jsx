import { useState } from 'react'
import { TabsRow, ColorInputRow, ShapeDropdown } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Color tools',
  description: 'A paint toolbar — Fill / Stroke / Effects tabs over a hex + shape row',
  category: 'toolbar',
}
export const stage = 'md'

const TABS = [
  { id: 'fill', label: 'Fill' },
  { id: 'stroke', label: 'Stroke' },
  { id: 'effects', label: 'Effects' },
]

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: 'rectangle' },
  { id: 'circle', label: 'Circle', icon: 'circle' },
  { id: 'triangle', label: 'Triangle', icon: 'triangle' },
  { id: 'polygon', label: 'Polygon', icon: 'polygon' },
]

export default function ColorTools() {
  const [tab, setTab] = useState('fill')
  const [colors, setColors] = useState({ fill: '#AD5038', stroke: '#222D3D', effects: '#FFCF33' })
  const [shape, setShape] = useState('rectangle')

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-12 bg-surface-primary">
      <TabsRow tabs={TABS} value={tab} onChange={setTab} onMinimise={() => {}} />
      <div className="flex items-center gap-3 border-t border-fg-08 px-3 py-3">
        <ColorInputRow
          className="flex-1"
          value={colors[tab]}
          onChange={(hex) => setColors((c) => ({ ...c, [tab]: hex }))}
        />
        <ShapeDropdown options={SHAPES} value={shape} onChange={setShape} onAction={() => {}} />
      </div>
    </div>
  )
}
