import { useEffect, useMemo, useRef, useState } from 'react'
import { canMask, findLayerDeep, getClip, layerFamily, resolveColor, useComposeState, useGeneratorLibrary } from '../engine.js'
import { openRailTab } from '../Properties.jsx'
import { askPrompt } from '../../ui/ask.js'
import { Menu } from '@kolkrabbi/kol-component'

/* The right-click menu of a layer, on its row and on the canvas (round 4, W1): the real CanvasArea's CanvasMenuItems,
   the same rows in the same order for the same layer types, each running the engine's own write; empty canvas gets
   Undo and Redo. One host answers both: a row asks with openLayerMenu, the canvas's own contextmenu is taken in the
   capture phase so the engine's kol-component menu never opens under kolbox's. A layer not in the selection is
   selected first (the real rule). The rows the real one sends to its rail tabs (Parameters, Add effect, Pattern
   parameters, Morph…) ask kolbox's right rail for the tab, as MenuBar's Window › Right rail rows do. ONE LIST for the
   canvas and the row, as Figma's (read 2026-11-19): the row's menu adds Rename, the canvas's does not. */
const OPEN = 'kolbox:layer-menu'
export const openLayerMenu = (id, x, y) => window.dispatchEvent(new CustomEvent(OPEN, { detail: { id, x, y, row: true } }))

/* CanvasArea's CONVERTIBLE_KINDS (not exported by the engine): the primitives a path can be made from */
const CONVERTIBLE_KINDS = new Set(['rect', 'ellipse', 'triangle', 'polygon', 'star', 'line'])

function useRows(layer, onReplace, at, onRow = false) {
  const {
    layers, palette, duplicateLayer, removeLayer, toggleLayer, toggleLayerLock, updateLayer, flattenSelected, releaseBoolean,
    flattenText, convertShapeToPath, beginTransaction, commitTransaction, undo, redo, canUndo, canRedo,
    selectedIds, moveLayer, groupLayers, flipLayer, copySelected, pasteLayers,
  } = useComposeState()
  const { saveType } = useGeneratorLibrary()
  const send = (event, detail) => () => window.dispatchEvent(new CustomEvent(event, detail !== undefined ? { detail } : undefined))
  /* THE CLIPBOARD (C4.4, design-editor compose/clipboard.js): Copy and Cut keep the selection in the app and put its
     words on the system clipboard; Paste puts a copy in place, Paste here at the pointer, each in the frame under it */
  const toSystem = (clip) => { try { if (clip) navigator.clipboard?.writeText(clip.text)?.catch(() => {}) } catch { /* not allowed: the app's clip still holds it */ } }
  const noClip = !getClip()
  const paste = [
    { label: 'Paste', run: () => pasteLayers(), disabled: noClip },
    { label: 'Paste here', run: () => pasteLayers({ client: at }), disabled: noClip || !at },
  ]
  if (!layer) return [[{ label: 'Undo', run: undo, disabled: !canUndo }, { label: 'Redo', run: redo, disabled: !canRedo }], paste]
  const clipRows = [
    { label: 'Copy', run: () => toSystem(copySelected()) },
    { label: 'Cut', run: () => toSystem(copySelected({ cut: true })), disabled: !!layer.locked },
    ...paste,
  ]

  /* CanvasArea's mask ops (G8): the layer directly below a top-level layer, and the two writes */
  const i = layers.findIndex((l) => l.id === layer.id)
  const below = i > 0 ? layers[i - 1] : null
  const useAsMask = () => { beginTransaction(); updateLayer(layer.id, { isMask: true }); updateLayer(below.id, { maskedBy: layer.id }); commitTransaction() }
  const releaseMask = () => {
    beginTransaction()
    updateLayer(layer.id, { isMask: false })
    layers.filter((l) => l.maskedBy === layer.id).forEach((l) => updateLayer(l.id, { maskedBy: null }))
    commitTransaction()
  }

  const t = layer.type
  const top = []
  if (t === 'text') {
    top.push({ label: 'Morph…', run: () => openRailTab('Parameters') })
    top.push({ label: 'Flatten text', run: () => flattenText(layer.id) })
    top.push({ label: 'Edit object…', run: async () => { const next = await askPrompt({ title: 'Edit text', value: layer.text ?? '' }); if (next != null) updateLayer(layer.id, { text: next }) } })
    /* TextPanel's kol:save-type listener, which kolbox does not mount: the same spec to the library */
    top.push({ label: 'Save type to library', run: () => saveType({
      text: layer.text, family: layerFamily(layer), width: layer.width, weight: layer.weight, italic: layer.italic, size: layer.size,
      tracking: layer.tracking, lineHeight: layer.lineHeight, case: layer.case, color: resolveColor(layer.color, palette) ?? layer.color,
      textAlign: layer.textAlign, verticalAlign: layer.verticalAlign,
    }) })
  }
  if (t === 'bool') {
    top.push({ label: 'Convert to path', run: () => flattenSelected() })
    top.push({ label: 'Release boolean', run: () => releaseBoolean() })
  }
  if (t === 'shape' && CONVERTIBLE_KINDS.has(layer.kind)) top.push({ label: 'Convert to path', run: () => convertShapeToPath(layer.id) })
  if (layer.isMask) top.push({ label: 'Release mask', run: releaseMask })
  if (t === 'photo') {
    top.push({ label: 'Crop image', run: send('kol:enter-crop', layer.id) })
    top.push({ label: 'Replace image', run: () => onReplace(layer.id) })
  }
  if (t === 'pattern') top.push({ label: 'Pattern parameters', run: () => openRailTab('Parameters') })
  if (['shape', 'loop', 'kinetic', 'misc', 'path'].includes(t)) top.push({ label: 'Parameters', run: () => openRailTab('Parameters') })
  if (['shape', 'text', 'pattern', 'path', 'loop', 'photo'].includes(t)) top.push({ label: 'Add effect', run: () => openRailTab('Effects') })
  /* HIS LIST (plan-2026-11-19 C4.2, W28.8): bring to front, send to back, group, flatten, use as mask, show or hide,
     lock or unlock, flip, rename, duplicate, delete, each the engine's own write; Copy, Cut, Paste and Paste here
     (C4.4) in their own group. A frame takes no order or flip rows (its layers draw over it; a frame has no flip), and
     frames are never grouped (C1). A layer in a frame goes back no further than just above its frame, so it stays on
     it. One lock rule: a locked layer refuses duplicate and delete here as it does on the toolbar. */
  const frame = t === 'frame'
  const picked = selectedIds.filter((id) => id !== 'canvas' && findLayerDeep(layers, id)?.type !== 'frame')
  const backAt = () => {
    if (!layer.frameId || i < 0) return 0
    return layers.filter((l) => l.id !== layer.id).findIndex((l) => l.id === layer.frameId) + 1
  }
  const order = frame ? [] : [
    { label: 'Bring to front', run: () => moveLayer(layer.id, Infinity) },
    { label: 'Send to back', run: () => moveLayer(layer.id, backAt()) },
  ]
  const make = frame ? [] : [
    { label: 'Group', run: () => groupLayers(picked), disabled: picked.length < 2 },
    { label: 'Flatten', run: () => flattenSelected(), disabled: !(picked.length >= 2 || t === 'bool') },
    ...(!layer.isMask && canMask(layer) && below ? [{ label: 'Use as mask', run: useAsMask }] : []),
  ]
  const state = [
    { label: layer.visible === false ? 'Show' : 'Hide', run: () => toggleLayer(layer.id) },
    { label: layer.locked ? 'Unlock' : 'Lock', run: () => toggleLayerLock(layer.id) },
    ...(frame ? [] : [
      { label: 'Flip horizontal', run: () => flipLayer(layer.id, 'h') },
      { label: 'Flip vertical', run: () => flipLayer(layer.id, 'v') },
    ]),
  ]
  const rename = async () => {
    const n = await askPrompt({ title: frame ? 'Rename frame:' : 'Rename layer:', value: layer.name ?? '', action: 'Rename' })
    if (n != null) updateLayer(layer.id, { name: n.trim() || null })
  }
  const ops = [
    ...(onRow ? [{ label: 'Rename…', run: rename }] : []),
    { label: 'Duplicate', run: () => duplicateLayer(layer.id), disabled: !!layer.locked },
    { label: 'Delete', run: () => removeLayer(layer.id), disabled: !!layer.locked },
  ]
  return [top, clipRows, order, make, state, ops].filter((g) => g.length)
}

/* the pointer as a menu's anchor: the menu drops from it (OverlayLayer's bottom-start adds its 4) */
export const pointAnchor = (x, y) => ({ getBoundingClientRect: () => new DOMRect(x, y - 4, 0, 0), contains: () => false })

export default function LayerMenuHost() {
  const { layers, selectedIds, select, updateLayer } = useComposeState()
  const [at, setAt] = useState(null)
  const sel = useRef(selectedIds); sel.current = selectedIds

  useEffect(() => {
    const open = ({ id, x, y, row = false }) => {
      if (id && !sel.current.includes(id)) select(id)
      setAt({ id, x, y, row })
    }
    const onRow = (e) => open(e.detail)
    /* the canvas: the real onContextMenu's rule, a layer under the pointer or the empty canvas */
    const onCanvas = (e) => {
      if (!e.target.closest?.('[data-canvas] > .kol-design-editor')) return
      e.preventDefault()
      e.stopPropagation()
      /* a frame answers on its body (a layer) and on its name (FrameChrome's `data-frame-id`) */
      const id = e.target.closest('[data-layer-id]')?.dataset.layerId ?? e.target.closest('[data-frame-id]')?.dataset.frameId ?? null
      open({ id, x: e.clientX, y: e.clientY })
    }
    window.addEventListener(OPEN, onRow)
    document.addEventListener('contextmenu', onCanvas, true)
    return () => { window.removeEventListener(OPEN, onRow); document.removeEventListener('contextmenu', onCanvas, true) }
  }, [select])

  /* Replace image: LayerInspector's file input, which kolbox does not mount; the same write */
  const file = useRef(null), target = useRef(null)
  const onReplace = (id) => { target.current = id; file.current?.click() }
  const onPick = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f || !target.current) return
    const reader = new FileReader()
    reader.onload = () => updateLayer(target.current, { src: reader.result, srcType: 'image' })
    reader.readAsDataURL(f)
  }

  const layer = at?.id ? findLayerDeep(layers, at.id) : null
  const rows = useRows(layer, onReplace, at, !!at?.row)
  const point = useMemo(() => at && pointAnchor(at.x, at.y), [at])
  return (
    <>
      <Menu variant="kolbox" aria-label="Layer" anchor={point} open={!!at} onClose={() => setAt(null)} onSelect={(row) => row.run?.()} groups={rows} />
      <input ref={file} type="file" accept="image/*" hidden onChange={onPick} />
    </>
  )
}
