import { useEffect, useRef, useState } from 'react'
import {
  ASPECTS, BLEND_MODES, COVER_TYPES, findLayerDeep, pack, resolveColor, resolveCssVar, scalePathNodes, useColorTarget,
  useComposeState, useLayerEdit,
} from './engine.js'
import { Group, OffOn } from '../labs/Params.jsx'
import Button from '../ui/Button.jsx'
import ColorSwatch from '../ui/ColorSwatch.jsx'
import FieldRow from '../ui/FieldRow.jsx'
import Icon from '../ui/Icon.jsx'
import InputColor from '../ui/InputColor.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Segmented from '../ui/Segmented.jsx'
import Select from '../ui/Select.jsx'
import Toggle from '../ui/Toggle.jsx'
import { MenuButton, MenuRow } from '../ui/Menu.jsx'

/* The Inspector tab, as the real one routes it (the package's InspectorRail): the canvas row selected, its frame and
   background; one layer, its Transform, Appearance and its kind's own pane; several, what they share; nothing, empty. */
export default function Inspector() {
  const { selectedIds, layers } = useComposeState()
  const ids = selectedIds ?? []
  if (ids.includes('canvas')) return <CanvasInspector />
  if (ids.length > 1) return <MultiInspector ids={ids} />
  const layer = ids.length === 1 ? findLayerDeep(layers, ids[0]) : null
  return layer ? <LayerInspector key={layer.id} layer={layer} /> : null
}

const Body = ({ children }) => <div className="flex flex-col gap-5 p-4">{children}</div>
const n0 = (raw) => { const n = Number(raw); return Number.isFinite(n) ? Math.round(n) : 0 }
/* a number field filling its grid cell: the letter or glyph leads, the unit trails */
const Field = ({ lead, unit, value, onCommit, label }) => (
  <InputNumber lead={lead} unit={unit} value={value} onCommit={onCommit} aria-label={label} title={label} chars={5} className="w-full min-w-0 !justify-start" />
)
const H_ALIGN = [['start', 'align-horizontal-left', 'Align left'], ['center', 'align-horizontal-center', 'Align horizontal center'], ['end', 'align-horizontal-right', 'Align right']]
const V_ALIGN = [['start', 'align-vertical-top', 'Align top'], ['center', 'align-vertical-center', 'Align vertical center'], ['end', 'align-vertical-bottom', 'Align bottom']]
const iconOpts = (list) => list.map(([value, icon, ariaLabel]) => ({ value, ariaLabel, label: <span className="flex justify-center"><Icon name={icon} size={14} /></span> }))

function Alignment() {
  const { alignSelected } = useComposeState()
  return (
    <div className="grid grid-cols-2 gap-2">
      <Segmented options={iconOpts(H_ALIGN)} value={null} onChange={(m) => alignSelected('h', m)} />
      <Segmented options={iconOpts(V_ALIGN)} value={null} onChange={(m) => alignSelected('v', m)} />
    </div>
  )
}

/* ── the canvas: Frame (aspect, W and H, grid) and Background (fill, its opacity, the infinite backdrop) ── */
/* a theme variable is read where the engine's canvas reads it (the canvas box carries its dark tokens) */
const shown = (value, palette) => {
  const r = resolveColor(value, palette)
  const m = typeof r === 'string' && /^var\((--[^,)]+)/.exec(r)
  if (!m) return r
  const box = document.querySelector('[data-region=canvas]')
  return (box && getComputedStyle(box).getPropertyValue(m[1]).trim()) || resolveCssVar(r)
}
function CanvasInspector() {
  const target = useColorTarget()
  const { aspect, setAspect, canvasW, canvasH, setCanvasSize, showGrid, toggleGrid, canvasFill, canvasFillOpacity, setCanvasFillOpacity, infiniteFill, setInfiniteFill, palette } = useComposeState()
  const size = (v, fallback) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback }
  return (
    <Body>
      <Group label="Frame">
        <div className="flex"><Select value={aspect} options={ASPECTS.map((a) => ({ value: a.id, label: a.label }))} onChange={setAspect} /></div>
        <div className="grid grid-cols-2 gap-2">
          <Field lead="W" label="Width" value={canvasW} onCommit={(w) => setCanvasSize(size(w, canvasW), canvasH)} />
          <Field lead="H" label="Height" value={canvasH} onCommit={(h) => setCanvasSize(canvasW, size(h, canvasH))} />
        </div>
        <FieldRow label="Grid"><span className="flex flex-1 justify-end"><Toggle checked={showGrid} onChange={toggleGrid} aria-label="Grid" /></span></FieldRow>
      </Group>
      <Group label="Background">
        <InputColor hideLabel label="Background" value={canvasFill} resolved={shown(canvasFill ?? 'var(--kol-surface-ab-split)', palette)} onChange={target.setFill} />
        <FieldRow label="Fill opacity">
          <span className="flex flex-1 justify-end"><InputNumber unit="%" chars={3} value={Math.round((canvasFillOpacity ?? 1) * 100)} aria-label="Fill opacity"
            onCommit={(raw) => { const n = Number(raw); if (Number.isFinite(n)) setCanvasFillOpacity(Math.min(1, Math.max(0, n / 100))) }} /></span>
        </FieldRow>
        <InputColor label="Infinite" value={infiniteFill} resolved={shown(infiniteFill ?? 'var(--kol-surface-secondary)', palette)} onChange={setInfiniteFill} />
      </Group>
    </Body>
  )
}

/* ── several layers: alignment, then opacity and blend written to all (a field they disagree on reads empty) ── */
function MultiInspector({ ids }) {
  const { layers, groupLayers, updateLayer } = useComposeState()
  const sel = ids.map((id) => findLayerDeep(layers, id)).filter((l) => l && !l.locked)
  const same = (get) => (sel.length && sel.every((l) => get(l) === get(sel[0])) ? get(sel[0]) : null)
  const opacity = same((l) => Math.round((l.opacity ?? 1) * 100))
  const blend = same((l) => l.blend ?? 'normal')
  const writeAll = (patch) => sel.forEach((l) => updateLayer(l.id, patch))
  return (
    <Body>
      <Group label="Transform">
        <p className="text-label text-muted">{ids.length} layers selected.</p>
        <Alignment />
      </Group>
      <Group label="Appearance">
        <div className="grid grid-cols-2 gap-2">
          <Field lead={<Icon name="opacity" size={14} />} unit="%" label="Opacity" value={opacity ?? ''}
            onCommit={(raw) => { const n = Number(raw); if (raw !== '' && Number.isFinite(n)) writeAll({ opacity: Math.min(1, Math.max(0, n / 100)) }) }} />
          <div className="flex"><Select value={blend ?? ''} options={blend ? BLEND_MODES : [{ value: '', label: 'Mixed' }, ...BLEND_MODES]} onChange={(v) => v && writeAll({ blend: v })} /></div>
        </div>
        <Button variant="outline" icon="component-01" className="w-full" onClick={() => groupLayers(ids)}>Group selection</Button>
      </Group>
    </Body>
  )
}

/* ── one layer ── */
const anchorStore = { value: [0, 0] }
const ORIGINS = [['left top', 0, 0], ['center top', 0.5, 0], ['right top', 1, 0], ['left center', 0, 0.5], ['center', 0.5, 0.5], ['right center', 1, 0.5], ['left bottom', 0, 1], ['center bottom', 0.5, 1], ['right bottom', 1, 1]]
function OriginPicker({ value, onChange }) {
  return (
    <div role="group" aria-label="Transform origin" className="grid size-7 grid-cols-3 place-items-center">
      {ORIGINS.map(([label, x, y]) => {
        const on = value[0] === x && value[1] === y
        return <button key={label} type="button" aria-label={label} aria-pressed={on} onClick={() => onChange([x, y])} className={`size-1.5 rounded-full outline-none ${on ? 'bg-fg' : 'bg-line-strong hover:bg-muted'}`} />
      })}
    </div>
  )
}

function rotateAboutAnchor(layer, next, [ax, ay]) {
  const prev = layer.rotation ?? 0
  const d = ((next - prev) * Math.PI) / 180
  if (!d || layer.w == null) return {}
  const cx = layer.x + layer.w / 2, cy = layer.y + layer.h / 2, r = (prev * Math.PI) / 180
  const lx = (ax - 0.5) * layer.w, ly = (ay - 0.5) * layer.h
  const ox = cx + lx * Math.cos(r) - ly * Math.sin(r), oy = cy + lx * Math.sin(r) + ly * Math.cos(r)
  const vx = cx - ox, vy = cy - oy
  return { x: Math.round(ox + vx * Math.cos(d) - vy * Math.sin(d) - layer.w / 2), y: Math.round(oy + vx * Math.sin(d) + vy * Math.cos(d) - layer.h / 2) }
}

function Transform({ layer, edit }) {
  const { flipLayer } = useComposeState()
  const [anchor, setAnchorState] = useState(anchorStore.value)
  const setAnchor = (a) => { anchorStore.value = a; setAnchorState(a) }
  const set = edit.setProp
  const aspect = Number.isFinite(layer.aspectLocked) && layer.aspectLocked > 0 ? layer.aspectLocked : null
  /* the path layer's nodes scale with its box, as the real fields do, through the engine's own path math */
  const isPath = layer.type === 'path' && Array.isArray(layer.nodes)
  const scaled = (p) => {
    if (!isPath) return p
    const sx = p.w != null ? p.w / Math.max(1, layer.w) : 1, sy = p.h != null ? p.h / Math.max(1, layer.h) : 1
    return { ...p, nodes: scalePathNodes(layer.nodes, sx, sy), ...(layer.holes?.length ? { holes: layer.holes.map((r) => scalePathNodes(r, sx, sy)) } : {}) }
  }
  const anchored = (q) => { const p = scaled(q); return { ...p, ...(p.w != null ? { x: Math.round(layer.x - (p.w - layer.w) * anchor[0]) } : {}), ...(p.h != null ? { y: Math.round(layer.y - (p.h - layer.h) * anchor[1]) } : {}) } }
  const onW = (raw) => { const w = Math.max(8, n0(raw)); edit.patch(anchored(aspect ? { w, h: Math.max(8, Math.round(w / aspect)) } : { w })) }
  const onH = (raw) => { const h = Math.max(8, n0(raw)); edit.patch(anchored(aspect ? { w: Math.max(8, Math.round(h * aspect)), h } : { h })) }
  const skew = (raw) => { const n = Number(raw); return Number.isFinite(n) ? Math.max(-89, Math.min(89, Math.round(n))) : 0 }
  const onRot = (raw) => { const n = Number(raw); const next = Number.isFinite(n) ? ((Math.round(n) % 360) + 360) % 360 : 0; edit.patch({ rotation: next, ...rotateAboutAnchor(layer, next, anchor) }) }
  return (
    <Group label="Transform">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_28px] items-center gap-2">
        <div className="col-span-2"><Alignment /></div>
        <span />
        <Field lead="X" label="X position" value={Math.round(layer.x)} onCommit={(r) => set('x', n0(r))} />
        <Field lead="Y" label="Y position" value={Math.round(layer.y)} onCommit={(r) => set('y', n0(r))} />
        <OriginPicker value={anchor} onChange={setAnchor} />
        <Field lead="W" label="Width" value={Math.round(layer.w)} onCommit={onW} />
        <Field lead="H" label="Height" value={Math.round(layer.h)} onCommit={onH} />
        <Button icon={aspect ? 'lock' : 'unlock'} aria-label={aspect ? 'Unconstrain proportions' : 'Constrain proportions'} aria-pressed={!!aspect}
          onClick={() => (aspect ? set('aspectLocked', null) : layer.h > 0 && set('aspectLocked', layer.w / layer.h))} />
        <Field lead="SX" unit="°" label="Skew horizontal" value={Math.round(layer.skewX ?? 0)} onCommit={(r) => set('skewX', skew(r))} />
        <Field lead="SY" unit="°" label="Skew vertical" value={Math.round(layer.skewY ?? 0)} onCommit={(r) => set('skewY', skew(r))} />
        <span />
        <Field lead={<Icon name="angle" size={14} />} unit="°" label="Rotation" value={typeof layer.rotation === 'number' ? Math.round(layer.rotation) : 0} onCommit={onRot} />
        <Segmented value={null} onChange={(op) => {
          if (op === 'rot') set('rotation', (((Math.round(layer.rotation ?? 0) - 90) % 360) + 360) % 360)
          else flipLayer(layer.id, op === 'fh' ? 'h' : 'v')
        }} options={[
          { value: 'rot', ariaLabel: 'Rotate 90° left', label: <span className="flex justify-center"><Icon name="rotate-left" size={14} /></span> },
          { value: 'fh', ariaLabel: 'Flip horizontal', label: <span className={`flex justify-center ${layer.flipX ? 'text-fg' : ''}`}><Icon name="flip-horizontal" size={14} /></span> },
          { value: 'fv', ariaLabel: 'Flip vertical', label: <span className={`flex justify-center ${layer.flipY ? 'text-fg' : ''}`}><Icon name="flip-vertical" size={14} /></span> },
        ]} />
      </div>
      {layer.type === 'text' && (
        <Segmented value={layer.resizing ?? 'fixed'} onChange={(v) => set('resizing', v)} options={[
          { value: 'fixed', ariaLabel: 'Fixed size', label: <span className="flex justify-center"><Icon name="resize-fixed" size={14} /></span> },
          { value: 'auto-w', ariaLabel: 'Auto width', label: <span className="flex justify-center"><Icon name="resize-auto-w" size={14} /></span> },
          { value: 'auto-h', ariaLabel: 'Auto height', label: <span className="flex justify-center"><Icon name="resize-auto-h" size={14} /></span> },
        ]} />
      )}
    </Group>
  )
}

/* Fill and Stroke: each swatch focuses that paint and opens the Color tab on it */
function Paint({ paint, label, hex, none }) {
  const target = useColorTarget()
  const open = () => {
    target.setActivePaint(paint)
    window.dispatchEvent(new CustomEvent('kol:open-color-pane', { detail: { tab: paint === 'stroke' ? 'Stroke' : 'Colour' } }))
  }
  return (
    <div className="flex items-center gap-2">
      <ColorSwatch hex={none ? null : hex} size={20} label={`${label} paint`} onClick={open} />
      <span className="text-label text-muted">{label}</span>
    </div>
  )
}

function Appearance({ layer, edit }) {
  const { toggleLayer, palette } = useComposeState()
  const set = edit.setProp
  const hasRadius = (layer.type === 'shape' && layer.kind === 'rect') || layer.type === 'text'
  const visible = layer.visible !== false
  const blend = layer.blend ?? 'normal'
  const radii = Array.isArray(layer.radii)
  return (
    <Group>
      <div className="flex items-center gap-1">
        <h3 className="flex-1 text-label font-medium text-fg">Appearance</h3>
        <Button icon={visible ? 'eye-on' : 'eye-off'} aria-label={visible ? 'Hide layer' : 'Show layer'} onClick={() => toggleLayer(layer.id)} />
        <MenuButton icon="paint-drop" ariaLabel={`Blend: ${BLEND_MODES.find((b) => b.value === blend)?.label ?? blend}`} width={160}>
          {BLEND_MODES.map((b) => <MenuRow key={b.value} checked={blend === b.value} onClick={() => set('blend', b.value)}>{b.label}</MenuRow>)}
        </MenuButton>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_28px] items-center gap-2">
        <Field lead={<Icon name="opacity" size={14} />} unit="%" label="Opacity" value={Math.round((layer.opacity ?? 1) * 100)}
          onCommit={(raw) => { const n = Number(raw); set('opacity', Number.isFinite(n) ? Math.min(1, Math.max(0, n / 100)) : layer.opacity ?? 1) }} />
        {hasRadius && (radii ? <span /> : (
          <Field lead={<Icon name="corner-radius" size={14} />} label="Corner radius" value={Math.round(layer.radius ?? 0)} onCommit={(raw) => { const n = Number(raw); set('radius', Number.isFinite(n) && n > 0 ? Math.round(n) : 0) }} />
        ))}
        {hasRadius && layer.type === 'shape' && (
          <Button icon="maximize" aria-label={radii ? 'Link corners' : 'Edit corners separately'} aria-pressed={radii}
            onClick={() => (radii ? edit.patch({ radius: layer.radii[0] ?? 0, radii: null }) : edit.patch({ radii: [0, 1, 2, 3].map(() => Math.round(layer.radius ?? 0)) }))} />
        )}
      </div>
      {hasRadius && radii && (
        <div className="grid grid-cols-2 gap-2">
          {['TL', 'TR', 'BR', 'BL'].map((c, i) => (
            <Field key={c} lead={c} label={`${['Top left', 'Top right', 'Bottom right', 'Bottom left'][i]} radius`} value={Math.round(layer.radii[i] ?? 0)}
              onCommit={(raw) => { const n = Number(raw); set('radii', layer.radii.map((r, j) => (j === i ? (Number.isFinite(n) && n > 0 ? Math.round(n) : 0) : r))) }} />
          ))}
        </div>
      )}
      {'color' in layer && (
        <div className="flex items-center gap-4 pt-1">
          <Paint paint="fill" label="Fill" hex={resolveColor(layer.color, palette)} none={!layer.color} />
          <Paint paint="stroke" label="Stroke" hex={resolveColor(layer.stroke, palette)} none={!layer.stroke || !layer.strokeWidth} />
        </div>
      )}
    </Group>
  )
}

/* Preset: the generator's Category and Preset, and its backdrop where the loop allows one */
function LoopPreset({ layer, set }) {
  const g = pack('generators')
  const { updateLayer } = useComposeState()
  const tree = layer.type === 'misc' ? g.MISC_TREE : g.GENERATIVE_TREE
  const groups = tree.flatMap((t) => t.groups.map((gid) => ({ value: gid, label: t.groups.length > 1 ? `${t.label}, ${t.labels?.[gid] ?? g.groupById(gid).label}` : t.label })))
  const group = layer.loopGroup
  const presets = g.presetsInGroup(group)
  const apply = (preset, gid = group) => preset && updateLayer(layer.id, { loopGroup: gid, presetId: preset.id, presetLabel: preset.label, loopId: preset.loop, ...g.presetParams(preset) })
  return (
    <Group label="Preset">
      <FieldRow label="Category"><Select value={group} options={groups.some((x) => x.value === group) ? groups : [{ value: group, label: group }, ...groups]} onChange={(gid) => apply(g.presetsInGroup(gid)[0], gid)} /></FieldRow>
      <FieldRow label="Preset"><Select value={layer.presetId ?? ''} options={presets.map((p) => ({ value: p.id, label: p.label }))} onChange={(id) => apply(presets.find((p) => p.id === id))} /></FieldRow>
      {g.loopBgToggleable(g.loopById(layer.loopId)) && <FieldRow label="Background"><OffOn on={layer.bgOn !== false} onChange={(v) => set('bgOn', v)} /></FieldRow>}
    </Group>
  )
}

function ImageSource({ layer, patch }) {
  const fileRef = useRef(null)
  useEffect(() => {
    const on = (e) => { if (e.detail === layer.id) fileRef.current?.click() }
    window.addEventListener('kol:photo-replace', on)
    return () => window.removeEventListener('kol:photo-replace', on)
  }, [layer.id])
  const onPick = (e) => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => patch({ src: reader.result, srcType: 'image' })
    reader.readAsDataURL(file)
  }
  return (
    <Group label="Image">
      <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      {layer.src && (layer.srcType === 'video'
        ? <video src={layer.src} muted preload="metadata" className="aspect-video w-full rounded-inner" style={{ objectFit: layer.fit ?? 'cover' }} aria-label="Video preview" />
        : <div className="aspect-video rounded-inner" aria-label="Image preview" style={{ backgroundImage: `url("${layer.src}")`, backgroundSize: layer.fit ?? 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />)}
      <div className="flex items-center gap-2">
        <Button variant="outline" icon="upload" className="flex-1" onClick={() => fileRef.current?.click()}>{layer.src ? 'Replace' : 'Upload image'}</Button>
        {/* the media library dialog is the package's KOL-look window, not drawn here: the button is inert */}
        <Button variant="outline" className="flex-1" aria-disabled="true">Library</Button>
        {layer.src && <Button icon="trash" aria-label="Delete image" onClick={() => patch({ src: null, srcType: 'image' })} />}
      </div>
    </Group>
  )
}

const PARAMS_LABELS = { shape: () => 'Shape parameters', pattern: () => 'Pattern parameters', loop: (l) => `Loop, ${l.presetLabel ?? 'parameters'}`, misc: (l) => `Misc, ${l.presetLabel ?? 'parameters'}`, kinetic: (l) => `Kinetic, ${l.presetLabel ?? 'parameters'}` }

function LayerInspector({ layer }) {
  const { ungroupLayer } = useComposeState()
  const edit = useLayerEdit(layer.locked ? null : layer.id, { history: 'coalesce' })
  const positioned = !COVER_TYPES.includes(layer.type)
  const label = PARAMS_LABELS[layer.type]
  const children = Array.isArray(layer.children) ? layer.children.length : 0
  return (
    <Body>
      {positioned && <Transform layer={layer} edit={edit} />}
      <Appearance layer={layer} edit={edit} />
      {(layer.type === 'loop' || layer.type === 'misc') && pack('generators') && <LoopPreset layer={layer} set={edit.setProp} />}
      {layer.type === 'text' && <Group label="Typography"><p className="text-label text-faint">The type surface is not redrawn in the minimal style.</p></Group>}
      {layer.type === 'photo' && <ImageSource layer={layer} patch={edit.patch} />}
      {layer.type === 'path' && (
        <Group label="Path"><Segmented options={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }]} value={layer.closed ? 'closed' : 'open'} onChange={(v) => edit.setProp('closed', v === 'closed')} /></Group>
      )}
      {label && (
        <Group label="Parameters">
          <Button variant="outline" className="w-full" onClick={() => window.dispatchEvent(new CustomEvent(layer.type === 'pattern' ? 'kol:open-pattern' : 'kol:open-params'))}>{label(layer)}</Button>
        </Group>
      )}
      {layer.type === 'group' && (
        <Group label="Group">
          <FieldRow label="Children"><span className="font-mono text-label text-muted">{children} layer{children === 1 ? '' : 's'}</span></FieldRow>
          <Button variant="outline" className="w-full" onClick={() => ungroupLayer(layer.id)}>Ungroup</Button>
        </Group>
      )}
    </Body>
  )
}

