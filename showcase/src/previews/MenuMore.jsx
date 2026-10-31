import { useState } from 'react'
import { MenuMore } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

export function Card() {
  return <MenuMore label="Graph settings" items={[]} />
}

export const tones = CONTROL_TONES
export const aligns = ALIGNS

export default function MenuMorePreview({ tone, align = 'start' }) {
  const [unit, setUnit] = useState('day')
  return (
    <div className={`flex min-h-[220px] w-full items-start justify-center ${toneWrap(tone)}`}>
      <MenuMore key={align} label="Graph settings" align={align} defaultOpen stayOpen items={[
        { heading: 'Graph interval' },
        ...[['hour', 'Hours'], ['day', 'Days'], ['week', 'Weeks']].map(([key, label]) => ({ key, label, current: key === unit, indicator: key === unit ? 'dot' : undefined, onClick: () => setUnit(key) })),
        { divider: true },
        { key: 'export', label: 'Export stats', trailing: 'download', onClick: () => {} },
      ]} />
    </div>
  )
}
