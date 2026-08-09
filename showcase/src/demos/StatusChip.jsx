import { useState } from 'react'
import { StatusChip } from '@kolkrabbi/kol-component'

/* Tones ride the --ui-* ladder; the chip wears the active option's tone. */
const OPTIONS = [
  { value: 'Live', label: 'Live', tone: 'success' },
  { value: 'Draft', label: 'Draft', tone: 'warning' },
  { value: 'Archived', label: 'Archived' },
]

export default function StatusChipDemo() {
  const [status, setStatus] = useState('Live')
  return <StatusChip value={status} options={OPTIONS} onChange={setStatus} />
}
