import { useEffect, useMemo, useState } from 'react'
import { useComposeState } from '../engine.js'
import WindowFrame from '../windows/WindowFrame.jsx'
import { FORMATS, moves, regionFile, regionsOf, regionSvg, regionVideos, safeName, SCALES, targetsOf, writeFiles } from './render.js'
import { Button, Dropdown, Input, LabeledControl, TabsRow, ToggleSwitch, Tooltip } from '@kolkrabbi/kol-component'

/* EXPORT (plan-2026-11-19-kolbox-whats-left C8, W30.2): ONE window on the shared frame (WindowFrame), opened by the top
   rail's Export and File › Export…. What is exported (the frame, the selection, every frame), the format (PNG, JPG, SVG,
   PDF, and a WebM video when something in it moves and the browser can encode one), the scale with the size it gives, the
   frame's fill on or off, the file's name, and a preview of the result: the very SVG the export writes, drawn small.
   Video (W11.1) is one loop per picture, the frame, the selection or every frame, several in one .zip; it paints the
   frame's fill and has no fill choice; its progress shows at the foot while it bakes. The settings are
   remembered while the app is open. Every control writes what it says; a choice that does not apply is not drawn. */
const last = { target: 'frame', format: 'png', scale: 1, fill: true, pages: 'all' }
const VIDEO_SCALES = [1, 2, 3]
const canVideo = () => typeof VideoEncoder !== 'undefined'

function Group({ title, children }) {
  return (
    <section className="mb-5 flex flex-col gap-4 border-b border-border pb-6 last:mb-0 last:border-b-0 last:pb-0" data-group={title}>
      <h3 className="text-section text-text">{title}</h3>
      {children}
    </section>
  )
}

export default function WindowExport({ onClose }) {
  const state = useComposeState()
  const { palette, aspect, layers, currentPresetName } = state
  const targets = targetsOf(state)
  const [target, setTarget] = useState(targets.some((t) => t.value === last.target) ? last.target : 'frame')
  /* every frame: this page's or every page's, asked only when the file has more than one page */
  const [pages, setPages] = useState(last.pages)
  const manyPages = (state.pages?.length ?? 1) > 1
  const scoped = (t) => (t === 'frames' && (!manyPages || pages === 'all') ? 'frames:all' : t)
  const regions = regionsOf(state, scoped(target))
  const video = canVideo() && regions.some((r) => moves(r.layers))
  const formats = FORMATS.filter((f) => f.value !== 'webm' || video)
  const [format, setFormat] = useState(formats.some((f) => f.value === last.format) ? last.format : 'png')
  const [scale, setScale] = useState(last.scale)
  const [fill, setFill] = useState(last.fill)
  const first = regions[0]
  const many = regions.length > 1
  const [name, setName] = useState(() => (many ? currentPresetName || 'Frames' : first?.name ?? 'Untitled'))
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(null)
  useEffect(() => { Object.assign(last, { target, format, scale, fill, pages }) }, [target, format, scale, fill, pages])
  /* a format the target no longer offers falls back to PNG; video scales are 1 to 3 */
  const fmt = formats.some((f) => f.value === format) ? format : 'png'
  const k = fmt === 'webm' ? (VIDEO_SCALES.includes(scale) ? scale : 1) : scale
  const scales = (fmt === 'webm' ? VIDEO_SCALES : SCALES).map((s) => ({ value: s, label: first ? `@${s}x / ${Math.round(first.w * s)} × ${Math.round(first.h * s)}` : `@${s}x` }))
  const fillShown = fmt !== 'webm' && regions.some((r) => r.framed)

  /* the preview: the first file's SVG, as it will be written */
  const [preview, setPreview] = useState(null)
  const key = useMemo(() => JSON.stringify([target, pages, fill, fmt, regions.length, first?.w, first?.h]), [target, pages, fill, fmt, regions.length, first?.w, first?.h])
  useEffect(() => {
    if (!first) { setPreview(null); return undefined }
    let url = null, alive = true
    regionSvg(first, { palette, aspect, fill: fmt === 'webm' || fill }).then((svg) => {
      if (!alive) return
      url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
      setPreview(url)
    }).catch(() => alive && setPreview(null))
    return () => { alive = false; if (url) URL.revokeObjectURL(url) }
  }, [key, layers]) // eslint-disable-line react-hooks/exhaustive-deps

  const ext = many ? 'zip' : fmt
  const run = async () => {
    if (!regions.length || busy) return
    setBusy(true)
    try {
      const names = regions.map((r, i) => (many ? `${safeName(name)} ${String(i + 1).padStart(2, '0')} ${r.name}` : name))
      const files = fmt === 'webm'
        ? await regionVideos(regions, { scale: k, palette, aspect, names, onProgress: (done, total) => setProgress({ done, total }) })
        : await Promise.all(regions.map((r, i) => regionFile(r, { format: fmt, scale: k, fill, palette, aspect, name: names[i] })))
      await writeFiles(files ?? [], name)
      onClose()
    } finally { setBusy(false); setProgress(null) }
  }
  const reset = () => { setTarget('frame'); setFormat('png'); setScale(1); setFill(true); setName(regionsOf(state, 'frame')[0]?.name ?? 'Untitled') }

  return (
    <WindowFrame
      movable="export"
      onClose={onClose}
      title="Export"
      kind={targets.find((t) => t.value === target)?.label}
      dataWindow="export"
      bodyKey="export"
      aside={(
        <div className="flex flex-col" data-preview-column>
          <header className="flex items-baseline justify-between pb-4">
            <h3 className="text-section text-text">Preview</h3>
            <span className="text-help text-muted">{many ? `1 of ${regions.length}` : fmt === 'webm' ? 'First frame' : '●  Live'}</span>
          </header>
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden kol-kolbox-checker rounded-well p-4" data-export-preview>
            {preview
              ? <img src={preview} alt={`Preview of ${first.name}`} className="max-h-full max-w-full object-contain" />
              : <span className="text-help text-muted">Nothing to export: draw a frame or add a layer first.</span>}
          </div>
          <div className="flex justify-between border-b border-border pt-3 pb-5">
            <span className="text-help text-muted">{regions.length === 1 ? '1 file' : `${regions.length} files in one .zip`}</span>
            {first && <span className="font-mono text-meta text-muted" data-export-size>{fmt === 'svg' ? `${first.w} × ${first.h}` : `${Math.round(first.w * k)} × ${Math.round(first.h * k)}`} px</span>}
          </div>
          <p className="pt-6 text-help text-muted">{fmt === 'svg' ? 'Vector: text as outlines, photos written into the file.' : fmt === 'webm' ? 'One loop of the timeline, rendered frame by frame.' : fmt === 'pdf' ? 'One page the frame\'s size, its picture at the scale you pick.' : 'Pixels at the scale you pick.'}</p>
        </div>
      )}
      footer={(
        <>
          <Button variant="kolbox" onClick={reset}>Reset</Button>
          <span className="flex-1 text-help text-muted" data-export-progress>{progress && `Baking ${progress.done} / ${progress.total}`}</span>
          <Button variant="kolbox" onClick={onClose}>Cancel</Button>
          <Tooltip variant="kolbox" label={regions.length ? null : 'Nothing to export: draw a frame or add a layer first.'}>
            <Button variant="kolbox" tone="primary" iconLeft="download" disabled={!regions.length || busy} onClick={run}>Export</Button>
          </Tooltip>
        </>
      )}
    >
      <Group title="What">
        <LabeledControl variant="kolbox" label="Content">
          <Dropdown variant="kolbox" ariaLabel="Content" data-control="Content" options={targets} value={target} onChange={(v) => { setTarget(v); const r = regionsOf(state, scoped(v)); setName(r.length > 1 ? currentPresetName || 'Frames' : r[0]?.name ?? 'Untitled') }} className="w-full" />
        </LabeledControl>
        {target === 'frames' && manyPages && (
          <LabeledControl variant="kolbox" label="Pages">
            <TabsRow variant="kolbox" tabs={[{ value: 'page', label: 'This page' }, { value: 'all', label: 'All pages' }]} value={pages} onChange={setPages} className="w-full" data-control="Pages" />
          </LabeledControl>
        )}
        <LabeledControl variant="kolbox" label="Name">
          <div className="flex w-full items-center gap-2">
            <Input variant="kolbox" aria-label="File name" data-control="Name" value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1" />
            <span className="shrink-0 font-mono text-meta text-muted">.{ext}</span>
          </div>
        </LabeledControl>
      </Group>
      <Group title="Format">
        <TabsRow variant="kolbox" tabs={formats.map((f) => ({ value: f.value, label: f.value === 'webm' ? 'Video' : f.label }))} value={fmt} onChange={setFormat} className="w-full" data-control="Format" />
        {fmt !== 'svg' && (
          <LabeledControl variant="kolbox" label="Scale">
            <Dropdown variant="kolbox" ariaLabel="Scale" data-control="Scale" options={scales} value={k} onChange={(v) => setScale(Number(v))} className="w-full" />
          </LabeledControl>
        )}
        {fillShown && (
          <LabeledControl variant="kolbox" horizontal labelWidth={160} label="Frame fill">
            <ToggleSwitch variant="kolbox" aria-label="Frame fill" checked={fill} onChange={setFill} />
          </LabeledControl>
        )}
      </Group>
    </WindowFrame>
  )
}
