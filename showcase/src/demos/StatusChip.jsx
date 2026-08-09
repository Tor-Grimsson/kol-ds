import { useState } from 'react'
import { StatusChip } from '@kolkrabbi/kol-component'

/* Tones ride the --ui-* ladder; the chip wears the active option's tone.
 * An option's tone always outranks the variant. */
const OPTIONS = [
  { value: 'Live', label: 'Live', tone: 'success' },
  { value: 'Draft', label: 'Draft', tone: 'warning' },
  { value: 'Failed', label: 'Failed', tone: 'error' },
  { value: 'Queued', label: 'Queued', tone: 'info' },
  { value: 'Archived', label: 'Archived' },
]

/* variant="primary" — the toneless pill wears the Dropdown-primary fill. */
const FOCUS = ['Top', 'Center', 'Bottom']

export default function StatusChipDemo() {
  const [status, setStatus] = useState('Live')
  const [focus, setFocus] = useState('Center')
  return (
    <div className="flex items-center gap-4">
      <StatusChip value={status} options={OPTIONS} onChange={setStatus} />
      <StatusChip value={focus} options={FOCUS} onChange={setFocus} variant="primary" />
    </div>
  )
}
