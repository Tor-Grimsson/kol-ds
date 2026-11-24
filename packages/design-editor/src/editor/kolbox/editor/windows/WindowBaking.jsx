import { useEffect, useRef, useState } from 'react'
import { useComposeFile } from '../engine.js'
import { ModalDialog } from '@kolkrabbi/kol-component'

/* Baking loop… (round 3, 3.1): the real EditorFooter's bake overlay in kolbox's Modal. While the engine's
   onExportWebm bakes, "Baking loop…", the frames "done / total" and a bar filling in the accent; it closes when the
   bake ends. Not dismissible, as the real one (ruled 2026-08-27): no close, Escape and the dim do nothing, and the
   engine's bake has no cancel to call. */
export default function WindowBaking({ done = 0, total = 1 }) {
  return (
    <ModalDialog variant="kolbox" open title="Baking loop…" actions={<span className="pr-2 font-mono text-meta text-muted" data-bake-count>{done} / {total}</span>}>
      <div className="px-4 pb-4" data-window="baking">
        <div className="h-1.5 overflow-hidden rounded-control bg-field">
          <div className="h-full bg-accent transition-[width] duration-75 ease-linear" style={{ width: `${Math.round((done / Math.max(1, total)) * 100)}%` }} />
        </div>
      </div>
    </ModalDialog>
  )
}

/* `bakeLoop(scale)` runs the real exportWebm (EditorFooter's): progress from the engine's own onProgress, the window
   up from the first frame to the end, a second press ignored while one runs. The host lives with the screen's windows
   (editor/Windows.jsx), inside the engine's providers, so any row or button on the screen can call it. */
let host = null
export const bakeLoop = (scale = 1) => host?.(scale)

export function WindowBakingHost() {
  const { onExportWebm } = useComposeFile()
  const exportWebm = useRef(onExportWebm); exportWebm.current = onExportWebm
  const [progress, setProgress] = useState(null)
  useEffect(() => {
    let busy = false
    const run = async (scale) => {
      if (busy) return
      busy = true
      setProgress({ done: 0, total: 1 })
      try { await exportWebm.current(scale, (done, total) => setProgress({ done, total })) } finally { busy = false; setProgress(null) }
    }
    host = run
    return () => { if (host === run) host = null }
  }, [])
  return progress && <WindowBaking {...progress} />
}
