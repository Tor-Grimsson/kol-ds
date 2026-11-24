import { useState } from 'react'
import { LabeledControl, SettingsPoint } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* an X / Y pair — the field's Centre */
export default function SettingsPointPreview() {
  const [v, setV] = useState([0.5, 0.5])
  return (
    <div className="w-[198px] max-w-full">
      <LabeledControl variant="float" label="Centre"><SettingsPoint value={v} onChange={setV} min={-0.5} max={1.5} aria-label="Centre" /></LabeledControl>
    </div>
  )
}
