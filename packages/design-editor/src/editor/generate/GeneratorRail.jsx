import { useEffect, useRef, useState } from 'react'
import { Button, Dropdown, Input, Slider, TabsRow, ToggleSwitch } from '@kolkrabbi/kol-component'
import { PropertyRail } from '@kolkrabbi/kol-shell'
import { makeField } from '../../generate/field.js'
import { copyMatrices } from '../../generate/repeat.js'
import { findLayerDeep } from '../compose/helpers'
import { CURVES } from './windows'
import { useGeneratorTool, RepeatPreview, TypePreview } from './tool'
import { openTool } from './store'

/**
 * GeneratorRail — the Rail form of the generator tools (plan-2026-11-05-float-editor W7.6; his frames 32:16215 — Generate,
 * Repeat, Paratype Letter): kol-shell's PropertyRail (the float layout's Rail), a label column with the controls on the
 * right, collapsible sections and a foot, drawn in the float look — float fields, the float slider with its run in the
 * KOL ink accent, Inter + JetBrains Mono. Its content and order are his frames'; its controls the tool's (`./windows.js`)
 * on the one state the settings dialog also reads, so the header's ↗ expands to the dialog and nothing is lost.
 *
 * Live: once the tool has drawn its layer, every edit lands on it (fxr's windows are live and undoable). Generate draws it
 * with the foot's Generate; Repeat as soon as it has a source; Paratype on the first edit.
 */

const W = 384
/* his frame's group heads where they name more than the dialog's group title */
const SUBHEADS = { Lights: 'Lights / Point editor', Image: 'Image / Layer source' }
/* the KOL ink accent on the slider's run, the toggles and the foot's action (his frames' lavender is the call left to him) */
const ACCENT = '[--kol-slider-float-run:var(--kol-accent-primary)]'
const field = 'h-7 !rounded-md'

/* a number box beside a slider: the formatted value, typed numbers commit on Enter / blur */
function NumberBox({ x, value, set, disabled }) {
  const [draft, setDraft] = useState(null)
  const shown = draft ?? (x.format ? x.format(value) : String(value))
  const commit = () => { const n = parseFloat(String(draft).replace(',', '.')); if (draft != null && Number.isFinite(n)) set(Math.max(x.min, Math.min(x.max, n))); setDraft(null) }
  return (
    <Input variant="float" size="sm" value={shown} disabled={disabled} aria-label={`${x.name} value`} className={`w-[66px] shrink-0 !px-2 [&_input]:text-[11px] ${field}`}
      onFocus={() => setDraft(String(value))} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} />
  )
}

const dd = (options, value, onChange, aria, disabled) => (
  <Dropdown variant="float" size="sm" options={options} value={value} onChange={onChange} ariaLabel={aria} disabled={disabled}
    className="w-full [&_.kol-dd-trigger]:w-full [&_.kol-dd-trigger]:!h-7 [&_.kol-dd-trigger]:justify-between [&_.kol-dd-trigger]:!text-[11px] [&_.kol-dd-trigger]:!font-normal" />
)

/* one control in the float look */
function RailControl({ x, t }) {
  const value = t.valueOf(x)
  const set = x.bind ? t.set(x) : () => {}
  const disabled = !t.isLive(x)
  switch (x.type) {
    case 'slider': return (
      <>
        <Slider variant="float" readout="none" value={Number(value)} onChange={set} min={x.min} max={x.max} step={x.step} disabled={disabled} aria-label={x.name} className="flex-1 min-w-0" />
        <NumberBox x={x} value={value} set={set} disabled={disabled} />
      </>
    )
    case 'range': return (
      <>
        <Slider variant="dual" value={value[0]} value2={value[1]} min={x.min} max={x.max} step={x.step} aria-label={x.name} disabled={disabled} label1="" label2=""
          onChange={(v) => set([Math.min(v, value[1]), value[1]])} onChange2={(v) => set([value[0], Math.max(v, value[0])])} className="flex-1 min-w-0" />
        <span className="kol-float-timecode text-fg-emphasis w-[66px] shrink-0 text-right text-[11px]">{(x.format ?? String)(value[0])}–{(x.format ?? String)(value[1])}</span>
      </>
    )
    case 'point': return ['X', 'Y'].map((ax, i) => (
      <Input key={ax} variant="float" size="sm" prefix={ax} disabled={disabled} aria-label={`${x.name} ${ax}`} className={`flex-1 min-w-0 ${field}`}
        value={Number(value[i]).toFixed(Math.abs(x.max) > 10 ? 0 : 2)}
        onChange={(e) => { const n = parseFloat(e.target.value); if (Number.isFinite(n)) set(i ? [value[0], n] : [n, value[1]]) }} />
    ))
    case 'select': return dd(x.options, value, set, x.name, disabled)
    case 'segmented': return <TabsRow variant="float" size="xs" tabs={x.options} value={value} onChange={set} ariaLabel={x.name} className="w-full [&>*]:flex-1" />
    case 'toggle': return <span className="flex-1 flex justify-end"><ToggleSwitch variant="float" checked={!!value} onChange={set} disabled={disabled} aria-label={x.name} /></span>
    case 'text':
    case 'color': return <Input variant="float" size="sm" value={value ?? ''} disabled={disabled} aria-label={x.name} className={`w-full ${field}`} onChange={(e) => set(e.target.value)} />
    case 'picker': return dd([{ value: '', label: x.kinds?.includes('photo') ? 'Choose photo layer…' : 'None' }, ...t.layersFor(x)], value ?? '', set, x.name, disabled)
    case 'button': return <Button variant="float" tone="secondary" size="sm" disabled={disabled} onClick={() => t.run(x.act)} className="w-full">{x.name}</Button>
    case 'ramp': return (
      <>
        <Input variant="float" size="sm" aria-label={`${x.name} A`} className={`flex-1 min-w-0 ${field}`} disabled={disabled} value={String(+Number(value.a).toFixed(3))}
          onChange={(e) => { const n = parseFloat(e.target.value); if (Number.isFinite(n)) set({ ...value, a: n }) }} />
        <div className="w-[92px] shrink-0">{dd(x.curves ?? CURVES, value.curve, (c) => set({ ...value, curve: c }), `${x.name} curve`, disabled)}</div>
        <Input variant="float" size="sm" aria-label={`${x.name} B`} className={`flex-1 min-w-0 ${field}`} disabled={disabled} value={String(+Number(value.b).toFixed(3))}
          onChange={(e) => { const n = parseFloat(e.target.value); if (Number.isFinite(n)) set({ ...value, b: n }) }} />
      </>
    )
    default: return null
  }
}

/* his LIGHTS / POINT EDITOR: a row per light — handle, X / Y, radius, intensity slider + value, × — and + Add point */
function Lights({ x, t }) {
  const list = t.valueOf(x)
  const set = t.set(x)
  const edit = (i, k, v) => set(list.map((l, j) => (j === i ? { ...l, [k]: v } : l)))
  const num = (i, k, ax) => (
    <Input variant="float" size="sm" prefix={ax} aria-label={`Light ${i + 1} ${ax ?? k}`} className={`${ax ? 'w-[64px]' : 'w-[48px]'} shrink-0 !px-2 !gap-1 ${field}`} value={Number(list[i][k]).toFixed(2)}
      onChange={(e) => { const n = parseFloat(e.target.value); if (Number.isFinite(n)) edit(i, k, n) }} />
  )
  return (
    <div className="flex flex-col gap-2" data-control="Lights">
      <div className="flex items-center gap-1.5 pl-[18px] kol-float-label text-oq-64"><span className="w-[134px]">Position</span><span className="w-[54px]">Radius</span><span>Intensity</span></div>
      {list.map((l, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-3 text-oq-48 select-none" aria-hidden>⠿</span>
          {num(i, 'x', 'X')}{num(i, 'y', 'Y')}{num(i, 'radius')}
          <Slider variant="float" readout="none" value={l.intensity} min={0} max={2} step={0.01} onChange={(v) => edit(i, 'intensity', v)} aria-label={`Light ${i + 1} intensity`} className="flex-1 min-w-0" />
          <span className="kol-float-timecode text-fg-emphasis text-[11px] w-7 text-right">{l.intensity.toFixed(1)}</span>
          <Button variant="float" tone="ghost" size="sm" iconOnly="close" aria-label={`Remove light ${i + 1}`} disabled={list.length < 2} onClick={() => set(list.filter((_, j) => j !== i))} />
        </div>
      ))}
      <Button variant="float" tone="ghost" size="sm" iconLeft="plus" disabled={list.length >= 8} className="self-start"
        onClick={() => set([...list, { x: 0.5, y: 0.5, radius: 0.3, intensity: 1 }])}>Add point</Button>
    </div>
  )
}

/* the photo source: the picked photo's thumb beside the picker */
function PhotoSource({ x, t }) {
  const id = t.valueOf(x)
  const photo = id ? findLayerDeep(t.state.layers ?? [], id) : null
  return (
    <div className="flex items-center gap-2" data-control={x.name}>
      <span className="size-[38px] shrink-0 rounded-md bg-(--kol-float-well) bg-cover bg-center" style={photo?.src ? { backgroundImage: `url(${photo.src})` } : undefined} />
      <div className="flex-1 min-w-0"><RailControl x={x} t={t} /></div>
    </div>
  )
}

/* his FIELD MAP: the field itself, sampled live across the strip */
function FieldMap({ t }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c || !t.live) return
    const w = c.width, h = c.height, g = c.getContext('2d'), img = g.createImageData(w, h)
    let f
    try { f = makeField(t.params, w / h) } catch { return }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const v = Math.round(255 * Math.max(0, Math.min(1, f(x / w, y / h)))), i = (y * w + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255
    }
    g.putImageData(img, 0, 0)
  }, [t.params, t.live])
  return <canvas ref={ref} width={176} height={22} className="w-full h-11 rounded-md" data-field-map />
}

/* a control row: the label column and the control, or the whole row for a list / a pair of number boxes stacked */
const row = (x, t) => {
  if (x.type === 'lights') return { id: x.id, render: () => <Lights key={x.id} x={x} t={t} /> }
  if (x.type === 'button') return { id: x.id, render: () => <div key={x.id} data-control={x.name}><RailControl x={x} t={t} /></div> }
  if (x.type === 'picker' && x.kinds?.includes('photo')) return { id: x.id, render: () => <PhotoSource key={x.id} x={x} t={t} /> }
  return { type: 'labeled', id: x.id, label: x.name, render: () => <RailControl x={x} t={t} /> }
}
/* his pairs: "Radius X" + "Radius Y" sliders become one Radius row of X / Y boxes */
function rowsOf(controls, t) {
  const out = []
  for (let i = 0; i < controls.length; i++) {
    const a = controls[i], b = controls[i + 1]
    const m = a.name.match(/^(.*) X$/)
    if (m && b?.name === `${m[1]} Y` && a.type === 'slider' && b.type === 'slider') {
      out.push({ type: 'labeled', id: a.id, label: m[1], render: () => [a, b].map((x, j) => (
        <Input key={x.id} variant="float" size="sm" prefix={j ? 'Y' : 'X'} aria-label={x.name} className={`flex-1 min-w-0 ${field}`} value={Number(t.valueOf(x)).toFixed(2)}
          onChange={(e) => { const n = parseFloat(e.target.value); if (Number.isFinite(n)) t.set(x)(n) }} />
      )) })
      i++
    } else out.push(row(a, t))
  }
  return out
}

export default function GeneratorRail({ id, onClose, className = '' }) {
  const t = useGeneratorTool(id)
  const { win, params } = t
  const [open, setOpen] = useState({})
  const isOpen = (key, def = true) => open[key] ?? def
  const toggle = (key) => (v) => setOpen((o) => ({ ...o, [key]: v }))

  /* live: an edit lands on the tool's layer (Repeat: as soon as it has a source; Paratype: on the first edit) */
  /* the params it opened on are not an edit (a ref, not a first-run flag — StrictMode runs effects twice) */
  const seen = useRef(params)
  useEffect(() => {
    if (seen.current === params) return
    seen.current = params
    if (t.target || (id === 'repeat' && params.sourceId) || id === 'type') t.apply()
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const sec = (s, { key = s.key, label = s.label, meta, def = true, extra = [] } = {}) => ({
    id: key, label, collapsible: true, open: isOpen(key, def), onToggle: toggle(key), meta,
    rows: [...s.groups.flatMap((g, gi) => [
      ...(gi > 0 && g.title ? [{ type: 'subhead', id: `${key}-${gi}`, label: (SUBHEADS[g.title] ?? g.title).toUpperCase() }] : []),
      ...(g.kind === 'ramps' ? [{ type: 'labeled', id: `${key}-rampcols`, label: '', render: () => <div className="flex w-full kol-float-label text-oq-64"><span className="flex-1">Value A</span><span className="w-[92px]">Curve</span><span className="flex-1 pl-1.5">Value B</span></div> }] : []),
      ...rowsOf(g.controls, t),
    ]), ...extra],
  })

  let sections, footer
  const live = (
    <span className="flex items-center gap-2 kol-float-label text-oq-64">
      <ToggleSwitch variant="float" checked={t.live} onChange={t.setLive} aria-label="Live update" />Live update
    </span>
  )
  if (id === 'generate') {
    const all = t.sections
    const by = (k) => all.find((s) => s.key === k)
    const head = win.header.filter((x) => x.id !== 'expand')
    const style = by('style')
    sections = [
      { id: 'head', rows: head.map((x) => (x.id === 'preset'
        ? { type: 'labeled', id: 'preset', label: 'Preset', render: () => dd(t.presets, params.genPreset ?? 'custom', t.setPreset, 'Preset') }
        : x.id === 'description' ? { type: 'labeled', id: 'description', label: x.name, render: () => <span className="kol-float-hint text-fg-emphasis truncate" title={t.valueOf(x)}>{t.valueOf(x)}</span> }
          : row(x, t))) },
      sec(by('field'), { meta: '01 / SOURCE', extra: [
        { type: 'subhead', id: 'field-map', label: 'FIELD MAP', meta: t.live ? 'LIVE' : 'PAUSED' },
        { id: 'field-map-strip', render: () => <FieldMap t={t} /> },
      ] }),
      sec(by('ramp')),
      sec(style, { meta: style.state?.(params)?.toUpperCase() }),
      sec(by('mask'), { meta: by('mask').state(params).toUpperCase() }),
      sec(by('warp'), { def: false, meta: by('warp').state(params).toUpperCase() }),
      sec(by('random'), { def: false, meta: by('random').state(params).toUpperCase() }),
      sec(by('frame'), { def: false }),
    ]
    footer = (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">{live}<span className="kol-float-timecode text-oq-64 text-[11px]">512 × 512 px</span></div>
        <Button variant="float" tone="primary" size="md" className="w-full [--kol-tone-bg:var(--kol-accent-primary)] [--kol-tone-fg:var(--kol-accent-on-primary)]" onClick={t.apply} data-control="Generate">Generate</Button>
      </div>
    )
  } else if (id === 'repeat') {
    const [common, mode] = t.sections
    const copies = copyMatrices(params, { x: 0, y: 0, w: 1, h: 1 }).length + 1
    const src = params.sourceId ? findLayerDeep(t.state.layers ?? [], params.sourceId) : null
    sections = [
      { id: 'head', rows: rowsOf(common.groups[0].controls, t) },
      sec(mode, { meta: `${copies} COPIES`, extra: [{ id: 'copy-grid', render: () => (
        <div className="h-[110px] rounded-md bg-(--kol-float-well) p-3 flex"><RepeatPreview t={t} className="w-full h-full" /></div>
      ) }] }),
    ]
    const shape = params.repMode === 'grid' ? `${params.repCols} × ${params.repRows} grid` : params.repMode === 'mirror' ? (params.repPoint ? 'point mirror' : 'axis mirror') : `${params.repCount} around`
    footer = (
      <div className="flex items-center justify-between kol-float-label">
        <span className="flex items-center gap-2 text-oq-64"><span className={`size-1.5 rounded-full ${src ? 'bg-(--kol-accent-primary)' : 'bg-(--kol-oq-24)'}`} />{src ? 'Source linked' : 'No source'}</span>
        <span className="text-oq-64">{shape}</span>
      </div>
    )
  } else {
    const [glyph, ...rest] = t.sections
    sections = [
      sec(glyph, { extra: [{ id: 'glyph-preview', render: () => (
        <div className="relative h-[132px] rounded-md bg-(--kol-float-well) overflow-hidden flex items-center justify-center">
          {/* his guides: the x-height and the baseline */}
          <span className="absolute inset-x-3 top-[38%] border-t border-dashed border-(--kol-oq-24)" /><span className="absolute right-3 top-[38%] -translate-y-full kol-float-label text-oq-48">x-height</span>
          <span className="absolute inset-x-3 top-[72%] border-t border-(--kol-oq-24)" /><span className="absolute right-3 top-[72%] -translate-y-full kol-float-label text-oq-48">baseline</span>
          <TypePreview t={t} size={256} className="h-full aspect-square" />
        </div>
      ) }] }),
      ...rest.map((s) => sec(s)),
    ]
    footer = (
      <div className="flex items-center justify-between kol-float-label">
        <span className="flex items-center gap-2 text-oq-64"><span className={`size-1.5 rounded-full ${t.target ? 'bg-(--kol-accent-primary)' : 'bg-(--kol-oq-24)'}`} />{t.target ? 'Linked to letter mask' : 'Not placed'}</span>
        <span className="text-oq-64">1 glyph</span>
      </div>
    )
  }

  return (
    <PropertyRail title={win.id === 'type' ? 'Paratype Letter' : win.kind} width={W} density="compact" sections={sections} footer={footer} surface="solid"
      onExpand={() => openTool(id, 'dialog')} onCollapse={onClose}
      className={`kol-generator-rail ${ACCENT} ${className}`.trim()} />
  )
}
