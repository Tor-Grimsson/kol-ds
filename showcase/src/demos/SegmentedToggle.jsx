import { useState } from 'react'
import { SegmentedToggle } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'feed', label: 'Feed' },
]

/* One instance; size rides the toolbar picker (2026-08-09 consistency
 * ruling — no inline size ramps in previews). */
export const sizes = ['sm', 'md', 'lg']

export default function SegmentedToggleDemo({ size = 'sm' }) {
  const [v, setV] = useState('grid')
  return <SegmentedToggle value={v} onChange={setV} options={OPTIONS} size={size} />
}

/* Index card: one canonical instance. */
export function Card() {
  const [v, setV] = useState('grid')
  return <SegmentedToggle value={v} onChange={setV} options={OPTIONS} size="md" />
}
