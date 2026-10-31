import { useState } from 'react'
import { ResizeHandle } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function ResizeHandlePreview() {
  const [h, setH] = useState(120)
  const [base, setBase] = useState(120)
  return (
    <div className="relative w-full max-w-sm bg-surface-secondary rounded" style={{ height: h }}>
      <ResizeHandle axis="y" onDrag={(dy) => setH(Math.max(60, base + dy))} onEnd={() => setBase(h)} />
    </div>
  )
}
