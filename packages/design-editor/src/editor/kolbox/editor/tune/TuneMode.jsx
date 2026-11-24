import { useEffect, useState } from 'react'
import { Button, LogoSystem, LogoTuner } from '@kolkrabbi/kol-component'
import { system, tuner } from '@kolkrabbi/kol-tuner'
import { contentOf, findLayerDeep, fitRings, makeContent, outlineBox, outlineSvg, ringsFromD, tuneRowOf, useComposeState } from '../engine.js'
import RightRail from '../../ui/RightRail.jsx'
import { endTune, getTune, setTune, startTune, togglePeek, useTune } from './store.js'
import { SYSTEM_START, SystemPanel, TUNER_START, TunerPanel, systemWrite } from './TunePanel.jsx'

/* THE TUNE MODE (plan-2026-11-19 C6.2, his ruling 27.5b: "the way I thought about it was 'glyphs' where you are working
   on one shape and you get speed punk heatmap and all these tools that analyse curvature"; "it has 2 modes, generate,
   where you control the shape number and interaction and modify where you supply svg or image file").
   Entered on one shape (Effects › Tune, or a Tune row's settings): the canvas shows only that shape on kol-component's
   boards (LogoSystem for Generate, LogoTuner for Modify: the construction, keylines, grid and curvature comb, the
   handles), the right rail the tool's settings: his canvas's own panels (./TunePanel.jsx, R9). Done writes what the
   stage shows to the layer's Tune row (design-editor compose/tune.js: the tuned form as geometry, the amount, the
   settings), one undo step; Cancel or Escape leaves with nothing written (R7.1). Nothing is written while inside.
   H switches the stage to the shape alone and back (R7.2, his board's key). */

const TABS = [{ value: 'generate', label: 'Generate' }, { value: 'modify', label: 'Modify' }]

/* the layer's own outline as the file the tuner reads (an SVG's text on `__svg`, read as vectors) */
const layerImage = (layer) => { const svg = outlineSvg(layer); return svg ? { __svg: svg, naturalWidth: layer.w, naturalHeight: layer.h } : null }
/* a dropped or picked file as apps/tuner reads it: the image, and an SVG's own text beside it */
function readFile(file, done) {
  if (!file || !/^image\//.test(file.type)) return
  const r = new FileReader()
  r.onload = () => {
    if (!/svg/.test(file.type)) return done({ kind: 'file', name: file.name, src: r.result, svg: null })
    const t = new FileReader()
    t.onload = () => done({ kind: 'file', name: file.name, src: r.result, svg: t.result })
    t.readAsText(file)
  }
  r.readAsDataURL(file)
}
/* a kept file source back into an image */
function imageOf(source, done) {
  const img = new Image()
  img.onload = () => { if (source.svg) img.__svg = source.svg; done(img) }
  img.src = source.src
}

/* enter the mode on `layer`, on its Tune row's values when it has one. W8: `more`, the other selected layers it can tune:
   the stage shows `layer`, and Done gives each of them its own Tune row with the same settings, fitted to its own box
   (Modify on the layer's outline reads each layer's own) */
export function openTune(layer, row, more = []) {
  const p = row?.params ?? {}
  const source = p.source?.kind === 'file' ? p.source : { kind: 'layer' }
  startTune({
    layerId: layer.id, rowKey: row?.key ?? null, dirty: false,
    tab: p.mode === 'modify' ? 'modify' : 'generate',
    amount: p.amount ?? 100, peek: false, reference: null,
    gen: { ...SYSTEM_START, ...(p.mode === 'generate' ? p.settings : null) },
    mod: { ...TUNER_START, ...(p.mode === 'modify' ? p.settings : null) },
    source, img: layerImage(layer), layerImg: layerImage(layer),
    also: more.map((l) => ({ layerId: l.id, rowKey: tuneRowOf(l)?.key ?? null })),
  })
  if (source.kind === 'file') imageOf(source, (img) => { const s = getTune(); if (s?.layerId === layer.id) startTune({ ...s, img }) })
}

/* the tuned form, as the row keeps it */
function rowParams(s, layer) {
  let rings, frame = null
  if (s.tab === 'generate') {
    const v = system(s.gen)
    rings = ringsFromD(v.d, { unite: true })
    frame = { x: -v.box / 2, y: -v.box / 2, w: v.box, h: v.box }
  } else rings = ringsFromD(tuner(s.mod, s.img).d)
  if (!rings.length) return null
  return {
    amount: s.amount, mode: s.tab, settings: s.tab === 'generate' ? s.gen : s.mod,
    ...(s.tab === 'modify' ? { source: s.source } : {}),
    rings: fitRings(rings, frame, outlineBox(layer), layer),
  }
}

/* Done writes what the stage shows as the layer's Tune row (a changed visit or not: Done is the ask), one undo step;
   Cancel and Escape leave with nothing written. A form that cannot be drawn keeps the mode open. */
function useLeave() {
  const { layers, updateLayer, beginTransaction, commitTransaction } = useComposeState()
  const write = (s, layer, rowKey) => {
    const params = rowParams(s, layer)
    if (!params) return false
    const content = contentOf(layer)
    const has = rowKey && content.some((c) => c.key === rowKey)
    updateLayer(layer.id, { content: has ? content.map((c) => (c.key === rowKey ? { ...c, params } : c)) : [...content, makeContent('tune', params)] })
    return true
  }
  const done = () => {
    const s = getTune()
    const layer = s && findLayerDeep(layers, s.layerId)
    if (!layer || !rowParams(s, layer)) return
    beginTransaction()
    write(s, layer, s.rowKey)
    for (const a of s.also ?? []) {
      const l = findLayerDeep(layers, a.layerId)
      if (l) write(s.tab === 'modify' && s.source.kind === 'layer' ? { ...s, img: layerImage(l) } : s, l, a.rowKey)
    }
    commitTransaction()
    endTune()
  }
  return { done, cancel: endTune }
}

/* the canvas inside the mode: the shape alone, on its board */
export function TuneStage() {
  const s = useTune()
  const { cancel } = useLeave()
  /* Escape cancels; H switches to the shape alone and back; the editor's own keys (Delete, the tools) stand down while
     the mode is up, except inside the rail */
  useEffect(() => {
    if (!s) return
    const onKey = (e) => {
      const t = e.target ?? {}
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName ?? '') || t.isContentEditable
      /* an open menu (a Dropdown's) and a field being typed in take their own Escape first */
      if (e.key === 'Escape' && !typing && !document.querySelector('[data-kolbox-overlay]')) { e.preventDefault(); e.stopPropagation(); return cancel() }
      if ((e.key === 'h' || e.key === 'H') && !e.repeat && !e.metaKey && !e.ctrlKey && !e.altKey && !typing) { e.preventDefault(); e.stopPropagation(); return togglePeek() }
      if (e.target?.closest?.('[data-tune-rail]')) return
      e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  })
  if (!s) return null
  const drag = (k, val) => setTune((t) => ({ gen: { ...t.gen, [k]: val, over: { ...(t.gen.over || {}), [k]: val } } }))
  const load = (f) => readFile(f, (source) => imageOf(source, (img) => setTune({ source, img })))
  /* the System's reference image (Show › upload): looked at, never written */
  const loadRef = (f) => readFile(f, (src) => imageOf(src, (img) => { const t = getTune(); if (t) startTune({ ...t, reference: { src: src.src, w: img.naturalWidth, h: img.naturalHeight } }) }))
  const pickRef = () => { const input = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*' }); input.onchange = () => loadRef(input.files[0]); input.click() }
  return (
    <div data-tune-stage data-peek={s.peek ? '' : undefined} data-theme="dark" className="absolute inset-0 z-[6] bg-canvas p-6">
      {s.tab === 'generate'
        ? <LogoSystem settings={s.gen} reference={s.reference} peek={s.peek} onDrag={drag} onDragReset={() => setTune((t) => ({ gen: { ...t.gen, over: null } }))} onFile={loadRef} />
        : <LogoTuner settings={s.mod} image={s.img} peek={s.peek} onFile={load} />}
      {s.tab === 'generate' && s.gen.upload && !s.peek && (
        <Button variant="kolbox" tone="primary" className="absolute right-10 bottom-10" onClick={pickRef}>Add a reference image</Button>
      )}
    </div>
  )
}

/* the right rail inside the mode: Cancel and Done, Generate (System) and Modify (Tuner), his panels */
export function TuneRail() {
  const s = useTune()
  const { done, cancel } = useLeave()
  const [advanced, setAdvanced] = useState(false)
  if (!s) return null
  const gen = (k, v) => setTune((t) => ({ gen: systemWrite(t.gen, k, v) }))
  const mod = (k, v) => setTune((t) => ({ mod: { ...t.mod, [k]: v } }))
  return (
    <RightRail title="Tune" tabs={TABS} tab={s.tab} onTab={(tab) => setTune({ tab })}
      actions={<><Button variant="kolbox" tone="ghost" onClick={cancel}>Cancel</Button><Button variant="kolbox" tone="primary" onClick={done}>Done</Button></>}>
      <div data-tune-rail>
        {s.tab === 'generate'
          ? <SystemPanel values={s.gen} onChange={gen} />
          : <TunerPanel values={s.mod} onChange={mod} advanced={advanced} onAdvanced={setAdvanced} />}
      </div>
    </RightRail>
  )
}
