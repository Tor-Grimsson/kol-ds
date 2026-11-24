import { useEffect, useState } from 'react'
import { ASPECTS, PRESET_SIZES, useComposeFile, useComposeState } from '../engine.js'
import { Button, ModalDialog, ToggleCheckbox } from '@kolkrabbi/kol-component'

/* Batch export, as the real BatchExportModal: the seven aspects with their sizes, @1x @2x @3x, the file count and
   Export all, which renders every pick through the engine's runBatchExport into one .zip. Seeded from the live frame
   on open; nothing closes it while it runs. */
const SCALES = [1, 2, 3]
const PRESETS = ASPECTS.filter((a) => a.id !== 'custom')

/* a pick: the box, its name and its size; the whole row toggles */
function Pick({ checked, onChange, label, hint, disabled }) {
  return (
    <div className={`flex min-w-0 items-center gap-1 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <ToggleCheckbox variant="kolbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="min-w-0 flex-1 cursor-pointer truncate text-label text-text" onClick={() => onChange(!checked)}>{label}</span>
      {hint && <span className="shrink-0 cursor-pointer font-mono text-meta text-muted" onClick={() => onChange(!checked)}>{hint}</span>}
    </div>
  )
}

export default function WindowBatchExport({ onClose }) {
  const { aspect } = useComposeState()
  const { runBatchExport } = useComposeFile()
  /* the real one seeds its scale from the footer's @Nx; kolbox has no footer, so @1x */
  const [aspects, setAspects] = useState(() => new Set([PRESET_SIZES[aspect] ? aspect : '1:1']))
  const [scales, setScales] = useState(() => new Set([1]))
  const [progress, setProgress] = useState(null)
  const running = progress != null
  useEffect(() => () => setProgress(null), [])

  const toggle = (setter, val) => setter((prev) => { const next = new Set(prev); next.has(val) ? next.delete(val) : next.add(val); return next })
  const jobs = []
  for (const a of PRESETS) if (aspects.has(a.id)) for (const s of SCALES) if (scales.has(s)) jobs.push({ aspectId: a.id, scale: s })

  const close = () => { if (!running) onClose() }
  const onExport = async () => {
    if (!jobs.length || running) return
    setProgress({ done: 0, total: jobs.length })
    try { await runBatchExport(jobs, (done, total) => setProgress({ done, total })) } finally { setProgress(null); onClose() }
  }

  return (
    <ModalDialog variant="kolbox"
      open
      onClose={close}
      title="Batch export"
      footer={(
        <>
          <span className="mr-auto font-mono text-meta whitespace-nowrap text-muted" data-batch-count>
            {running ? `Exporting ${progress.done}/${progress.total}…` : `${jobs.length} file${jobs.length === 1 ? '' : 's'}`}
          </span>
          <Button variant="kolbox" tone="primary" iconLeft="download" disabled={!jobs.length || running} onClick={onExport}>Export all</Button>
        </>
      )}
    >
      <div className="flex flex-col gap-4 px-4 pb-4" data-window="batch-export">
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted">Aspects</span>
          <div className="grid grid-cols-2 gap-x-4">
            {PRESETS.map((a) => (
              <Pick key={a.id} label={a.label} hint={`${PRESET_SIZES[a.id].w}×${PRESET_SIZES[a.id].h}`} checked={aspects.has(a.id)} disabled={running} onChange={() => toggle(setAspects, a.id)} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted">Scale</span>
          <div className="grid grid-cols-3 gap-x-4">
            {SCALES.map((s) => <Pick key={s} label={`@${s}x`} checked={scales.has(s)} disabled={running} onChange={() => toggle(setScales, s)} />)}
          </div>
        </div>
      </div>
    </ModalDialog>
  )
}
