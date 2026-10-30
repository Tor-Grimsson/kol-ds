import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import { HubSettingsRail } from '@kolkrabbi/kol-shell'

export const stage = 'md'

/* the Hub's settings rail on its own — what AppHub's Settings row and kol-workshop's `,` open: Settings · Shortcuts ·
 * About · Docs, the theme toggle and reset in the footer */
const SHORTCUTS = [
  { section: 'Navigate', items: [{ id: 'settings', label: 'Settings', combo: ',' }, { id: 'sheet', label: 'Shortcuts', combo: 'S' }] },
]
const APP = {
  name: 'Shell',
  about: 'The reference for the Hub.',
  links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }],
  docs: [{ label: 'Settings', paragraphs: ['Rows are data: a switch, a choice, a text value.'] }],
}

export default function HubSettingsRailPreview() {
  const [open, setOpen] = useState(false)
  const [grid, setGrid] = useState(true)
  return (
    <>
      <Button tone="grey" size="sm" onClick={() => setOpen(true)}>Open settings</Button>
      <HubSettingsRail
        open={open}
        onClose={() => setOpen(false)}
        app={APP}
        shortcuts={SHORTCUTS}
        sections={[{ label: 'Display', rows: [{ id: 'grid', label: 'Show grid', type: 'switch', on: grid, onChange: setGrid }] }]}
      />
    </>
  )
}
