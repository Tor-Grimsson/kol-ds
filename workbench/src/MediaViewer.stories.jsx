import { useState } from 'react'
import { Button, MediaViewer } from '@kolkrabbi/kol-component'

const slide = (label, bg) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="${bg}"/><text x="400" y="265" font-family="monospace" font-size="48" fill="#e8e8ec" text-anchor="middle">${label}</text></svg>`,
  )}`

const MEDIA = [
  { url: slide('1 / 3', '#1d1d21'), alt: 'Slide one', kind: 'image' },
  { url: slide('2 / 3', '#26262c'), alt: 'Slide two', kind: 'image' },
  { url: slide('3 / 3', '#30303a'), alt: 'Slide three', kind: 'image' },
]

export const Default = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open viewer</Button>
      <MediaViewer open={open} media={MEDIA} onClose={() => setOpen(false)} />
    </>
  )
}
