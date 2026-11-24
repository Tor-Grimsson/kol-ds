import { useEffect, useState } from 'react'
import {
  ANGLED_SHAPES, isBinding, loopById, makeSweep, mulberry32, randomSeed, rolesOf, SWEEP_PRESETS, SWEEP_SHAPE_OPTIONS,
  SWEEP_TARGET_OPTIONS, SWEEP_TRAVEL_OPTIONS, useComposeState, useLayerEdit, useRolesVersion, visibleParams,
} from './engine.js'
import { ParamList, ParamSelect } from './Params.jsx'
import { Button, ButtonGroup, Dropdown, FieldPair, LabeledControl, Slider, ToggleSwitch, Tooltip, XYPad, LabeledControlSection } from '@kolkrabbi/kol-component'
import Icon from '../ui/Icon.jsx'

/* The labs' own parts (round 4 W7, 7.2), each the package's inspector of the same name carried row for row in
   kolbox's kit: SoftformsLayers, PenroseLayers, CameraPoseSlots, ParatypeTools and the effects' SweepStack. Their
   rows, words, limits and writes are the package's; only the drawing is kolbox's. */

/* a list row with the real StepList's parts: the grab handle ("Reorder step N", drag it onto another row), the step's
   number, its swatch, its label, its actions; selected rows take the field fill. Drag uses the platform's own drag and
   drop. */
function StepRow({ index, label, swatch, number = true, selected, onSelect, onMove, reorder = false, actions, shown, onToggleShown, children }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-control ${selected ? 'bg-field' : ''}`}
      onDragOver={reorder ? (e) => e.preventDefault() : undefined}
      onDrop={reorder ? (e) => { e.preventDefault(); const from = Number(e.dataTransfer.getData('text/kolbox-step')); if (Number.isFinite(from) && from !== index) onMove(from, index) } : undefined}
      data-step-row={index}
    >
      <div className={`flex h-control items-center gap-1 pr-1 text-label ${onSelect ? 'cursor-pointer' : ''} ${selected ? 'text-text' : 'text-muted hover:text-text'}`} onClick={onSelect}>
        {reorder && (
          <span
            draggable
            role="button"
            tabIndex={0}
            aria-label={`Reorder step ${index + 1}`}
            className="inline-flex h-control w-5 shrink-0 cursor-grab items-center justify-center text-muted outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent"
            onClick={(e) => e.stopPropagation()}
            onDragStart={(e) => { e.dataTransfer.setData('text/kolbox-step', String(index)); e.dataTransfer.effectAllowed = 'move' }}
            onKeyDown={(e) => { const d = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0; if (d) { e.preventDefault(); onMove(index, index + d) } }}
          >
            <Icon name="grip-vertical" size={12} />
          </span>
        )}
        {number && <span className="w-4 shrink-0 font-mono text-meta text-muted">{index + 1}</span>}
        {swatch && <span className="size-3 shrink-0 rounded-sm" style={{ background: swatch }} />}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {actions}
        {onToggleShown && (
          <Button variant="kolbox" iconOnly={shown ? 'eye-on' : 'eye-off'} aria-label={`${shown ? 'Hide' : 'Show'} row ${index + 1}`} onClick={(e) => { e.stopPropagation(); onToggleShown() }}/>
        )}
      </div>
      {children}
    </div>
  )
}

/* ── Soft Forms: the Forms list (the package's SoftformsLayers) ── */
const MAX_FORMS = 5
const TYPE_OPTS_2D = [
  { value: 'teardrop', label: 'Teardrop' }, { value: 'pill', label: 'Pill' }, { value: 'dome', label: 'Dome' },
  { value: 'orb', label: 'Orb' }, { value: 'super', label: 'Lozenge' },
]
const TYPE_OPTS_3D = [
  { value: 'sphere', label: 'Sphere' }, { value: 'capsule', label: 'Capsule' }, { value: 'teardrop', label: 'Teardrop' }, { value: 'lozenge', label: 'Lozenge' },
]
const CTRL_2D = [
  { k: 'x', label: 'Position X', min: -1, max: 1, step: 0.01, def: 0 },
  { k: 'y', label: 'Position Y', min: -1, max: 1, step: 0.01, def: 0 },
  { k: 'sx', label: 'Scale X', min: 0.12, max: 1.6, step: 0.01, def: 0.6 },
  { k: 'sy', label: 'Scale Y', min: 0.12, max: 1.6, step: 0.01, def: 0.6, fallback: 'sx' },
  { k: 'rot', label: 'Rotation', min: 0, max: 360, step: 1, def: 0 },
  { k: 'hue', label: 'Hue', min: 0, max: 1, step: 0.01, def: 0 },
]
const CTRL_3D = [
  { k: 'x', label: 'Position X', min: -1.2, max: 1.2, step: 0.01, def: 0 },
  { k: 'y', label: 'Position Y', min: -1.2, max: 1.2, step: 0.01, def: 0 },
  { k: 'z', label: 'Position Z', min: -1.2, max: 1.2, step: 0.01, def: 0 },
  { k: 'sx', label: 'Scale X', min: 0.12, max: 1.6, step: 0.01, def: 0.7 },
  { k: 'sy', label: 'Scale Y', min: 0.12, max: 1.6, step: 0.01, def: 0.7, fallback: 'sx' },
  { k: 'sz', label: 'Scale Z', min: 0.12, max: 1.6, step: 0.01, def: 0.7, fallback: 'sx' },
  { k: 'rot', label: 'Rotation', min: 0, max: 360, step: 1, def: 0 },
  { k: 'hue', label: 'Hue', min: 0, max: 1, step: 0.01, def: 0 },
]
const TAU = Math.PI * 2
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const round2 = (v) => Math.round(v * 100) / 100
const rnd = (rng, a, b) => a + rng() * (b - a)
const inDisk = (rng, R) => { const r = R * Math.sqrt(rng()), th = rng() * TAU; return [r * Math.cos(th), r * Math.sin(th)] }
const inBall = (rng, R) => {
  const r = R * Math.cbrt(rng()), th = rng() * TAU, ph = Math.acos(2 * rng() - 1)
  return [r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph) * 0.8]
}
const recenter2 = (arr) => {
  const n = arr.length || 1
  const c = arr.reduce((a, f) => ({ x: a.x + f.x / n, y: a.y + f.y / n }), { x: 0, y: 0 })
  return arr.map((f) => ({ ...f, x: round2(f.x - c.x), y: round2(f.y - c.y) }))
}
const recenter3 = (arr) => {
  const n = arr.length || 1
  const c = arr.reduce((a, f) => ({ x: a.x + f.x / n, y: a.y + f.y / n, z: a.z + f.z / n }), { x: 0, y: 0, z: 0 })
  return arr.map((f) => ({ ...f, x: round2(f.x - c.x), y: round2(f.y - c.y), z: round2(f.z - c.z) }))
}
const EDIT_FORMS_TIP = 'Edit forms on the canvas (click to select, drag to move, corners to scale, knob to rotate)'

export function SoftformsLayers({ layer }) {
  const { updateLayer } = useComposeState()
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const is3d = layer.loopId === 'softforms3d'
  const metaball = is3d && !!layer.metaball
  const typeOpts = is3d ? TYPE_OPTS_3D : TYPE_OPTS_2D
  const ctrls = is3d ? CTRL_3D : CTRL_2D
  const minForms = metaball ? 2 : 1
  const forms = Array.isArray(layer.forms) ? layer.forms : []

  const [sel, setSel] = useState(-1)
  const selForm = sel >= 0 && sel < forms.length ? forms[sel] : null
  const selectForm = (i) => {
    setSel(i)
    window.dispatchEvent(new CustomEvent('kol:softform-select', { detail: { id: layer.id, index: i, from: 'panel' } }))
  }
  useEffect(() => {
    const onSel = (e) => { if (e.detail?.id === layer.id && e.detail.from === 'canvas') setSel(e.detail.index) }
    window.addEventListener('kol:softform-select', onSel)
    return () => window.removeEventListener('kol:softform-select', onSel)
  }, [layer.id])

  const writeForms = (next) => updateLayer(layer.id, { forms: next })
  const updSel = (k, v) => edit.patch({ forms: forms.map((f, i) => (i === sel ? { ...f, [k]: v } : f)) })
  const addForm = () => {
    if (forms.length >= MAX_FORMS) return
    const f = is3d
      ? { t: 'sphere', x: 0, y: 0, z: 0, sx: 0.7, sy: 0.7, sz: 0.7, rot: 0, hue: round2(Math.random()) }
      : { t: 'dome', x: 0, y: 0, sx: 0.6, sy: 0.6, rot: 0, hue: round2(Math.random()) }
    writeForms([...forms, f])
    selectForm(forms.length)
  }
  const dupForm = (i) => {
    if (forms.length >= MAX_FORMS) return
    const c = { ...forms[i], x: clamp((forms[i].x ?? 0) + 0.12, -1.2, 1.2), y: clamp((forms[i].y ?? 0) - 0.1, -1.2, 1.2) }
    writeForms([...forms.slice(0, i + 1), c, ...forms.slice(i + 1)])
    selectForm(i + 1)
  }
  const delForm = (i) => { if (forms.length <= minForms) return; writeForms(forms.filter((_, k) => k !== i)); selectForm(-1) }
  const swapForm = (i, j) => {
    if (j < 0 || j >= forms.length) return
    const n = [...forms]; [n[i], n[j]] = [n[j], n[i]]; writeForms(n)
    selectForm(j)
  }
  const rollColor = () => { const rng = mulberry32(randomSeed()); writeForms(forms.map((f) => ({ ...f, hue: round2(rng()) }))) }
  const rollTransform = () => {
    const rng = mulberry32(randomSeed())
    writeForms(forms.map((f) => (is3d
      ? { ...f, x: round2(rnd(rng, -0.7, 0.7)), y: round2(rnd(rng, -0.7, 0.7)), z: round2(rnd(rng, -0.5, 0.5)), rot: Math.round(rnd(rng, 0, 360)) }
      : { ...f, x: round2(rnd(rng, -0.55, 0.55)), y: round2(rnd(rng, -0.75, 0.75)), rot: Math.round(rnd(rng, 0, 360)) })))
  }
  const rollScale = () => {
    const rng = mulberry32(randomSeed())
    writeForms(forms.map((f) => {
      const sx = round2(rnd(rng, 0.35, 0.95)), sy = round2(rnd(rng, 0.35, 0.95))
      return is3d ? { ...f, sx, sy, sz: round2(rnd(rng, 0.35, 0.95)) } : { ...f, sx, sy }
    }))
  }
  const rollAnim = () => { const rng = mulberry32(randomSeed()); updateLayer(layer.id, { motion: round2(rnd(rng, 0, 1.1)), sweep: Math.round(rnd(rng, 0, 360)) }) }
  const rollRearrange = () => {
    const rng = mulberry32(randomSeed())
    if (is3d) {
      if (metaball) {
        const N = 2 + Math.floor(rng() * 4), R = rnd(rng, 0.45, 0.9)
        writeForms(recenter3(Array.from({ length: N }, (_, i) => {
          const [x, y, z] = inBall(rng, R), s = round2(rnd(rng, 0.5, 0.92))
          return { t: 'sphere', x: round2(x), y: round2(y), z: round2(z), sx: s, sy: s, sz: s, rot: 0, hue: round2(i / N) }
        })))
      } else {
        const R = rnd(rng, 0.6, 1.15)
        writeForms(recenter3(forms.map((f) => { const [x, y, z] = inBall(rng, R); return { ...f, x: round2(x), y: round2(y), z: round2(z), rot: Math.round(rnd(rng, 0, 360)) } })))
      }
      return
    }
    const N = 2 + Math.floor(rng() * 4), R = rnd(rng, 0.45, 0.85)
    writeForms(recenter2(Array.from({ length: N }, (_, i) => {
      const [x, y] = inDisk(rng, R)
      return {
        t: TYPE_OPTS_2D[Math.floor(rng() * TYPE_OPTS_2D.length)].value, x: round2(x), y: round2(y),
        sx: round2(rnd(rng, 0.4, 0.85)), sy: round2(rnd(rng, 0.4, 0.85)), rot: Math.round(rnd(rng, 0, 360)), hue: round2(i / N),
      }
    })))
  }
  const labelOf = (t) => typeOpts.find((o) => o.value === t)?.label ?? t

  return (
    <LabeledControlSection variant="kolbox" label="Forms">
      {/* reversed, as the real list: the topmost (last-painted) form at the top; `d` is the row, `n - 1 - d` the form */}
      <div className="flex flex-col">
        {forms.map((_, d) => {
          const i = forms.length - 1 - d
          return (
            <StepRow
              key={d} index={d} label={labelOf(forms[i].t)} selected={sel === i} reorder
              onSelect={() => selectForm(i)}
              onMove={(from, to) => { if (to >= 0 && to < forms.length) swapForm(forms.length - 1 - from, forms.length - 1 - to) }}
              actions={(
                <>
                  {forms.length < MAX_FORMS && <Button variant="kolbox" iconOnly="copy" aria-label="Duplicate form" onClick={(e) => { e.stopPropagation(); dupForm(i) }}/>}
                  {forms.length > minForms && <Button variant="kolbox" iconOnly="trash" aria-label="Delete form" onClick={(e) => { e.stopPropagation(); delForm(i) }}/>}
                </>
              )}
            />
          )
        })}
      </div>
      {forms.length < MAX_FORMS && <Button variant="kolbox" tone="secondary" iconLeft="plus" className="w-full" onClick={addForm}>Add form</Button>}
      {!is3d && (
        <Tooltip variant="kolbox" label={EDIT_FORMS_TIP}>
          <Button variant="kolbox" tone="secondary" className="w-full" aria-label={EDIT_FORMS_TIP}
            onClick={() => window.dispatchEvent(new CustomEvent('kol:softform-edit', { detail: { id: layer.id, index: Math.max(0, sel) } }))}>
            Edit forms on canvas
          </Button>
        </Tooltip>
      )}
      {selForm && (
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-section text-text">Selected form</span>
          <LabeledControl variant="kolbox" horizontal label="Type">
            <Dropdown variant="kolbox" className="min-w-0 flex-1" options={typeOpts} value={selForm.t} onChange={(v) => writeForms(forms.map((f, i) => (i === sel ? { ...f, t: v } : f)))} />
          </LabeledControl>
          {ctrls.map((c) => {
            const raw = selForm[c.k] ?? (c.fallback ? selForm[c.fallback] : undefined)
            const value = typeof raw === 'number' ? raw : c.def
            return (
              <LabeledControl variant="kolbox" horizontal key={c.k} label={c.label}>
                <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" min={c.min} max={c.max} step={c.step} value={value} aria-label={c.label} onChange={(v) => updSel(c.k, v)} />
              </LabeledControl>
            )
          })}
        </div>
      )}
      <span className="pt-1 text-label text-muted">Randomize forms</span>
      <ButtonGroup layout="grid">
        <Button variant="kolbox" tone="secondary" onClick={rollColor}>Color</Button>
        <Button variant="kolbox" tone="secondary" onClick={rollTransform}>Transform</Button>
        <Button variant="kolbox" tone="secondary" onClick={rollScale}>Scale</Button>
        <Button variant="kolbox" tone="secondary" onClick={rollAnim}>Animation</Button>
      </ButtonGroup>
      <Button variant="kolbox" tone="secondary" className="w-full" onClick={rollRearrange}>Rearrange</Button>
    </LabeledControlSection>
  )
}

/* ── Penrose: Layers (the package's PenroseLayers): the roles the running sim has drawn, each numbered, with its
   colour, show or hide, and the role's opacity ── */
const ROLES = [{ role: 'fg', label: 'Foreground' }, { role: 'accent', label: 'Accent' }, { role: 'dim', label: 'Dim' }, { role: 'warm', label: 'Warm' }]
const DEFAULT_OPACITY = { fg: 1, accent: 1, dim: 5, warm: 1 }

export function PenroseLayers({ layer, setProp, patch }) {
  useRolesVersion()
  const used = rolesOf(layer.loopId)
  const rows = ROLES.filter((r) => used?.has(r.role))
  if (!rows.length) return null
  const prev = layer._layerPrev ?? {}
  return (
    <LabeledControlSection variant="kolbox" label="Layers">
      {rows.map(({ role, label }, i) => {
        const key = `${role}Opacity`
        const v = Number(layer[key] ?? DEFAULT_OPACITY[role])
        return (
          <StepRow key={role} index={i} label={label} swatch={layer[role] ?? null} shown={v > 0}
            onToggleShown={() => {
              if (v > 0) patch({ [key]: 0, _layerPrev: { ...prev, [role]: v } })
              else patch({ [key]: prev[role] || DEFAULT_OPACITY[role] })
            }}>
            <Slider variant="kolbox" className="min-w-0 pl-5" min={0} max={5} step={0.1} value={v} aria-label={`${label} opacity`} formatValue={(n) => n.toFixed(1)} onChange={(n) => setProp(key, n)} />
          </StepRow>
        )
      })}
    </LabeledControlSection>
  )
}

/* ── Camera poses (the package's CameraPoseSlots): three slots, a press recalls (or saves an empty one), shift-press
   overwrites; Reset puts the camera params back and asks a live engine to reset its rig ── */
export function CameraPoseSlots({ layer, patch, camParams, isEngine, showHeader = false }) {
  const raw = Array.isArray(layer._camSlots) ? layer._camSlots : []
  const slots = [raw[0] ?? null, raw[1] ?? null, raw[2] ?? null]
  const save = (i) => { const pose = {}; for (const p of camParams) pose[p.key] = layer[p.key] ?? p.default; const next = [...slots]; next[i] = pose; patch({ _camSlots: next }) }
  const recall = (i) => { if (slots[i]) patch({ ...slots[i] }) }
  const reset = () => {
    const defaults = {}
    for (const p of camParams) defaults[p.key] = p.default
    patch(defaults)
    if (isEngine) import('../../../loops/gl/host.js').then((m) => m.hostAction?.(layer.id, 'resetCamera')).catch(() => {})
  }
  const row = (
    <div className="flex items-center gap-1" data-camera-poses>
      {camParams.length > 0 && slots.map((s, i) => {
        const tip = s ? 'Recall pose (shift-click = overwrite)' : 'Save pose'
        return (
          <Tooltip variant="kolbox" key={i} label={tip}>
            <Button variant="kolbox" tone="ghost" pressed={!!s} aria-label={tip} onClick={(e) => ((e.shiftKey || !s) ? save(i) : recall(i))}>{i + 1}</Button>
          </Tooltip>
        )
      })}
      <Button variant="kolbox" tone="secondary" className="ml-auto" onClick={reset}>Reset</Button>
    </div>
  )
  return showHeader ? <LabeledControlSection variant="kolbox" label="Camera">{row}</LabeledControlSection> : <LabeledControlSection variant="kolbox">{row}</LabeledControlSection>
}

/* ── Para Type (the package's ParatypeTools): Flatten to vector on Generate, the Explore pad on Style ── */
const FLATTEN_TIP = 'Flatten the glyph(s) to vector shape layers (one-way)'
export function ParatypeFlatten({ layer }) {
  const { flattenParatype } = useComposeState()
  if (layer?.loopId !== 'paratype-glyph' || !flattenParatype) return null
  return (
    <LabeledControlSection variant="kolbox">
      <Tooltip variant="kolbox" label={FLATTEN_TIP}>
        <Button variant="kolbox" tone="secondary" className="w-full" aria-label={FLATTEN_TIP} onClick={() => flattenParatype(layer.id)}>Flatten to vector</Button>
      </Tooltip>
    </LabeledControlSection>
  )
}

export function ParatypeExplore({ layer, patch }) {
  if (layer?.loopId !== 'paratype-glyph') return null
  const loop = loopById(layer.loopId)
  const axes = visibleParams(loop?.params ?? [], layer).filter((q) => q.type === 'range')
  if (axes.length < 2) return null
  const pick = (want, taken) => (axes.some((a) => a.key === want) && want !== taken ? want : axes.find((a) => a.key !== taken)?.key)
  const xKey = pick(layer._xyX ?? 'stemWidth', null)
  const yKey = pick(layer._xyY ?? 'oWidth', xKey)
  const xDef = axes.find((a) => a.key === xKey)
  const yDef = axes.find((a) => a.key === yKey)
  if (!xDef || !yDef) return null
  const val = (key, def) => (typeof layer[key] === 'number' ? layer[key] : def.default)
  const bound = (key) => isBinding(layer[key])
  const snap = (v, def) => { const st = def.step ?? 1; return st < 1 ? Number((Math.round(v / st) * st).toFixed(4)) : Math.round(v) }
  const options = axes.map((a) => ({ value: a.key, label: a.label }))
  return (
    <LabeledControlSection variant="kolbox" label="Explore">
      <FieldPair variant="kolbox"
        first={<LabeledControl variant="kolbox" label="X axis"><Dropdown variant="kolbox" className="min-w-0 flex-1" options={options} value={xKey} onChange={(v) => patch({ _xyX: v })} /></LabeledControl>}
        second={<LabeledControl variant="kolbox" label="Y axis"><Dropdown variant="kolbox" className="min-w-0 flex-1" options={options} value={yKey} onChange={(v) => patch({ _xyY: v })} /></LabeledControl>}
      />
      <XYPad
        variant="kolbox"
        xValue={val(xKey, xDef)} yValue={val(yKey, yDef)}
        xMin={xDef.min ?? 0} xMax={xDef.max ?? 1} yMin={yDef.min ?? 0} yMax={yDef.max ?? 1}
        xLabel={xDef.label} yLabel={yDef.label}
        onChange={(x, y) => patch({ ...(!bound(xKey) && { [xKey]: snap(x, xDef) }), ...(!bound(yKey) && { [yKey]: snap(y, yDef) }) })}
      />
    </LabeledControlSection>
  )
}

/* ── Effects: the sweeps (the package's SweepStack): Add motion… with the sweep presets, Add custom sweep, then each
   sweep its own section, its shape, on or off, delete, its rows and its Origin pad ── */
const sweepSchema = (sw) => [
  { key: 'shape', label: 'Shape', type: 'select', options: SWEEP_SHAPE_OPTIONS, default: 'linear' },
  { key: 'target', label: 'Target', type: 'select', options: SWEEP_TARGET_OPTIONS, default: 'brightness' },
  { key: 'travel', label: 'Travel', type: 'select', options: SWEEP_TRAVEL_OPTIONS, default: 'forward' },
  ...(sw.target === 'reveal' ? [] : [{ key: 'amount', label: 'Amount', type: 'range', min: -1, max: 1, step: 0.01, default: 0.6 }]),
  { key: 'speed', label: 'Speed', type: 'range', min: -8, max: 8, step: 1, default: 1 },
  { key: 'width', label: 'Width', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.35 },
  ...(ANGLED_SHAPES.has(sw.shape ?? 'linear') ? [{ key: 'angle', label: 'Angle', type: 'range', min: 0, max: 360, step: 1, default: 0 }] : []),
]
export function SweepStack({ sweeps, onChange }) {
  const shapeLabel = (v) => SWEEP_SHAPE_OPTIONS.find((s) => s.value === v)?.label ?? v
  const add = (preset) => onChange([...sweeps, preset ? makeSweep(preset.shape, preset) : makeSweep()])
  const removeAt = (i) => onChange(sweeps.filter((_, j) => j !== i))
  const patchAt = (i, p) => onChange(sweeps.map((sw, j) => (j === i ? { ...sw, ...p } : sw)))
  return (
    <>
      <LabeledControlSection variant="kolbox" label="Motion">
        <ParamSelect value="" className="w-full" options={[{ value: '', label: 'Add motion…' }, ...SWEEP_PRESETS.map((p) => ({ value: p.name, label: p.name }))]}
          onChange={(name) => { const p = SWEEP_PRESETS.find((x) => x.name === name); if (p) add(p) }} />
        <Button variant="kolbox" tone="secondary" iconLeft="plus" className="w-full" onClick={() => add()}>Add custom sweep</Button>
      </LabeledControlSection>
      {sweeps.map((sw, i) => {
        const enabled = sw.enabled !== false
        return (
          <LabeledControlSection variant="kolbox" key={i} label={shapeLabel(sw.shape ?? 'linear')} end={(
            <>
              <ToggleSwitch variant="kolbox" aria-label={`${shapeLabel(sw.shape ?? 'linear')} on`} checked={enabled} onChange={(v) => patchAt(i, { enabled: v })} />
              <Button variant="kolbox" iconOnly="x" aria-label="Delete sweep" onClick={() => removeAt(i)}/>
            </>
          )}>
            {enabled && <ParamList flat schema={sweepSchema(sw)} layer={sw} setProp={(k, v) => patchAt(i, { [k]: v })} />}
            {enabled && (sw.shape ?? 'linear') !== 'noise' && (
              <LabeledControl variant="kolbox" label="Origin">
                <XYPad variant="kolbox" className="w-full min-w-0" xValue={sw.cx ?? 0.5} yValue={sw.cy ?? 0.5} xMin={0} xMax={1} yMin={1} yMax={0}
                  onChange={(x, y) => patchAt(i, { cx: Math.round(x * 100) / 100, cy: Math.round(y * 100) / 100 })} />
              </LabeledControl>
            )}
          </LabeledControlSection>
        )
      })}
    </>
  )
}
