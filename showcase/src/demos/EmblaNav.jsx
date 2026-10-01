import { useState } from 'react'
import { EmblaNav } from '@kolkrabbi/kol-component'

/* The carousel's prev/next pair, stepping a counter between 1 and 5 so both disabled ends show. */
export default function EmblaNavDemo() {
  const [i, setI] = useState(1)
  return (
    <div className="flex items-center gap-6">
      <span className="kol-mono-14 text-meta">{i} / 5</span>
      <EmblaNav placement="inline" onPrev={() => setI((n) => n - 1)} onNext={() => setI((n) => n + 1)} canPrev={i > 1} canNext={i < 5} />
    </div>
  )
}
