import { useState } from 'react'
import { IconPlate, IconToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* the plate at the four review sizes — the box is the size; guide and ground ride the toggles */
export const variants = ['light', 'dark']

export default function IconPlatePreview({ variant = 'light' }) {
  const [guide, setGuide] = useState(true)
  return (
    <div className="flex flex-col items-start gap-4">
      <IconToggle icon="grid" label="Guide" pressed={guide} onChange={setGuide} />
      <div className="flex items-end gap-4">
        {[16, 24, 48, 96].map((s) => (
          <IconPlate key={s} size={s} ground={variant} guide={guide}><Icon name="chevron-down" size={s} /></IconPlate>
        ))}
      </div>
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <IconPlate size={48} guide><Icon name="chevron-down" size={48} /></IconPlate>
}
