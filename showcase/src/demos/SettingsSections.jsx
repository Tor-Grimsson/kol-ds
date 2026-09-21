import { useState } from 'react'
import { SettingsSections, SettingsSwitch, SettingsChoice } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The settings body as DATA — one declaration, and the same call renders it in
 * the page, the drawer over what you are looking at, and the shortcuts sheet.
 * A row's `render` returns the control, so the control stays yours; a row with
 * a plain `value` is the text-only case (a combo, a version), which is how the
 * shortcuts sheet is the same component (2026-09-03). */
export default function SettingsSectionsDemo() {
  const [s, setS] = useState({ aspect: '4:5', autoplay: false, clip: true })

  const sections = [
    {
      label: 'Canvas',
      rows: [
        { label: 'Default aspect', render: () => <SettingsChoice options={['1:1', '4:5', '16:9']} value={s.aspect} onChange={(v) => setS({ ...s, aspect: v })} /> },
        { label: 'Clip to frame', render: () => <SettingsSwitch label="Clip to frame" on={s.clip} onChange={(v) => setS({ ...s, clip: v })} /> },
      ],
    },
    {
      label: 'Playback',
      rows: [
        { label: 'Autoplay', render: () => <SettingsSwitch label="Autoplay" on={s.autoplay} onChange={(v) => setS({ ...s, autoplay: v })} /> },
      ],
    },
    {
      label: 'Shortcuts',
      rowGap: 1,
      rows: [
        { label: 'Undo', align: 'fill', labelWidth: 'auto', value: <span className="text-fg-32 kol-helper-12 whitespace-nowrap">⌘Z</span> },
        { label: 'Show / hide shortcuts', align: 'fill', labelWidth: 'auto', value: <span className="text-fg-32 kol-helper-12 whitespace-nowrap">S</span> },
      ],
    },
  ]

  return (
    <div className="w-80 rounded border border-fg-08 bg-surface-secondary p-4">
      <SettingsSections sections={sections} divided />
    </div>
  )
}
