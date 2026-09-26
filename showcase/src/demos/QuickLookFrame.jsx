import { useState } from 'react'
import { QuickLookFrame, ActionButton, FileIcon } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* `nav` draws the pager only for a multi-selection (total > 1) — the window pages the selection. */
const FILES = [['notes.txt', 'txt', undefined, '0 B'], ['voice.wav', 'wav', 'music-note', '2.1 MB']]

export default function QuickLookFrameDemo() {
  const [i, setI] = useState(0)
  const [name, ext, glyph, meta] = FILES[i]
  const step = (d) => setI((n) => (n + d + FILES.length) % FILES.length)
  return (
    <QuickLookFrame title={name} meta={meta} onClose={() => {}}
      nav={{ index: i, total: FILES.length, onPrev: () => step(-1), onNext: () => step(1) }}
      actions={<ActionButton chrome="inline" size="sm" icon="download" label="Download" href="#" />}>
      <FileIcon ext={ext} glyph={glyph} className="w-[160px] m-16" />
    </QuickLookFrame>
  )
}
