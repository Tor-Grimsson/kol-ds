import { useState } from 'react'
import { QuickLookFrame, FileIcon, Button } from '@kolkrabbi/kol-component'

export const Single = () => (
  <QuickLookFrame title="notes.txt" meta="0 B" onClose={() => {}}>
    <FileIcon ext="txt" className="w-[160px] m-16" />
  </QuickLookFrame>
)

/* the pager appears only for a multi-selection */
export const Paged = () => {
  const [i, setI] = useState(0)
  return (
    <QuickLookFrame title={`file-${i + 1}.md`} meta="1.2 KB" onClose={() => {}}
      nav={{ index: i, total: 3, onPrev: () => setI((n) => (n + 2) % 3), onNext: () => setI((n) => (n + 1) % 3) }}>
      <FileIcon ext="md" className="w-[160px] m-16" />
    </QuickLookFrame>
  )
}

export const WithFooter = () => (
  <QuickLookFrame title="voice.wav" meta="2.1 MB · 0:42" onClose={() => {}}
    footer={<div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px' }}><Button variant="nav" size="sm" iconOnly="play" aria-label="Play" /></div>}>
    <FileIcon ext="wav" glyph="music-note" className="w-[160px] m-16" />
  </QuickLookFrame>
)

/* a size in px — what the corner grip reports while dragged */
export const Sized = () => (
  <QuickLookFrame title="notes.txt" size={{ w: 480, h: 320 }} onClose={() => {}}>
    <FileIcon ext="txt" className="w-[96px] m-8" />
  </QuickLookFrame>
)
