import { useState } from 'react'
import { MenuMore } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

export function Card() {
  return <MenuMore label="Graph settings" items={[]} />
}

export const tones = CONTROL_TONES
export const aligns = ALIGNS
/* `float` (float-everything W4 row 53): the More sheet — the ⋮ as a float circle, the rows on the sheet radius */
export const variants = ['default', 'float']

export default function MenuMorePreview({ tone, align = 'start', variant = 'default' }) {
  const [unit, setUnit] = useState('day')
  if (variant === 'float') {
    return (
      <div className={`flex min-h-[220px] w-full items-start justify-center ${toneWrap(tone)}`}>
        <MenuMore key={align} variant="float" label="More" align={align} defaultOpen stayOpen minWidth={230} items={[
          { key: 'library', label: 'Library', icon: 'nav-library', onClick: () => {} },
          { key: 'new', label: 'New file', icon: 'plus', kbd: '⌘N', onClick: () => {} },
          { key: 'signin', label: 'Sign in', icon: 'user', current: true, onClick: () => {} },
          { key: 'settings', label: 'Settings', icon: 'nav-settings', kbd: '⌘,', onClick: () => {} },
        ]} />
      </div>
    )
  }
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
