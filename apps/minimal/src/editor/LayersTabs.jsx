import { useEffect, useRef, useState } from 'react'
import {
  bucketOptions, buildLayersSvg, CANVAS_H, CANVAS_W, canMask, DEFAULT_BUCKET, findLayerDeep, isImageType, KOL_LOGO_NATURAL_DIMS,
  KOL_LOGO_VARIANTS, KolLogo, layerTypes, listMedia, mediaSrc, resolveColor, rowLabelForLayer, useComposeState, useZoom,
} from './engine.js'
import { AdjustmentRows, LiveFilterRows } from './Menus.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Segmented from '../ui/Segmented.jsx'
import Slider from '../ui/Slider.jsx'
import { MenuButton, MenuNest, MenuRow } from '../ui/Menu.jsx'

/* The left rail's second pane, as the real one is: Layers (with its bar of actions), Assets, History, Navigator. */

const TYPE_ICONS = { background: 'square', pattern: 'ptrn-dot', photo: 'image', shape: 'rectangle', text: 'type', group: 'layers', bool: 'layers', path: 'pen', loop: 'refresh', misc: 'refresh', kinetic: 'type' }
const iconFor = (type) => TYPE_ICONS[type] ?? 'rectangle'
const SHAPE_KINDS = [
  { id: 'logo', label: 'Logo', icon: 'rectangle', extras: {} },
  { id: 'rect', label: 'Rectangle', icon: 'rectangle', extras: { kind: 'rect' } },
  { id: 'ellipse', label: 'Ellipse', icon: 'circle', extras: { kind: 'ellipse' } },
  { id: 'triangle', label: 'Triangle', icon: 'triangle', extras: { kind: 'triangle' } },
  { id: 'polygon', label: 'Polygon', icon: 'polygon', extras: { kind: 'polygon', sides: 5 } },
  { id: 'star', label: 'Star', icon: 'star', extras: { kind: 'star', points: 5, innerRatio: 0.5 } },
]

/* ── Layers ── the canvas row, then the layers topmost first; a group's children under it */
/* the chevron that collapses a container's rows (the canvas row's collapses the whole list); a row without one keeps
   its slot */
function Chevron({ collapsed, onToggle, what }) {
  return (
    <button type="button" aria-expanded={!collapsed} aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${what}`} onClick={onToggle}
      className="flex size-5 shrink-0 items-center justify-center text-faint outline-none hover:text-fg">
      <Icon name="chevron-down" size={12} className={collapsed ? '-rotate-90' : ''} />
    </button>
  )
}

function LayerRow({ layer, depth, selected, onSelect, onToggleSelect, onVisible, onLock, onRename, chevron }) {
  const [editing, setEditing] = useState(false)
  const name = rowLabelForLayer(layer)
  return (
    <div data-layer-id={layer.id} className={`flex h-8 shrink-0 items-center gap-1 rounded-nav pr-0.5 ${selected ? 'bg-field-hover' : 'hover:bg-field'}`} style={{ paddingLeft: depth * 16 }}>
      {chevron ?? <span className="size-5 shrink-0" />}
      {editing ? (
        <input autoFocus defaultValue={name} aria-label="Layer name" className="h-7 min-w-0 flex-1 rounded-inner bg-field px-2 text-nav text-fg outline-none"
          onBlur={(e) => { setEditing(false); if (e.target.value.trim() && e.target.value !== name) onRename(e.target.value.trim()) }}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditing(false) }} />
      ) : (
        <button type="button" onClick={(e) => (e.shiftKey ? onToggleSelect() : onSelect())} onDoubleClick={() => setEditing(true)}
          className={`flex h-8 min-w-0 flex-1 items-center gap-2 rounded-nav px-2 text-left text-nav outline-none focus-visible:outline-1 focus-visible:outline-fg ${layer.visible === false ? 'text-faint' : 'text-fg'}`}>
          <Icon name={iconFor(layer.type)} />
          <span className="flex-1 truncate">{name}</span>
        </button>
      )}
      <Button icon={layer.visible === false ? 'eye-off' : 'eye-on'} aria-label={layer.visible === false ? 'Show' : 'Hide'} onClick={onVisible} />
      <Button icon={layer.locked ? 'lock' : 'unlock'} aria-label={layer.locked ? 'Unlock' : 'Lock'} onClick={onLock} />
    </div>
  )
}

export function LayersTab() {
  const { layers, selectedIds, select, selectCanvas, toggleSelection, toggleLayer, toggleLayerLock, updateLayer } = useComposeState()
  const [shut, setShut] = useState(() => new Set())
  const toggle = (id) => setShut((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const container = (l) => (l.type === 'group' || l.type === 'bool') && Array.isArray(l.children)
  const rows = (list, depth) => [...list].reverse().flatMap((l) => [
    <LayerRow key={l.id} layer={l} depth={depth} selected={selectedIds.includes(l.id)} onSelect={() => select(l.id)} onToggleSelect={() => toggleSelection(l.id)}
      onVisible={() => toggleLayer(l.id)} onLock={() => toggleLayerLock(l.id)} onRename={(name) => updateLayer(l.id, { name })}
      chevron={container(l) ? <Chevron collapsed={shut.has(l.id)} onToggle={() => toggle(l.id)} what="group" /> : null} />,
    ...(container(l) && !shut.has(l.id) ? rows(l.children, depth + 1) : []),
  ])
  /* a row's right-click opens the canvas's own layer menu */
  const onContext = (e) => {
    const id = e.target.closest?.('[data-layer-id]')?.dataset?.layerId
    if (!id) return
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('kol:layer-context', { detail: { id, x: e.clientX, y: e.clientY } }))
  }
  return (
    <nav className="flex flex-col gap-1 p-2" onContextMenu={onContext}>
      <div className={`flex h-8 items-center rounded-nav ${selectedIds.includes('canvas') ? 'bg-field-hover' : 'hover:bg-field'}`}>
        <Chevron collapsed={shut.has('canvas')} onToggle={() => toggle('canvas')} what="layers" />
        <button type="button" onClick={selectCanvas} className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-nav px-2 text-left text-nav text-fg outline-none focus-visible:outline-1 focus-visible:outline-fg">
          <Icon name="maximize" />Canvas
        </button>
      </div>
      {!shut.has('canvas') && rows(layers, 1)}
    </nav>
  )
}

/* the bar: Add and Group, then FX, Mask, Adjustment and Live Filter for the selection, then Duplicate and Delete */
export function LayerActions() {
  const { selectedIds, layers, deleteSelected, duplicateLayer, groupLayers, addLayer, updateLayer, beginTransaction, commitTransaction } = useComposeState()
  const ids = (selectedIds ?? []).filter((id) => id !== 'canvas')
  const sel = ids.map((id) => findLayerDeep(layers, id)).filter(Boolean)
  const none = sel.length === 0
  const one = sel.length === 1 ? sel[0] : null
  const top = sel.length === 2 ? [...sel].sort((a, b) => layers.findIndex((l) => l.id === b.id) - layers.findIndex((l) => l.id === a.id)) : null
  const canMaskPair = !!top && top.every((l) => layers.some((x) => x.id === l.id)) && canMask(top[0]) && !top[1].isMask
  const canMaskOne = !!one && !one.isMask && !one.maskedBy && layers.some((x) => x.id === one.id) && one.w != null
  const onMask = () => {
    beginTransaction()
    if (canMaskPair) { updateLayer(top[0].id, { isMask: true }); updateLayer(top[1].id, { maskedBy: top[0].id }) } else if (canMaskOne) {
      const m = addLayer('shape', { kind: 'rect', x: one.x ?? 0, y: one.y ?? 0, w: one.w, h: one.h, isMask: true, name: 'Mask' })
      if (m) updateLayer(one.id, { maskedBy: m })
    }
    commitTransaction()
  }
  return (
    <div className="flex shrink-0 items-center gap-0.5 border-t border-line px-2 py-1">
      <MenuButton icon="plus" ariaLabel="Add layer" place="above" width={180}>
        {layerTypes().map((t) => (t.id === 'shape' ? (
          <MenuNest key={t.id} icon={iconFor(t.id)} label={t.label} width={160}>
            {SHAPE_KINDS.map((k) => <MenuRow key={k.id} icon={k.icon} onClick={() => addLayer(t.id, k.extras)}>{k.label}</MenuRow>)}
          </MenuNest>
        ) : <MenuRow key={t.id} icon={iconFor(t.id)} onClick={() => addLayer(t.id)}>{t.label}</MenuRow>))}
      </MenuButton>
      <Button icon="folder" aria-label="Group" title="Group" disabled={sel.length < 2} onClick={() => groupLayers(ids)} />
      <span className="mx-1 h-4 w-px bg-line" />
      <Button aria-label="Layer Effects" title="Layer Effects" disabled={!one} className="!w-7 !px-0 font-semibold" onClick={() => window.dispatchEvent(new CustomEvent('kol:open-layer-effects'))}>FX</Button>
      <Button icon="mask" aria-label="Mask Layer" title="Mask Layer" disabled={!(canMaskPair || canMaskOne)} onClick={onMask} />
      <MenuButton icon="brightness" ariaLabel="Adjustment" place="above" width={220} disabled={none}><AdjustmentRows /></MenuButton>
      <MenuButton icon="filter" ariaLabel="Live Filter" place="above" width={220} disabled={none}><LiveFilterRows /></MenuButton>
      <span className="flex-1" />
      <Button icon="copy" aria-label="Duplicate" title="Duplicate" disabled={none} onClick={() => sel.forEach((l) => duplicateLayer(l.id))} />
      <Button icon="trash" aria-label="Delete" title="Delete" disabled={none} onClick={deleteSelected} />
    </div>
  )
}

/* ── Assets ── the four logos (list or grid) and the bucket's first images; a press inserts one */
const VIEWS = [{ value: 'list', ariaLabel: 'List view', label: <span className="flex justify-center"><Icon name="view-list" size={14} /></span> }, { value: 'grid', ariaLabel: 'Grid view', label: <span className="flex justify-center"><Icon name="grid" size={14} /></span> }]
function Images() {
  const { addLayer } = useComposeState()
  const [state, setState] = useState({ status: 'loading', items: [], bucket: null })
  useEffect(() => {
    const ac = new AbortController()
    const bucket = bucketOptions()[0]?.value ?? DEFAULT_BUCKET
    listMedia('', { bucket, signal: ac.signal })
      .then((objs) => setState({ status: 'ready', bucket, items: objs.filter((o) => isImageType(o.contentType)).slice(0, 12) }))
      .catch((e) => { if (e.name !== 'AbortError') setState({ status: 'error', items: [], bucket }) })
    return () => ac.abort()
  }, [])
  if (state.status === 'error' || (state.status === 'ready' && !state.items.length)) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-label text-muted">Images</p>
      {state.status === 'loading' ? <p className="text-label text-faint">Loading…</p> : (
        <div className="grid grid-cols-3 gap-2">
          {state.items.map((o) => (
            <button key={o.key} type="button" onClick={() => addLayer('photo', { src: mediaSrc(o.key, state.bucket), fit: 'cover' })} className="flex min-w-0 flex-col gap-1 text-left outline-none">
              <img src={mediaSrc(o.key, state.bucket)} alt="" loading="lazy" className="aspect-square w-full rounded-inner bg-field object-cover" />
              <span className="truncate font-mono text-caps text-muted">{o.key.split('/').pop()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export function AssetsTab() {
  const { addLayer } = useComposeState()
  const [view, setView] = useState('list')
  const insert = (variant) => {
    const d = KOL_LOGO_NATURAL_DIMS[variant] ?? { w: 320, h: 320 }
    addLayer('shape', { variant, x: (CANVAS_W - d.w) / 2, y: (CANVAS_H - d.h) / 2, w: d.w, h: d.h })
  }
  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-label text-muted">Logos</p>
        <Segmented className="w-20" options={VIEWS} value={view} onChange={setView} />
      </div>
      <div className={view === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-col'}>
        {KOL_LOGO_VARIANTS.map((v) => (
          <button key={v} type="button" onClick={() => insert(v)}
            className={`flex min-w-0 rounded-nav text-left outline-none hover:bg-field ${view === 'grid' ? 'flex-col gap-1 p-1' : 'h-10 items-center gap-3 px-1'}`}>
            <span className={`block shrink-0 rounded-inner bg-field text-fg ${view === 'grid' ? 'aspect-[4/3] w-full p-3' : 'h-6 w-8 p-1'}`}><KolLogo variant={v} className="block h-full w-full" /></span>
            <span className="truncate font-mono text-label text-fg">{v}</span>
          </button>
        ))}
      </div>
      <Images />
    </div>
  )
}

/* ── History ── every state from Open; a press walks undo or redo to it */
function describe(a, b) {
  const before = new Map(a.layers.map((l) => [l.id, l]))
  const after = new Map(b.layers.map((l) => [l.id, l]))
  const added = b.layers.find((l) => !before.has(l.id))
  if (added) return `Add ${rowLabelForLayer(added)}`
  const removed = a.layers.find((l) => !after.has(l.id))
  if (removed) return `Delete ${rowLabelForLayer(removed)}`
  const changed = b.layers.find((l) => before.get(l.id) !== l)
  if (changed) {
    const was = before.get(changed.id)
    const keys = Object.keys({ ...was, ...changed }).filter((k) => was[k] !== changed[k])
    return `${keys.every((k) => k === 'x' || k === 'y') ? 'Move' : 'Edit'} ${rowLabelForLayer(changed)}`
  }
  if (a.layers.map((l) => l.id).join() !== b.layers.map((l) => l.id).join()) return 'Reorder layers'
  return 'Select'
}
export function HistoryTab() {
  const { historyPast: past, historyFuture: future, layers, selectedIds, undo, redo } = useComposeState()
  const states = [...past, { layers, selectedIds }, ...future]
  const current = past.length
  const goTo = (i) => { for (let k = current; k > i; k--) undo(); for (let k = current; k < i; k++) redo() }
  if (states.length === 1) return <p className="px-4 py-3 text-label text-faint">No history yet.</p>
  return (
    <ul className="flex flex-col p-2">
      {states.map((st, i) => (
        <li key={i}>
          <button type="button" onClick={() => goTo(i)}
            className={`flex h-7 w-full items-center truncate rounded-inner px-2 text-left text-label outline-none ${i === current ? 'bg-field-hover text-fg' : i > current ? 'text-faint hover:bg-field' : 'text-muted hover:bg-field'}`}>
            {i === 0 ? 'Open' : describe(states[i - 1], st)}
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ── Navigator ── the zoom row, then the document's thumbnail with the visible region; dragging the region pans */
function visibleRegion() {
  const frame = document.querySelector('main.kol-editor-canvas [data-canvas-frame]')
  const pane = document.querySelector('main.kol-editor-canvas')
  if (!frame || !pane) return null
  const F = frame.getBoundingClientRect(), M = pane.getBoundingClientRect()
  if (!F.width || !F.height) return null
  return { x: (M.left - F.left) / F.width, y: (M.top - F.top) / F.height, w: M.width / F.width, h: M.height / F.height, fw: F.width }
}
function zoomBy(factor) {
  const pane = document.querySelector('main.kol-editor-canvas')?.getBoundingClientRect()
  if (!pane || !Number.isFinite(factor) || factor <= 0) return
  window.dispatchEvent(new CustomEvent('kol:zoom-at', { detail: { clientX: pane.left + pane.width / 2, clientY: pane.top + pane.height / 2, factor } }))
}
export function NavigatorTab() {
  const { layers, palette, aspect, canvasRatio, canvasW, canvasH, canvasFill, canvasFillOpacity } = useComposeState()
  const zoom = useZoom()
  const ratio = canvasW && canvasH ? canvasW / canvasH : 1
  const fillRef = resolveColor(canvasFill, palette)
  const fill = fillRef ? (canvasFillOpacity < 1 ? `color-mix(in srgb, ${fillRef} ${Math.round(canvasFillOpacity * 100)}%, transparent)` : fillRef) : 'transparent'
  const args = useRef(null)
  args.current = { layers, palette, aspect, customRatio: canvasRatio, canvasW, canvasH }
  const [src, setSrc] = useState(null)
  useEffect(() => {
    const take = () => { try { setSrc(`data:image/svg+xml;utf8,${encodeURIComponent(buildLayersSvg(args.current))}`) } catch { /* keep the last frame */ } }
    take()
    const id = setInterval(take, 500)
    return () => clearInterval(id)
  }, [layers, palette, aspect, canvasRatio, canvasW, canvasH])
  const [view, setView] = useState(visibleRegion)
  useEffect(() => { const id = setInterval(() => setView(visibleRegion()), 100); return () => clearInterval(id) }, [])
  const box = useRef(null)
  const onDown = (e) => {
    e.preventDefault()
    let last = { x: e.clientX, y: e.clientY }
    const stage = document.querySelector('main.kol-editor-canvas [data-tool]')
    const move = (ev) => {
      const r = visibleRegion(); const bw = box.current?.getBoundingClientRect().width
      if (!r || !bw) return
      const k = r.fw / bw
      stage?.dispatchEvent(new WheelEvent('wheel', { deltaX: (ev.clientX - last.x) * k, deltaY: (ev.clientY - last.y) * k, bubbles: true, cancelable: true }))
      last = { x: ev.clientX, y: ev.clientY }
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  const pct = Math.round(zoom * 100)
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Button icon="minus" aria-label="Zoom out" onClick={() => zoomBy(0.8)} />
        <Slider value={Math.min(800, Math.max(10, pct))} min={10} max={800} step={1} readout={false} onChange={(next) => zoomBy(next / pct)} />
        <InputNumber value={pct} chars={4} aria-label="Zoom" onCommit={(s) => { const n = Number(s); if (n > 0) zoomBy(n / pct) }} />
        <Button icon="plus" aria-label="Zoom in" onClick={() => zoomBy(1.25)} />
      </div>
      <div className="flex h-[200px] items-center justify-center">
        <div ref={box} className="relative overflow-hidden rounded-inner" style={{ aspectRatio: ratio, width: `min(100%, ${Math.round(200 * ratio)}px)`, background: fill }}>
          {src && <img src={src} alt="" className="block h-full w-full" draggable={false} />}
          {view && <div role="presentation" onPointerDown={onDown} className="absolute cursor-grab bg-fg/10 outline-[1.5px] outline-fg outline-solid active:cursor-grabbing"
            style={{ left: `${view.x * 100}%`, top: `${view.y * 100}%`, width: `${view.w * 100}%`, height: `${view.h * 100}%` }} />}
        </div>
      </div>
    </div>
  )
}
