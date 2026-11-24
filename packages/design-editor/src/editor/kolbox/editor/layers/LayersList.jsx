import { useEffect, useRef, useState } from 'react'
import { findLayerDeep, rowLabelForLayer, setHoverLayer, useComposeState, useHoverLayer } from '../engine.js'
import Icon from '../../ui/Icon.jsx'
import { openLayerMenu } from './LayerMenu.jsx'
import { Button, Tooltip, TreeRow } from '@kolkrabbi/kol-component'

/* The Layers list (round 4, W1), the real LayerStack's behaviour (design-editor compose/LayerStackView.jsx) on kolbox's
   ListRow: the Canvas root row with its chevron, every layer one step inside it, a container's children one more, top
   of the z-order first. Per row: type icon, name, then the eye and the lock, shown only while the pointer is over the
   row, selected or not (W19.8); a hidden layer keeps its eye and a locked one its lock (lit) without hover. A hidden layer's icon and name dim. Click selects, shift or
   cmd click adds to or takes from the selection; double click renames in place (Enter or leaving the field commits,
   Escape cancels, an emptied name falls back to the type label); a right click opens the layer's menu (LayerMenu.jsx).
   THE DRAG is below (R5): into and out of frames and groups, and the z-order. Rows sit 8 apart (the file's LeftRail).
   Chevrons are focus chrome, as the real ones: hidden until the pointer is in the list. Under the rows, while two or
   more layers are selected, the real stack's own Group N button (its tooltip "Group N selected layers"). */
const CONTAINERS = ['group', 'bool']
/* the Layers header's collapse-all (W19.4): every group in the list closes; the Canvas root stays open, so the top
   level still shows (decided for review) */
const COLLAPSE_ALL = 'kolbox:layers-collapse-all'
export const collapseAllLayers = () => window.dispatchEvent(new CustomEvent(COLLAPSE_ALL))
const isContainer = (l) => CONTAINERS.includes(l.type) && Array.isArray(l.children)

/* the eye and the lock: 20 square in the 24 row, 12 glyphs as the real toggles */
function Toggle({ icon, label, pinned, on, onClick }) {
  return (
    <Tooltip variant="kolbox" label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={on}
        onClick={onClick}
        className={`flex size-5 items-center justify-center rounded-control outline-none hover:bg-field hover:text-text focus-visible:opacity-100 ${on ? 'text-accent' : 'text-muted'} ${pinned ? '' : 'opacity-0 group-hover/row:opacity-100'}`}
      >
        <Icon name={icon} size={12} />
      </button>
    </Tooltip>
  )
}

function LayerRow({ layer, depth, iconFor, selected, tinted, open, onToggle, drag, drop }) {
  const { select, toggleSelection, toggleLayer, toggleLayerLock, updateLayer } = useComposeState()
  const [renaming, setRenaming] = useState(false)
  const cancel = useRef(false)
  const hidden = layer.visible === false
  const hovered = useHoverLayer() === layer.id && !selected
  const commit = (value) => {
    if (!cancel.current) updateLayer(layer.id, { name: value.trim() || null })
    cancel.current = false
    setRenaming(false)
  }
  return (
    <div
      data-layer-id={layer.id}
      data-layers-row={layer.id}
      onPointerDown={renaming ? undefined : (e) => drag.down(e, layer.id)}
      onClickCapture={drag.swallowClick}
      onContextMenu={(e) => { e.preventDefault(); openLayerMenu(layer.id, e.clientX, e.clientY) }}
      onPointerEnter={() => setHoverLayer(layer.id)}
      onPointerLeave={() => setHoverLayer(null)}
      data-hover={hovered || undefined}
      className={`group/row relative rounded-control ${tinted && !selected ? 'bg-hover' : ''} ${drag.dragging === layer.id ? 'opacity-40' : ''}
        ${drop === 'above' ? 'before:absolute before:inset-x-1 before:-top-px before:z-10 before:h-0.5 before:bg-accent' : ''}
        ${drop === 'below' ? 'after:absolute after:inset-x-1 after:-bottom-px after:z-10 after:h-0.5 after:bg-accent' : ''}
        ${drop === 'into' ? 'outline-1 -outline-offset-1 outline-accent outline-solid' : ''}`}
    >
      {renaming ? (
        /* the field in the row's own place: the lead kept, the name a field; its keys stop here (no tool key, no
           canvas verb sees them) */
        <div className="flex h-6 items-center gap-2 rounded-control bg-field pr-2" style={{ paddingLeft: `calc(var(--kol-spacing-1-5) + ${depth} * var(--spacing-6))` }}>
          <span className="relative h-4 w-8 shrink-0"><Icon name={iconFor(layer)} className="absolute top-0 right-0" /></span>
          <input
            autoFocus
            aria-label="Layer name"
            defaultValue={layer.name ?? ''}
            placeholder={rowLabelForLayer({ ...layer, name: null })}
            onFocus={(e) => e.target.select()}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') e.currentTarget.blur()
              else if (e.key === 'Escape') { cancel.current = true; e.currentTarget.blur() }
            }}
            className="-ml-1 h-5 min-w-0 flex-1 rounded-control bg-transparent px-1 text-section text-text outline-1 outline-accent outline-solid placeholder:text-muted"
          />
        </div>
      ) : (
        <TreeRow variant="kolbox"
          tree
          icon={iconFor(layer)}
          label={rowLabelForLayer(layer)}
          depth={depth}
          expanded={open}
          onToggle={onToggle}
          active={selected}
          dimmed={hidden}
          className={hovered ? 'bg-field' : ''}
          onClick={(e) => (e.shiftKey || e.metaKey ? toggleSelection(layer.id) : select(layer.id))}
          onDoubleClick={() => setRenaming(true)}
          trailing={<span className="w-10 shrink-0" />}
        />
      )}
      {!renaming && (
        <span className="absolute inset-y-0 right-0.5 flex items-center">
          <Toggle icon={hidden ? 'eye-off' : 'eye-on'} label={hidden ? 'Show' : 'Hide'} on={false} pinned={hidden} onClick={() => toggleLayer(layer.id)} />
          <Toggle icon={layer.locked ? 'lock' : 'unlock'} label={layer.locked ? 'Unlock' : 'Lock'} on={!!layer.locked} pinned={!!layer.locked} onClick={() => toggleLayerLock(layer.id)} />
        </span>
      )}
    </div>
  )
}

/* FRAMES AS OBJECTS (plan-2026-11-19-kolbox-whats-left C1): the Canvas root row is gone. A frame is a row like any
   layer (its name, eye, lock, rename, menu, drag), its layers one step inside it under its chevron; a layer on the page
   sits at the top level. A frame's layers stay top-level layers in the engine (they carry its `frameId`); a drop moves a
   layer into a frame, out to the page, or among the rows (THE DRAG below, R5). */
export default function LayersList({ iconFor }) {
  const { layers, selectedIds, reparentLayer, groupLayers, placeLayer, updateLayer, beginTransaction, commitTransaction } = useComposeState()
  /* frames are not grouped (C1) */
  const picked = selectedIds.filter((id) => id !== 'canvas' && layers.find((l) => l.id === id)?.type !== 'frame')
  const [shut, setShut] = useState(() => new Set())
  const toggle = (id) => setShut((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const all = useRef([]); all.current = layers
  useEffect(() => {
    const ids = (list, out = []) => { for (const l of list) if (isContainer(l)) { out.push(l.id); ids(l.children, out) } return out }
    const on = () => setShut(new Set(ids(all.current)))
    window.addEventListener(COLLAPSE_ALL, on)
    return () => window.removeEventListener(COLLAPSE_ALL, on)
  }, [])

  /* THE DRAG (R5, his "nothing pushes inside layer"), on pointer events with capture: a press on a row and 4 px of travel
     lift it; the drop place is read from the rows' boxes under the pointer: a line between rows, or a frame's (or a
     group's) row outlined for "into" (a frame's middle half, a group's middle third; under an open frame's row is its
     top). Release drops, Escape cancels. One undo step either way: frames go through the engine's placeLayer (the
     frame set, the z-order moved, a frame carrying its members), groups through reparentLayer as before. */
  const [dragging, setDragging] = useState(null)
  const [target, setTarget] = useState(null)
  const [position, setPosition] = useState(null)
  const parentOf = useRef(new Map())
  const listRef = useRef(null)
  const live = useRef({}); live.current = { layers, target, position, shut }
  const swallow = useRef(false)
  const subtreeHas = (rootId, id) => { const d = findLayerDeep(live.current.layers, rootId); return d != null && findLayerDeep([d], id) != null }
  /* the drop place under a client y, or null where nothing may land */
  const placeAt = (dragId, y) => {
    const rows = [...(listRef.current?.querySelectorAll('[data-layers-row]') ?? [])]
    if (!rows.length) return null
    let row = rows.find((r) => { const b = r.getBoundingClientRect(); return y >= b.top && y < b.bottom })
    if (!row) row = y < rows[0].getBoundingClientRect().top ? rows[0] : rows[rows.length - 1]
    const id = row.getAttribute('data-layers-row')
    const all = live.current.layers
    const me = findLayerDeep(all, dragId), t = findLayerDeep(all, id)
    if (!me || !t || id === dragId || subtreeHas(dragId, id) || (me.type === 'frame' && t.frameId === dragId)) return null
    const b = row.getBoundingClientRect(), f = (y - b.top) / b.height
    if (t.type === 'frame' && me.type !== 'frame') {
      if (f > 0.25 && f < 0.75) return { id, pos: 'into' }
      const open = !live.current.shut.has(id) && all.some((l) => l.frameId === id)
      if (f >= 0.75 && open) return { id, pos: 'into' }
    }
    if (CONTAINERS.includes(t.type) && f > 1 / 3 && f < 2 / 3) return { id, pos: 'into' }
    return { id, pos: f < 0.5 ? 'above' : 'below' }
  }
  const commit = (dragId, id, pos) => {
    const all = live.current.layers
    const t = findLayerDeep(all, id)
    const fromGroup = parentOf.current.get(dragId) != null, toGroup = parentOf.current.get(id) != null
    if (!(fromGroup || toGroup || (pos === 'into' && CONTAINERS.includes(t?.type)))) return placeLayer(dragId, id, pos)
    /* a group's children: the old one drop path, the index in the target container's order without the dragged layer */
    beginTransaction()
    if (pos === 'into') {
      reparentLayer(dragId, id, (t.children ?? []).filter((l) => l.id !== dragId).length)
    } else {
      const parentId = parentOf.current.get(id) ?? null
      const list = (parentId ? findLayerDeep(all, parentId)?.children ?? [] : all).filter((l) => l.id !== dragId)
      const at = list.findIndex((l) => l.id === id)
      /* the list renders reversed: visually above is one past the target */
      if (at >= 0) reparentLayer(dragId, parentId, pos === 'above' ? at + 1 : at)
      if (!parentId) updateLayer(dragId, { frameId: t.type === 'frame' ? null : t.frameId ?? null })
    }
    commitTransaction()
  }
  const clear = () => { setDragging(null); setTarget(null); setPosition(null) }
  const drag = {
    dragging,
    swallowClick: (e) => { if (swallow.current) { swallow.current = false; e.stopPropagation(); e.preventDefault() } },
    down: (e, id) => {
      if (e.button !== 0 || e.target.closest('button[aria-pressed], input')) return
      const row = e.currentTarget, pid = e.pointerId, x0 = e.clientX, y0 = e.clientY
      let lifted = false
      const move = (ev) => {
        if (ev.pointerId !== pid) return
        if (!lifted) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 4) return
          lifted = true
          row.setPointerCapture?.(pid)
          document.documentElement.style.cursor = 'grabbing'
          setDragging(id)
        }
        const p = placeAt(id, ev.clientY)
        setTarget(p?.id ?? null); setPosition(p?.pos ?? null)
      }
      const end = (drop) => (ev) => {
        if (ev.pointerId !== undefined && ev.pointerId !== pid) return
        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', up)
        document.removeEventListener('pointercancel', cancel)
        document.removeEventListener('keydown', esc, true)
        document.documentElement.style.cursor = ''
        if (lifted) {
          swallow.current = true
          setTimeout(() => { swallow.current = false }, 0)
          const { target: tid, position: pos } = live.current
          if (drop && tid && pos) commit(id, tid, pos)
        }
        clear()
      }
      const up = end(true), cancel = end(false)
      const esc = (ev) => {
        if (ev.key !== 'Escape' || !lifted) return
        ev.preventDefault(); ev.stopPropagation()
        cancel(ev)
      }
      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
      document.addEventListener('pointercancel', cancel)
      document.addEventListener('keydown', esc, true)
    },
  }

  parentOf.current = new Map()
  /* the page's frames: a frame's layers draw under its row (C1) */
  const frameIds = new Set(layers.filter((l) => l.type === 'frame').map((l) => l.id))
  const rows = (list, depth, parentId, frameId = null) => [...list].reverse().flatMap((l) => {
    /* top level: a frame's layers are listed under the frame, not here */
    if (parentId == null && frameId == null && frameIds.has(l.frameId)) return []
    parentOf.current.set(l.id, parentId)
    const framed = l.type === 'frame' ? layers.filter((m) => m.frameId === l.id) : null
    const kids = isContainer(l) ? l.children : framed
    return [
      <LayerRow
        key={l.id}
        layer={l}
        depth={depth}
        iconFor={iconFor}
        selected={selectedIds.includes(l.id)}
        tinted={selectedIds.includes(parentId ?? frameId)}
        open={kids ? !shut.has(l.id) : undefined}
        onToggle={kids ? () => toggle(l.id) : undefined}
        drag={drag}
        drop={target === l.id ? position : null}
      />,
      ...(kids && !shut.has(l.id) ? (framed ? rows(kids, depth + 1, null, l.id) : rows(kids, depth + 1, l.id)) : []),
    ]
  })

  return (
    <div ref={listRef} className="flex flex-col gap-2 [&_span[role=button]]:opacity-0 [&_span[role=button]]:transition-opacity hover:[&_span[role=button]]:opacity-100" data-layers-list>
      {rows(layers, 0, null)}
      {picked.length >= 2 && (
        <div className="relative mt-3 pt-3 before:absolute before:-inset-x-4 before:top-0 before:h-px before:bg-border">
          <Tooltip variant="kolbox" label={`Group ${picked.length} selected layers`}>
            <Button variant="kolbox" iconLeft="layers" onClick={() => groupLayers(picked)}>Group {picked.length}</Button>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
