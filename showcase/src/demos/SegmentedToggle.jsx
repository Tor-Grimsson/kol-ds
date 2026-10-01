import { useState } from 'react'
import { SegmentedToggle } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'feed', label: 'Feed' },
]

/* ONE instance; variant and size ride the toolbar pickers (2026-09-30 — the variants used to
 * stack). filled: surface tiles, ring on the SELECTED cell only · tonal: the clicked cell marked
 * by tone, no ring. The stateless action strip below is a different use, not a variant. */
export const variants = ['default', 'filled', 'tonal']
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function SegmentedToggleDemo({ variant = 'default', tone = 'default', size = 'sm' }) {
  const [v, setV] = useState('grid')
  return (
    <>
      <SegmentedToggle {...(variant === 'default' ? {} : { variant })} tone={tone} value={v} onChange={setV} options={OPTIONS} size={size} />
      {/* stateless — value omitted: a one-shot ACTION strip, nothing reads selected */}
      <SegmentedToggle
        variant="filled"
        tone={tone}
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
