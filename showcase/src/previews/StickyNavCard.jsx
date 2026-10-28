import { useState } from 'react'
import { StickyNavCard } from '@kolkrabbi/kol-content'

export const stage = 'md'

const SECTIONS = [
  { heading: 'The measure', body: 'Line length decides more than the face.', bullets: ['45–75 characters', 'Set the column, not the font size'] },
  { heading: 'Leading', body: 'Air between lines is part of the line.', bullets: ['1.4–1.6 for body', 'Tighter for display'] },
  { heading: 'Contrast', body: 'Ink against ground, not grey against grey.', bullets: ['Body never under 64 %'] },
]

/* kolkrabbi.io's article scroll-spy card: the active one opens, the rest collapse to their heading */
export default function StickyNavCardPreview() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      {SECTIONS.map((s, i) => (
        <StickyNavCard key={s.heading} {...s} index={i} isActive={i === active} collapsed={i !== active} onClick={() => setActive(i)} />
      ))}
    </div>
  )
}
