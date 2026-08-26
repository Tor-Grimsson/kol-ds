import { useState } from 'react'
import { SegmentedToggle } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'feed', label: 'Feed' },
]

/* One instance per variant; size rides the toolbar picker (2026-08-09
 * consistency ruling — no inline size ramps in previews). */
export const sizes = ['sm', 'md', 'lg']

export default function SegmentedToggleDemo({ size = 'sm' }) {
  const [v, setV] = useState('grid')
  const [f, setF] = useState('grid')
  const [t, setT] = useState('grid')
  return (
    <>
      <SegmentedToggle value={v} onChange={setV} options={OPTIONS} size={size} />
      {/* filled — the segmented state law: surface tiles, ring on the SELECTED cell only */}
      <SegmentedToggle variant="filled" value={f} onChange={setF} options={OPTIONS} size={size} />
      {/* tonal — filled tiles, clicked cell marked by TONE (surface-tertiary, no ring) */}
      <SegmentedToggle variant="tonal" value={t} onChange={setT} options={OPTIONS} size={size} />
      {/* stateless — value omitted: a one-shot ACTION strip, nothing reads selected */}
      <SegmentedToggle
        variant="filled"
        onChange={(action) => console.log('align:', action)}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
        size={size}
        ariaLabel="Align"
      />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [v, setV] = useState('grid')
  return <SegmentedToggle value={v} onChange={setV} options={OPTIONS} size="md" />
}
