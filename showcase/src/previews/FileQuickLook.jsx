import { useState } from 'react'
import { Button, FileQuickLook } from '@kolkrabbi/kol-component'
import { LIBRARY_FILES } from 'voyager-fixture/library'

export const stage = 'md'

/* Quick Look over a list of files: VOYAGER's library originals — PDFs page by page, the poster's mark as an image —
 * paged ‹ ›, a download in the header */
export default function FileQuickLookPreview() {
  const [index, setIndex] = useState(null)
  return (
    <div className="flex flex-wrap gap-2">
      {LIBRARY_FILES.map((f, i) => <Button key={f.key} tone="grey" size="sm" onClick={() => setIndex(i)}>{f.name}</Button>)}
      <FileQuickLook files={LIBRARY_FILES} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </div>
  )
}
