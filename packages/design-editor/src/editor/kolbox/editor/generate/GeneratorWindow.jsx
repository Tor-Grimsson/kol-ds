import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CANVAS_H, CANVAS_W, contentOf, CURVES, familyOf, findLayerDeep, proxied, familyStyles, getTool, openTool, paramsForFamily, rememberStyle, setTool, setUi, splitSection, stepId, ToolPreview, useGeneratorTool, useToolUi, visibleGroups } from '../engine.js'
import { valueOf } from '../../../generate/windows.js'
import { CommitInput } from '../../labs/Params.jsx'
import Icon from '../../ui/Icon.jsx'
import { pickMedia } from '../windows/WindowMediaPicker.jsx'
import WindowFrame from '../windows/WindowFrame.jsx'
import { mixedLabel } from './ContentScopeAll.jsx'
import { Button, ColorInputRow, ColorPickerPopover, Dropdown, LabeledControl, Slider, TabsRow, ToggleSwitch, Tooltip } from '@kolkrabbi/kol-component'

/* The generator window (round 3, 1.1): float's ModalSettings (packages/design-editor/src/editor/generate/ModalSettings.jsx,
   on kol-component's ModalDialog variant="settings") flipped to kolbox's kit, on Modal. The tool, its state, previews,
   Apply, Expand and Reset are the engine's own (generate/tool.jsx, generate/store.js); the sections and controls are
   generate/windows.js's definitions for the open tool (Generate, Repeat, the Paratype letter), so a control added there
   appears here. Header: the name and its kind, Expand, the style and the preset; left the SETTINGS list, one row per
   section with its state; middle the lit row's groups; right the preview, its field map and the style's line; footer Live
   preview and Reset, Cancel and Apply. */

const num = (s, fallback) => { const n = parseFloat(String(s).replace(',', '.')); return Number.isFinite(n) ? n : fallback }
/* a slider's number box: the definition's format, else the value at its step's decimals ("0.60", "4.0", "7") */
const fmt = (x) => x.format ?? ((v) => Number(v).toFixed(String(x.step ?? 1).split('.')[1]?.length ?? 0))

function Control({ x, t }) {
  const value = t.valueOf(x)
  const set = x.bind ? t.set(x) : () => {}
  const aria = x.name
  switch (x.type) {
    case 'slider': return <Slider variant="kolbox" readout="input" aria-label={aria} value={Number(value)} min={x.min} max={x.max} step={x.step} formatValue={fmt(x)} onChange={set} className="w-full" />
    /* two handles: kolbox has no two-handled slider, so its two ends are two number boxes (decided for review) */
    case 'range': return (
      <div className="grid w-full grid-cols-2 gap-2">
        <CommitInput aria-label={`${aria} from`} value={(x.format ?? String)(value[0])} onCommit={(s) => set([Math.min(num(s, value[0]), value[1]), value[1]])} />
        <CommitInput aria-label={`${aria} to`} value={(x.format ?? String)(value[1])} onCommit={(s) => set([value[0], Math.max(num(s, value[1]), value[0])])} />
      </div>
    )
    case 'segmented': return <TabsRow variant="kolbox" tabs={x.options} value={value} onChange={set} className="w-full" />
    case 'select': return <Dropdown variant="kolbox" ariaLabel={aria} value={value} options={x.options} onChange={set} className="w-full" />
    case 'toggle': return <ToggleSwitch variant="kolbox" aria-label={aria} checked={!!value} onChange={set} />
    case 'point': {
      const clamp = (n) => Math.min(x.max ?? Infinity, Math.max(x.min ?? -Infinity, n))
      return (
        <div className="grid w-full grid-cols-2 gap-2">
          <CommitInput lead="X" aria-label={`${aria} X`} value={String(value[0])} onCommit={(s) => set([clamp(num(s, value[0])), value[1]])} />
          <CommitInput lead="Y" aria-label={`${aria} Y`} value={String(value[1])} onCommit={(s) => set([value[0], clamp(num(s, value[1]))])} />
        </div>
      )
    }
    case 'text': return <CommitInput aria-label={aria} value={value ?? ''} onCommit={set} />
    case 'color': return <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={aria} value={value ?? ''} opacity={null} clearable={!x.def} onChange={set} />
    case 'lights': return <Lights value={value} onChange={set} />
    case 'picker': {
      const list = <Dropdown variant="kolbox" ariaLabel={aria} value={value ?? ''} options={[{ value: '', label: 'None' }, ...t.layersFor(x)]} onChange={set} className="w-full" />
      if (x.id !== 'photo-layer') return list
      /* W23.5: an image from Media (the library this app's media client lists) becomes a photo layer over the frame and
         the field; a file dropped on the window does the same (GeneratorWindow's onDrop) */
      const fromMedia = async () => { const pick = await pickMedia({ place: false, accept: ['image'] }); if (pick?.url) set(placePhoto(t, proxied(pick.url))) }
      return (
        <div className="flex w-full min-w-0 items-center gap-1">
          {list}
          <Tooltip variant="kolbox" label="From Media…"><Button variant="kolbox" iconOnly="image" aria-label="From Media" data-control="From Media" onClick={fromMedia} /></Tooltip>
        </div>
      )
    }
    case 'button': return <Button variant="kolbox" onClick={() => t.run(x.act)} className="w-full">{x.name}</Button>
    default: return null
  }
}

/* a photo layer over the whole frame, its id for the field's Photo layer (decided for review: the field samples the photo
   as placed, so it covers the frame; it is an ordinary layer the user can move or hide) */
function placePhoto(t, src) {
  return t.state.addLayer('photo', { src, srcType: 'image', x: 0, y: 0, w: CANVAS_W, h: CANVAS_H, fit: 'cover', name: 'Field image' })
}
const imageDrop = (t) => ({
  onDragOver: (e) => { if ([...(e.dataTransfer?.types ?? [])].includes('Files')) e.preventDefault() },
  onDrop: (e) => {
    const f = [...(e.dataTransfer?.files ?? [])].find((x) => x.type.startsWith('image/'))
    if (!f || t.id !== 'generate') return
    e.preventDefault()
    const r = new FileReader()
    r.onload = () => { const id = placePhoto(t, r.result); t.setParams((p) => ({ ...p, fKind: 'image', fImgLayer: id, genPreset: null })) }
    r.readAsDataURL(f)
  },
})

/* the Lights list: X, Y, Radius, Intensity per light, its remove, and "+ Add light" (kol-component's SettingsLights) */
const LIGHT_COLS = 'grid grid-cols-[repeat(4,minmax(0,1fr))_var(--spacing-control)] items-center gap-x-2'
function Lights({ value = [], onChange }) {
  const set = (i, k, n) => onChange(value.map((l, j) => (j === i ? { ...l, [k]: n } : l)))
  const cell = (i, k, v, label) => <CommitInput aria-label={`Light ${i + 1} ${label}`} value={String(v)} onCommit={(s) => set(i, k, num(s, v))} />
  return (
    <div className="flex flex-col gap-1">
      <div className={`${LIGHT_COLS} pb-0.5`} aria-hidden>
        {['X', 'Y', 'Radius', 'Intensity'].map((h) => <span key={h} className="text-help text-muted uppercase">{h}</span>)}
        <span />
      </div>
      {value.map((l, i) => (
        <div key={i} className={LIGHT_COLS}>
          {cell(i, 'x', l.x, 'X')}{cell(i, 'y', l.y, 'Y')}{cell(i, 'radius', l.radius, 'radius')}{cell(i, 'intensity', l.intensity, 'intensity')}
          <Button variant="kolbox" iconOnly="trash" aria-label={`Delete light ${i + 1}`} onClick={() => onChange(value.filter((_, j) => j !== i))}/>
        </div>
      ))}
      <Button variant="kolbox" tone="ghost" className="self-start" onClick={() => onChange([...value, { x: 0.5, y: 0.5, radius: 0.3, intensity: 1 }])}>+ Add light</Button>
    </div>
  )
}

/* a control's cell. One the engine has no param for (W21: Line Screen's Angle and Flare, Repeat's Align to path) is
   drawn dimmed, out of reach, its tooltip saying why */
const NO_PARAM = {
  'line-angle': 'Line Screen draws its lines level; no angle yet',
  flare: 'Line Screen draws each line one width along its run; no flare yet',
  'align-to-path': 'Copies keep their own turn; no align to path yet',
}
function Cell({ x, className = '', children }) {
  if (x.bind) return <div className={`min-w-0 ${className}`}>{children}</div>
  return (
    <div className={`min-w-0 ${className}`} data-no-param={x.name}>
      <Tooltip variant="kolbox" label={NO_PARAM[x.id] ?? 'The engine has no setting for this yet'}>
        <div inert className="w-full opacity-40">{children}</div>
      </Tooltip>
    </div>
  )
}

/* a control's name, and Mixed beside it where the layers it was opened on hold different values (W8) */
const labelOf = (x, t) => mixedLabel(x.name, !!t.mixed?.(x))

/* one cell of the two-across grid: the label above the control; a toggle's beside it; Lights takes the row */
function Row({ x, t }) {
  const control = <Control x={x} t={t} />
  return (
    <Cell x={x} className={x.type === 'lights' ? 'col-span-2' : ''}>
      <div data-control={x.name}>
        {x.type === 'lights' ? control
          : x.type === 'toggle' ? <LabeledControl variant="kolbox" horizontal labelWidth={160} label={labelOf(x, t)}>{control}</LabeledControl>
            : <LabeledControl variant="kolbox" label={labelOf(x, t)}>{control}</LabeledControl>}
      </div>
    </Cell>
  )
}

/* the A to B table: its head, then a row per ramp of value A, the curve and value B */
const RAMP_COLS = 'grid w-full grid-cols-[minmax(0,87fr)_minmax(0,122fr)_minmax(0,87fr)] items-center gap-x-2'
function Ramps({ ramps, t }) {
  return (
    <div className="flex flex-col gap-1">
      <LabeledControl variant="kolbox" horizontal label="">
        <div className={RAMP_COLS} aria-hidden>
          {['Value A', 'Curve', 'Value B'].map((h) => <span key={h} className="text-center text-help text-muted uppercase">{h}</span>)}
        </div>
      </LabeledControl>
      {ramps.map((x) => {
        const v = t.valueOf(x)
        const set = x.bind ? t.set(x) : () => {}
        const part = (k) => (n) => set({ ...v, [k]: n })
        return (
          <Cell key={x.id} x={x}>
            <div data-control={x.name}>
              <LabeledControl variant="kolbox" horizontal label={labelOf(x, t)}>
                <div className={RAMP_COLS}>
                  <CommitInput aria-label={`${x.name} value A`} value={String(v.a)} onCommit={(s) => part('a')(num(s, v.a))} />
                  <Dropdown variant="kolbox" ariaLabel={`${x.name} curve`} value={v.curve} options={x.curves ?? CURVES} onChange={part('curve')} className="w-full" />
                  <CommitInput aria-label={`${x.name} value B`} value={String(v.b)} onCommit={(s) => part('b')(num(s, v.b))} />
                </div>
              </LabeledControl>
            </div>
          </Cell>
        )
      })}
    </div>
  )
}

/* a group: the title with its note at the right, its rows two across, its ramps as one table after the grid; a hairline
   under every group but the last. A closed "more" group (More geometry, Segments, Second source) is no longer its own
   disclosure: it sits under the step's one Advanced row (W23.7) */
function Group({ g, t }) {
  const ramps = g.controls.filter((x) => x.type === 'ramp')
  const rest = g.controls.filter((x) => x.type !== 'ramp')
  const table = ramps.length > 0 && <Ramps ramps={ramps} t={t} />
  const grid = rest.length > 0 && <div className="grid grid-cols-2 gap-x-3 gap-y-2">{rest.map((x) => <Row key={x.id} x={x} t={t} />)}</div>
  return (
    <section className="mb-5 flex flex-col gap-4 border-b border-border pb-6 last:mb-0 last:border-b-0 last:pb-0" data-group={g.title ?? ''}>
      {(g.title || g.note) && (
        <header className="flex items-baseline justify-between gap-4">
          {g.title && <h3 className="text-section text-text">{g.title}</h3>}
          {g.note && <span className="text-help text-muted">{g.note}</span>}
        </header>
      )}
      {grid}{table && <div className={grid ? 'pt-3' : ''}>{table}</div>}
    </section>
  )
}

/* WORK IN THE PICTURE (W23.4): a press or drag in the preview sets the field's centre (Radial Array without its field:
   the array's centre); with Lights as the field each light is a handle, its middle moves it and its rim sets its radius.
   Read on the picture as drawn (the frame's aspect inside the square), in the field's 0 to 1 units, to two places. */
const CENTRE_KINDS = ['radial', 'ellipse', 'blob', 'diamond', 'conic', 'interfere']
const r2 = (n) => Math.round(n * 100) / 100
function useCanvasMap(t) {
  const field = t.sections.find((s) => s.key === 'field')
  const groups = field ? visibleGroups(field, t.params) : []
  const lightsCtl = groups.flatMap((g) => g.controls).find((x) => x.type === 'lights')
  const centreCtl = groups.flatMap((g) => g.controls).find((x) => x.id === 'centre')
  const radial = t.id === 'generate' && t.params.genStyle === 'radialArray' && !field
  return { lightsCtl, centreCtl, radial }
}
function PreviewPad({ t }) {
  const box = useRef(null)
  const { lightsCtl, centreCtl, radial } = useCanvasMap(t)
  const ratio = t.state.canvasRatio || 1
  const lights = lightsCtl ? t.valueOf(lightsCtl) : []
  const centre = centreCtl ? t.valueOf(centreCtl) : radial ? [t.params.cx ?? 0.5, t.params.cy ?? 0.5] : null
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return undefined
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  /* the drawn picture inside the square (the preview is drawn `meet`) */
  const img = (() => {
    const { w, h } = size
    const iw = ratio >= 1 ? w : h * ratio, ih = ratio >= 1 ? w / ratio : h
    return { x: (w - iw) / 2, y: (h - ih) / 2, w: iw, h: ih }
  })()
  const at = (e) => { const r = box.current.getBoundingClientRect(); return { px: e.clientX - r.left, py: e.clientY - r.top } }
  const uv = ({ px, py }) => [r2((px - img.x) / img.w), r2((py - img.y) / img.h)]
  const setCentre = (u, v) => {
    if (centreCtl) t.set(centreCtl)([u, v])
    else if (radial) t.setParams((p) => ({ ...p, cx: u, cy: v, genPreset: null }))
  }
  const down = (e) => {
    if (e.button !== 0 || (!centre && !lightsCtl) || !img.w) return
    const p0 = at(e)
    let drag = null
    lights.forEach((l, i) => {
      const lx = img.x + l.x * img.w, ly = img.y + l.y * img.h, rr = l.radius * img.h
      const d = Math.hypot(p0.px - lx, p0.py - ly)
      if (!drag && Math.abs(d - rr) <= 6 && rr > 12) drag = { i, kind: 'radius' }
      else if (!drag && d <= 10) drag = { i, kind: 'move', dx: l.x - (p0.px - img.x) / img.w, dy: l.y - (p0.py - img.y) / img.h }
    })
    if (!drag && !centre) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const apply = (pt) => {
      if (!drag) return setCentre(...uv(pt))
      const list = lights.map((l) => ({ ...l }))
      const l = list[drag.i]
      if (drag.kind === 'move') { l.x = r2((pt.px - img.x) / img.w + drag.dx); l.y = r2((pt.py - img.y) / img.h + drag.dy) }
      else l.radius = Math.max(0.02, r2(Math.hypot(pt.px - (img.x + l.x * img.w), pt.py - (img.y + l.y * img.h)) / img.h))
      t.set(lightsCtl)(list)
    }
    apply(p0)
    const el = e.currentTarget
    const move = (ev) => apply(at(ev))
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up) }
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
  }
  return (
    <div ref={box} onPointerDown={down} data-preview-pad
      className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-well bg-ground ${centre || lightsCtl ? 'cursor-crosshair' : ''}`}>
      <ToolPreview t={t} className="size-full" />
      {(centre || lights.length > 0) && img.w > 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {lightsCtl ? lights.map((l, i) => (
            <g key={i} data-light-handle={i}>
              <circle cx={img.x + l.x * img.w} cy={img.y + l.y * img.h} r={Math.max(4, l.radius * img.h)} fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={img.x + l.x * img.w} cy={img.y + l.y * img.h} r="4" fill="var(--color-accent)" />
            </g>
          )) : centre && (
            <g data-centre-handle>
              <circle cx={img.x + centre[0] * img.w} cy={img.y + centre[1] * img.h} r="5" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      )}
    </div>
  )
}

/* the right column: Preview with its Live mark, the square, its caption and size; the field map; the style's line */
function Aside({ t, caption, fieldMap, description }) {
  const { centreCtl } = useCanvasMap(t)
  /* the field map answers a click: the press along the strip sets the centre's X (W23.4) */
  const mapDown = (e) => {
    if (!centreCtl) return
    const r = e.currentTarget.getBoundingClientRect()
    const [, y] = t.valueOf(centreCtl)
    t.set(centreCtl)([r2((e.clientX - r.left) / r.width), y])
  }
  return (
    /* the engine's previews and field map paint with the KOL ink variables: here they read kolbox's */
    <div className="flex flex-col [--kol-fg-64:var(--color-muted)] [--kol-fg-96:var(--color-text)] [--kol-oq-16:var(--color-field)]" data-preview-column>
      <header className="flex items-baseline justify-between pb-4">
        <h3 className="text-section text-text">Preview</h3>
        <span className="text-help text-muted">{t.live ? '●  Live' : '○  Paused'}</span>
      </header>
      <PreviewPad t={t} />
      <div className="flex justify-between border-b border-border pt-3 pb-5">
        <span className="text-help text-muted">{caption}</span>
        <span className="font-mono text-meta text-muted">512 × 512 px</span>
      </div>
      {fieldMap && (
        <div className="flex flex-col pt-4" data-field-map>
          <span className="pb-2 text-help text-muted uppercase">Field map</span>
          <div className={`h-6.5 rounded-control bg-ground ${centreCtl ? 'cursor-crosshair' : ''}`} style={{ background: fieldMap.background }} role="img" aria-label={`Field map: ${fieldMap.left ?? ''}`} onPointerDown={mapDown} data-field-map-strip />
          <div className="flex justify-between gap-2 pt-2.5">
            <span className="text-label text-text">{fieldMap.left}</span>
            <span className="text-help text-muted">{fieldMap.right}</span>
          </div>
        </div>
      )}
      {description && <p className="pt-6 text-help text-muted" data-control="Description">{description}</p>}
      <p className="pt-2 text-help text-muted">Updates as you adjust settings.</p>
    </div>
  )
}

/* SIMPLE FIRST (W23.7): a step shows its few main controls; the rest fold under one Advanced row, closed by default, its
   state kept per step while the app is open */
const ADVANCED = new Map()

export default function GeneratorWindow({ id, onClose }) {
  const t = useGeneratorTool(id)
  const { win, params, sections } = t
  const [section, setSection] = useState(sections[0].key)
  const [, redraw] = useState(0)
  const current = sections.find((s) => s.key === section) ?? sections[0]
  const styleCtl = win.header.find((x) => x.id === 'style')
  const description = win.header.find((x) => x.id === 'description')
  const expandCtl = win.header.find((x) => x.id === 'expand')
  const fieldMap = win.fieldMap?.(params)
  const step = stepId(current, params)
  const { simple, advanced } = splitSection(current, params, step)
  const advOpen = !!ADVANCED.get(`${id}:${step}`)
  const advCount = advanced.reduce((n, g) => n + g.controls.length, 0)
  /* W23.0: the Generate window is its family's: the style list holds only the family's styles, and the family's name
     stands beside the style's in the title */
  const family = id === 'generate' ? familyOf(params) : null
  useEffect(() => { if (id === 'generate') rememberStyle(params) }, [id, params.genStyle]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Live preview: while on, an edit also lands on the layer the tool drew (the real Rail form's live update, which
     kolbox has no Rail for); off, the preview holds and only Apply writes. Cancel puts back what the window opened on,
     on the tool and on that layer (decided for review: float's dialog only closes). */
  const opened = useRef(getTool(id))
  const touched = useRef(false)
  /* W8: opened on several layers' rows (editContentAll), every row takes the window's settings, each its own copy, one
     undo step; a row already holding them is not written. A control the rows do not share reads Mixed. Repeat's source
     follows: a row repeating its own layer keeps repeating its own. */
  const also = (t.contentKey && opened.current?.also) || []
  const rowOf = (a) => contentOf(findLayerDeep(t.state.layers, a.layerId)).find((c) => c.key === a.contentKey)
  const tm = also.length ? { ...t, mixed: (x) => (also.some((a) => { const r = rowOf(a); return r && JSON.stringify(valueOf(x, r.params)) !== JSON.stringify(t.valueOf(x)) }) ? 'Mixed' : undefined) } : t
  const applyAll = () => {
    if (!also.length) return t.apply()
    const st = t.state
    st.beginTransaction()
    for (const a of [{ layerId: t.target?.id, contentKey: t.contentKey }, ...also]) {
      const row = rowOf(a)
      if (!row) continue
      const next = id === 'repeat' && params.sourceId === t.target?.id ? { ...params, sourceId: a.layerId } : params
      if (JSON.stringify(next) !== JSON.stringify(row.params)) st.updateContent(a.layerId, a.contentKey, next)
    }
    st.commitTransaction()
    return t.target?.id ?? null
  }
  const expandAll = () => {
    if (!also.length) return t.expand()
    applyAll()
    const ids = [t.target?.id, ...also.map((a) => a.layerId)].filter(Boolean)
    setTimeout(() => ids.forEach((lid) => (id === 'repeat' ? t.state.flattenRepeat(lid) : t.state.flattenGenerate(lid))), 0)
  }
  const seen = useRef(params)
  useEffect(() => {
    if (seen.current === params) return
    seen.current = params
    if (t.live && t.target) { applyAll(); touched.current = true }
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps
  const cancel = () => {
    const was = opened.current
    /* on a layer's effect row (W22) the row takes its params back, else the layer the tool drew */
    if (touched.current && was?.layerId && was.params) {
      t.state.beginTransaction()
      if (was.contentKey) t.state.updateContent(was.layerId, was.contentKey, was.params)
      else t.state.updateLayer(was.layerId, was.params)
      also.forEach((a) => t.state.updateContent(a.layerId, a.contentKey, a.params))
      t.state.commitTransaction()
    }
    if (was) setTool(id, { params: was.params, layerId: was.layerId, contentKey: was.contentKey ?? null, live: was.live })
    onClose()
  }

  const name = win.title(params)
  return (
    <WindowFrame
      movable="generator"
      dock={[family?.label, win.kind, name].filter(Boolean)}
      {...imageDrop(t)}
      onClose={cancel}
      title={name}
      kind={family?.label ?? win.kind}
      dataWindow="generator"
      tool={id}
      steps={sections}
      step={current.key}
      onStep={setSection}
      params={params}
      bodyKey={current.key}
      aside={<Aside t={t} caption={current.state?.(params) ?? ''} fieldMap={fieldMap} description={description && t.valueOf(description)} />}
      actions={(
        <div className="mr-1 flex items-center gap-3">
          {expandCtl && (
            <Tooltip variant="kolbox" label="Expand to editable paths">
              <Button variant="kolbox" tone="ghost" disabled={!t.canApply} data-control="Expand" onClick={() => { expandAll(); onClose() }}>Expand</Button>
            </Tooltip>
          )}
          {styleCtl && (
            <LabeledControl variant="kolbox" horizontal labelWidth="auto" label="Style">
              <Dropdown variant="kolbox" ariaLabel="Style" data-control="Style" value={t.valueOf(styleCtl)} options={familyStyles(params)} onChange={(v) => { t.set(styleCtl)(v); setSection('style') }} className="w-35" />
            </LabeledControl>
          )}
          {t.presets && (
            <LabeledControl variant="kolbox" horizontal labelWidth="auto" label="Preset">
              <Dropdown variant="kolbox" ariaLabel="Preset" data-control="Preset" value={params.genPreset ?? 'custom'} options={t.presets} onChange={t.setPreset} className="w-35" />
            </LabeledControl>
          )}
        </div>
      )}
      footer={(
        <>
          <LabeledControl variant="kolbox" horizontal label="Live preview"><ToggleSwitch variant="kolbox" aria-label="Live preview" checked={t.live} onChange={t.setLive} /></LabeledControl>
          <Button variant="kolbox" onClick={t.reset}>Reset</Button>
          <Button variant="kolbox" onClick={t.randomise} data-control="Randomise">Randomise</Button>
          <span className="flex-1" />
          <Button variant="kolbox" onClick={cancel}>Cancel</Button>
          <Tooltip variant="kolbox" label={t.canApply ? null : t.id === 'repeat' ? 'Select a layer to repeat' : 'Nothing to apply yet'}>
            <Button variant="kolbox" tone="primary" disabled={!t.canApply} onClick={() => { applyAll(); onClose() }}>Apply</Button>
          </Tooltip>
        </>
      )}
    >
      <div>{simple.map((g, i) => <Group key={`${current.key}-${i}`} g={g} t={tm} />)}</div>
      {advCount > 0 && (
        <section className={`flex flex-col gap-4 ${simple.length ? 'mt-5 border-t border-border pt-5' : ''}`} data-group="Advanced">
          <button type="button" aria-expanded={advOpen} data-control="Advanced" onClick={() => { ADVANCED.set(`${id}:${step}`, !advOpen); redraw((n) => n + 1) }}
            className="flex items-center gap-3 rounded-control text-left outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
            <Icon name="chevron-right" size={12} className={`text-muted transition-transform ${advOpen ? 'rotate-90' : ''}`} />
            <span className="text-section text-text">Advanced</span>
            <span className="ml-auto text-help text-muted">{advCount} more</span>
          </button>
          {advOpen && <div className="flex flex-col">{advanced.map((g, i) => <Group key={`${current.key}-adv-${i}`} g={g} t={tm} />)}</div>}
        </section>
      )}
    </WindowFrame>
  )
}

/* The host, mounted with the editor's windows: the window opens on the engine's own open state (generate/store.js), set
   by `kol:open-generator-window` ({ window, form }: float's Tools rows), by a double click on a generate or repeat layer
   (CanvasArea's editLayer) and by the Parameters tab's "Generate settings…". The real editor has two forms, the Rail
   and this window; kolbox has only the window, so either form opens it, the latest asked for winning (the Mask's
   "Letter…" opens the Paratype letter over Generate). Closing clears both. */
export function GeneratorWindowHost() {
  const { dialog, rail } = useToolUi()
  const [id, setId] = useState(null)
  const prev = useRef({ dialog, rail })
  useEffect(() => {
    /* W23.0b: `family` (screens, arrays, lineSwell) opens the Generate window on that family, on the style it last showed */
    const on = (e) => {
      const fam = e.detail?.family
      if (fam && familyOf(getTool('generate')?.params ?? {}).id !== fam) setTool('generate', { params: paramsForFamily(fam), layerId: null, contentKey: null })
      openTool(e.detail?.window ?? 'generate', e.detail?.form ?? 'rail')
    }
    window.addEventListener('kol:open-generator-window', on)
    return () => window.removeEventListener('kol:open-generator-window', on)
  }, [])
  useEffect(() => {
    const was = prev.current
    prev.current = { dialog, rail }
    if (dialog && dialog !== was.dialog) setId(dialog)
    else if (rail && rail !== was.rail) setId(rail)
    else if (!dialog && !rail) setId(null)
  }, [dialog, rail])
  return id ? <GeneratorWindow key={id} id={id} onClose={() => { setTool(id, { also: null }); setUi({ dialog: null, rail: null }); setId(null) }} /> : null
}

/* W8: open Generate or Repeat on the same effect's rows of several layers (`hits`: [{ l, r }], r the row): the window
   shows the first row and its Apply, Live preview, Cancel and Expand act on every row */
export function editContentAll(tool, hits) {
  const [a, ...rest] = hits
  if (!a) return
  setTool(tool, { params: a.r.params, layerId: a.l.id, contentKey: a.r.key, also: rest.map((h) => ({ layerId: h.l.id, contentKey: h.r.key, params: h.r.params })) })
  openTool(tool, 'rail')
}
