import { useState } from 'react'
import { MenuFilter } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

export function Card() {
  return <MenuFilter groups={[]} />
}

const GROUPS = [
  { key: 'segment', label: 'Segment', icon: 'star', more: true, fields: [], disabled: 'No segments saved' },
  { divider: true },
  { key: 'page', label: 'Page', icon: 'file', more: true, fields: [{ key: 'path', label: 'Page' }] },
  { key: 'location', label: 'Location', icon: 'pushpin', more: true, fields: [{ key: 'country', label: 'Country' }, { key: 'city', label: 'City' }] },
  { key: 'screen', label: 'Screen size', icon: 'monitor', fields: [], disabled: 'Not available' },
  { key: 'goal', label: 'Goal', icon: 'check', fields: [{ key: 'event', label: 'Goal' }] },
]

export const tones = CONTROL_TONES
export const aligns = ALIGNS

export default function MenuFilterPreview({ tone, align = 'start' }) {
  const [active, setActive] = useState([{ key: 'browser', label: 'Browser is Chrome' }, { key: 'country', label: 'Country is Iceland' }])
  return (
    <div className={`flex min-h-[120px] w-full items-start justify-center pb-10 ${toneWrap(tone)}`}>
      <MenuFilter key={align} align={align} groups={GROUPS} onPick={() => {}} active={active}
        onRemove={(c) => setActive((a) => a.filter((x) => x.key !== c.key))} onClear={() => setActive([])} />
    </div>
  )
}
