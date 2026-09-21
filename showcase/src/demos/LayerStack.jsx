import { useState } from 'react'
import { LayerStack, AddLayerButton, findLayerDeep } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* A real tree in state so every gesture works: click / shift-click select,
 * drag a row onto another to reorder, drag INTO a group's children to
 * reparent, double-click a name to rename, hover for the eye and lock.
 * The stack emits intent; this demo is the store (editor-panels-the-held-specs A1). */
const SEED = [
  { id: 'bg', type: 'background', visible: true },
  { id: 'g1', type: 'group', visible: true, children: [
    { id: 'p1', type: 'photo', visible: true },
    { id: 's1', type: 'shape', kind: 'rect', visible: true },
  ] },
  { id: 't1', type: 'text', text: 'Headline', visible: true, locked: true },
  { id: 'l1', type: 'loop', presetLabel: 'Penrose', visible: false },
]

/* remove a layer from wherever it sits, return [tree, layer] */
const pluck = (tree, id) => {
  let hit = null
  const walk = (list) => list.flatMap((l) => {
    if (l.id === id) { hit = l; return [] }
    return [l.children ? { ...l, children: walk(l.children) } : l]
  })
  return [walk(tree), hit]
}
const insert = (tree, parentId, index, layer) => {
  if (parentId == null) { const t = [...tree]; t.splice(index, 0, layer); return t }
  return tree.map((l) => l.id === parentId
    ? { ...l, children: (() => { const c = [...(l.children ?? [])]; c.splice(index, 0, layer); return c })() }
    : l.children ? { ...l, children: insert(l.children, parentId, index, layer) } : l)
}
const patch = (tree, id, fn) => tree.map((l) => l.id === id ? fn(l) : l.children ? { ...l, children: patch(l.children, id, fn) } : l)

export default function LayerStackDemo() {
  const [layers, setLayers] = useState(SEED)
  const [sel, setSel] = useState(['t1'])
  let n = 0

  return (
    <div className="flex w-72 flex-col rounded border border-fg-08 bg-surface-secondary">
      <div className="flex items-center justify-between px-3 h-9 border-b border-fg-08">
        <span className="kol-helper-12 text-meta">Layers</span>
        <AddLayerButton
          types={[{ id: 'photo', label: 'Photo' }, { id: 'shape', label: 'Shape' }, { id: 'text', label: 'Text' }]}
          nested={{ typeId: 'shape', kinds: [{ id: 'rect', label: 'Rectangle', extras: { kind: 'rect' } }, { id: 'ellipse', label: 'Ellipse', extras: { kind: 'ellipse' } }] }}
          onAdd={(type, extras) => setLayers((t) => [...t, { id: `${type}-${Date.now()}`, type, visible: true, ...extras }])}
        />
      </div>
      <LayerStack
        layers={layers}
        selectedIds={sel}
        onSelect={(id) => setSel([id])}
        onToggleSelect={(id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])}
        onSelectCanvas={() => setSel(['canvas'])}
        onToggleVisible={(id) => setLayers((t) => patch(t, id, (l) => ({ ...l, visible: !l.visible })))}
        onToggleLocked={(id) => setLayers((t) => patch(t, id, (l) => ({ ...l, locked: !l.locked })))}
        onRename={(id, name) => setLayers((t) => patch(t, id, (l) => ({ ...l, name })))}
        onReorder={(id, parentId, index) => setLayers((t) => { const [rest, layer] = pluck(t, id); return layer ? insert(rest, parentId, index, layer) : t })}
        onGroup={(ids) => setLayers((t) => {
          let rest = t; const kids = []
          for (const id of ids) { const [r, l] = pluck(rest, id); rest = r; if (l) kids.push(l) }
          return [...rest, { id: `g-${++n}-${Date.now()}`, type: 'group', visible: true, children: kids }]
        })}
      />
    </div>
  )
}
