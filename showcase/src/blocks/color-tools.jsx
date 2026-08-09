import { useState } from 'react'
import { ColorInputRow, ShapeDropdown } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Color tools',
  description: 'A paint panel — fill / stroke / effects color rows over a shape scope',
  category: 'toolbar',
  type: 'reference',
  status: 'active',
  updated: '2026-08-09',
  tags: ['domain/design-system', 'pattern/blocks'],
}
export const stage = 'md'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: 'rectangle' },
  { id: 'circle', label: 'Circle', icon: 'circle' },
  { id: 'triangle', label: 'Triangle', icon: 'triangle' },
  { id: 'polygon', label: 'Polygon', icon: 'polygon' },
]

/* Color LEADS (user ruling 2026-08-09 — the tabbed form read as a Tabs demo,
 * not color tools): every paint property is a visible labeled color row; the
 * shape scope rides the footer. */
export default function ColorTools() {
  const [colors, setColors] = useState({ Fill: '#AD5038', Stroke: '#222D3D', Effects: '#FFCF33' })
  const [shape, setShape] = useState('rectangle')

  return (
    <div className="flex w-full flex-col gap-3 rounded border border-fg-12 bg-surface-primary p-3">
      {Object.keys(colors).map((prop) => (
        <ColorInputRow
          key={prop}
          label={prop}
          value={colors[prop]}
          onChange={(hex) => setColors((c) => ({ ...c, [prop]: hex }))}
        />
      ))}
      <div className="flex items-center justify-between border-t border-fg-08 pt-2">
        <span className="kol-helper-10 text-meta">SHAPE</span>
        <ShapeDropdown options={SHAPES} value={shape} onChange={setShape} onAction={() => {}} />
      </div>
    </div>
  )
}
