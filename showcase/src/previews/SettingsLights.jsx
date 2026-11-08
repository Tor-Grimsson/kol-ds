import { useState } from 'react'
import { SettingsLights } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* the field's points of light — position, radius, intensity, delete; Add light under them */
export default function SettingsLightsPreview() {
  const [v, setV] = useState([{ x: 0.35, y: 0.4, radius: 0.3, intensity: 1 }, { x: 0.7, y: 0.6, radius: 0.2, intensity: 0.6 }])
  return <div className="w-[408px] max-w-full"><SettingsLights value={v} onChange={setV} /></div>
}
