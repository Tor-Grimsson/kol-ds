import { useState } from 'react'
import { FlipCard } from '@kolkrabbi/kol-hardware'
import { Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

const Face = ({ label }) => (
  <div className="flex h-32 items-center justify-center rounded-[4px] border border-oq-08 bg-surface-secondary kol-helper-12">{label}</div>
)

export default function FlipCardPreview() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <FlipCard flipped={flipped} width={240} front={<Face label="FRONT" />} back={<Face label="BACK" />} />
      <Button tone="grey" size="sm" onClick={() => setFlipped((f) => !f)}>Flip</Button>
    </div>
  )
}
