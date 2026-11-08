import { useState } from 'react'
import { SettingsRamp, SettingsRampHead } from '@kolkrabbi/kol-component'

export const stage = 'md'

const CURVES = ['Linear', 'Ease', 'Hump', 'Wave'].map((l) => ({ value: l.toLowerCase(), label: l }))

/* the generator window's A→B row: value A, the curve, value B (his 12:2282 Shape ramps) */
export default function SettingsRampPreview() {
  const [w, setW] = useState({ a: 1, b: 6.8, curve: 'ease' })
  const [g, setG] = useState({ a: 2, b: 4, curve: 'linear' })
  return (
    <div className="w-[408px] max-w-full flex flex-col gap-1">
      <SettingsRampHead />
      <SettingsRamp label="Width" value={w} onChange={setW} curves={CURVES} />
      <SettingsRamp label="Gap" value={g} onChange={setG} curves={CURVES} />
    </div>
  )
}
