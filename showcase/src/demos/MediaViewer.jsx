import { useState } from 'react'
import { Button, MediaViewer } from '@kolkrabbi/kol-component'

export const stage = 'md'

const slide = (label, bg) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="${bg}"/><text x="400" y="265" font-family="monospace" font-size="48" fill="#e8e8ec" text-anchor="middle">${label}</text></svg>`,
  )}`

const MEDIA = [
  { url: slide('1 / 3', '#1d1d21'), alt: 'Slide one', kind: 'image' },
  { url: slide('2 / 3', '#26262c'), alt: 'Slide two', kind: 'image' },
  { url: slide('3 / 3', '#30303a'), alt: 'Slide three', kind: 'image' },
]

export default function MediaViewerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open viewer</Button>
      <p className="kol-mono-12 text-fg-48">Arrow keys page · Esc closes</p>
      <MediaViewer open={open} media={MEDIA} onClose={() => setOpen(false)} />
    </div>
  )
}
