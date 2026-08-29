import { useState } from 'react'
import { SettingsMulti } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* one Dropdown of toggling entries — the trigger reads N of M, ✓ marks the on ones */
export default function SettingsMultiDemo() {
  const [on, setOn] = useState(['image', 'video'])
  const KINDS = ['audio', 'video', 'image', 'markdown', 'json', 'text'].map((k) => ({ value: k, label: k }))
  return <div className="w-64"><SettingsMulti options={KINDS} selected={on} onToggle={(k) => setOn((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))} /></div>
}
