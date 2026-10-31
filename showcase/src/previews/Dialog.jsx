import { useState } from 'react'
import { Button, Dialog } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function DialogPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog" width={420}>
        <div className="p-5 flex flex-col gap-4">
          <p className="kol-mono-12 text-emphasis">Any content, above the page, under its floats.</p>
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Dialog>
    </>
  )
}
