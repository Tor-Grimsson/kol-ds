import { useState } from 'react'
import { ProgressDock } from '@kolkrabbi/kol-shell'

/* ‹ › · the page line · the share · the track (the gap map's row 81) */
export default function ProgressDockPreview() {
  const [page, setPage] = useState(125)
  return <ProgressDock page={page} pages={297} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(297, p + 1))} onSeek={setPage} />
}
