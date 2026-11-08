import { useState } from 'react'
import { SettingsCell, SettingsRange } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* two handles on one track — the Ramp's From / To */
export default function SettingsRangePreview() {
  const [v, setV] = useState([0.2, 0.8])
  return (
    <div className="w-[198px] max-w-full">
      <SettingsCell label="From / To"><SettingsRange value={v} onChange={setV} min={0} max={1} format={(n) => n.toFixed(2)} aria-label="From / To" /></SettingsCell>
    </div>
  )
}
