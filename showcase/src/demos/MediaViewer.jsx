import { useState } from 'react'
import { Button, MediaViewer } from '@kolkrabbi/kol-component'

export const stage = 'md'

const MEDIA = [
  { url: '/kol-images/tt-01.jpg', alt: 'Plate 01', kind: 'image', caption: 'Plate 01 — tt-01' },
  { url: '/kol-images/tt-02.jpg', alt: 'Plate 02', kind: 'image', caption: 'Plate 02 — tt-02' },
  { url: '/kol-images/tt-03.jpg', alt: 'Plate 03', kind: 'image', caption: 'Plate 03 — tt-03' },
  { url: '/kol-images/tt-04.jpg', alt: 'Plate 04', kind: 'image', caption: 'Plate 04 — tt-04' },
]

export default function MediaViewerDemo() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open viewer</Button>
      <p className="kol-mono-12 text-fg-48">
        Arrows / swipe page · Esc closes · at {index + 1} / {MEDIA.length}
      </p>
      <MediaViewer
        open={open}
        media={MEDIA}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
