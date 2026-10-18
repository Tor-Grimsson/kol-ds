import { useState } from 'react'
import { IconPlate, IconToggle, SegmentedToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* GALLERY — a wall of specimens with the controls that change how they are seen (the icons page): size,
 * guide; the plate is the size and the column follows it */
export const stage = 'full'
const NAMES = ['chevron-down', 'arrow-right', 'grid', 'search', 'settings-01', 'trash', 'play', 'pause', 'layers', 'code', 'image', 'folder']

export default function GalleryTemplate() {
  const [size, setSize] = useState(48)
  const [guide, setGuide] = useState(true)
  return (
    <div className="flex flex-col gap-6 w-full p-8">
      <div className="flex items-center justify-between border-b border-fg-08 pb-4">
        <span className="kol-helper-14 text-emphasis">ICONS</span>
        <span className="flex items-center gap-4">
          <SegmentedToggle ariaLabel="Size" size="sm" value={size} onChange={setSize} options={[24, 48, 96].map((v) => ({ value: v, label: String(v) }))} />
          <IconToggle icon="grid" label="Guide" pressed={guide} onChange={setGuide} />
        </span>
      </div>
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(size * 2, 103)}px, 1fr))` }}>
        {NAMES.map((n) => (
          <div key={n} className="flex flex-col items-start gap-3">
            <IconPlate size={size} guide={guide}><Icon name={n} size={size} /></IconPlate>
            <span className="kol-mono-14 text-emphasis">{n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
