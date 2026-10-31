import { useState } from 'react'
import { SettingsMulti } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

export const stage = 'sm'

/* one Dropdown of toggling entries — the trigger reads N of M, the check icon marks the on ones */
export const tones = CONTROL_TONES
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function SettingsMultiPreview({ tone, size = 'sm' }) {
  const [on, setOn] = useState(['image', 'video'])
  const KINDS = ['audio', 'video', 'image', 'markdown', 'json', 'text'].map((k) => ({ value: k, label: k }))
  return <div className={`w-64 ${toneWrap(tone)}`}><SettingsMulti size={size} options={KINDS} selected={on} onToggle={(k) => setOn((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))} /></div>
}
