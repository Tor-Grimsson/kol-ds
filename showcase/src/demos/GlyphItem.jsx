import { useState } from 'react'
import { GlyphItem } from '@kolkrabbi/kol-foundry'

export default function GlyphItemDemo() {
  const [picked, setPicked] = useState('a')
  return (
    <div className="flex gap-2">
      {['A', 'a', 'g', '&'].map((g) => (
        <GlyphItem key={g} glyph={g} fontStyle="normal" isSelected={picked === g} onClick={() => setPicked(g)} />
      ))}
    </div>
  )
}
