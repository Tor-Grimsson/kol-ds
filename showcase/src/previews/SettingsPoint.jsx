import { useState } from 'react'
import { SettingsCell, SettingsPoint } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* an X / Y pair — the field's Centre */
export default function SettingsPointPreview() {
  const [v, setV] = useState([0.5, 0.5])
  return (
    <div className="w-[198px] max-w-full">
      <SettingsCell label="Centre"><SettingsPoint value={v} onChange={setV} min={-0.5} max={1.5} aria-label="Centre" /></SettingsCell>
    </div>
  )
}
