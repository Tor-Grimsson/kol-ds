import { useState } from 'react'
import { ColorSwatch, SwatchGrid } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export const variants = ['default', 'folio']

const COLORS = ['#282828', '#3c3836', '#504945', '#665c54', '#cc241d', '#d65d0e', '#d79921', '#98971a',
  '#689d6a', '#458588', '#b16286', '#a89984', '#fb4934', '#fabd2f', '#83a598', '#ebdbb2']

/* kolbox's swatches under "On this page" (plan-2026-11-18-kolbox-system W31.2 batch 4): 8 across, the current one ringed */
export default function SwatchGridPreview({ variant = 'default' }) {
  const [value, setValue] = useState('#d65d0e')
  /* folio (Folio batch C): Folio's Swatches, a row of its swatches 8 apart */
  if (variant === 'folio') return (
    <SwatchGrid variant="folio" aria-label="Swatches">
      {COLORS.slice(4, 10).map((c) => <ColorSwatch variant="folio" key={c} hex={c} aria-label={c} selected={c === value} onClick={() => setValue(c)} />)}
    </SwatchGrid>
  )
  return <SwatchGrid colors={COLORS} value={value} onChange={setValue} className="w-52" />
}
