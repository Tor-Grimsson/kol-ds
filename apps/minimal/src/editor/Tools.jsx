import { useEffect, useRef } from 'react'
import {
  BOOL_OP_LABELS, CANVAS_H, CANVAS_W, COVER_TYPES, comboLabel, findLayerDeep, isBooleanable, pack, shortcutById,
  TOOL_META, useColorTarget, useComposeState, useTool,
} from './engine.js'
import ButtonFold from '../ui/ButtonFold.jsx'
import Icon from '../ui/Icon.jsx'
import SwatchStack from '../ui/SwatchStack.jsx'

/* The tools strip and the action band, as the real ones are (the package's ToolStrip and ActionBar). */
const key = (id) => { const s = shortcutById(id); return s ? comboLabel(s.combo) : undefined }
const variant = (id) => ({ id, label: TOOL_META[id].label, icon: TOOL_META[id].icon, shortcut: key(`tool-${id}`) })
const SHAPES = ['rect', 'ellipse', 'triangle', 'polygon', 'star'].map(variant)
const BOOLEANS = [['unite', 'boolean-unite'], ['subtract', 'boolean-subtract'], ['intersect', 'boolean-intersect'], ['exclude', 'boolean-exclude']]
const Rule = ({ vertical }) => <span role="separator" className={vertical ? 'my-1 h-px w-5 shrink-0 bg-line' : 'mx-1 h-4 w-px shrink-0 bg-line'} />

/* THE TOOLS: the creation folds, a rule, the navigation fold; the fill and stroke pair at the foot */
export function ToolStrip() {
  const { tool, setTool } = useTool()
  const { addLayer } = useComposeState()
  const target = useColorTarget()
  const folds = [
    [variant('select'), { id: 'node', label: 'Node select', icon: 'arrow-upleft', shortcut: key('node-edit') }],
    [variant('pen'), variant('line')],
    SHAPES,
    [variant('text'), ...(pack('motion') ? [{ id: 'kinetic', label: 'Kinetic type', icon: 'type-02' }] : [])],
    [variant('pattern')],
  ]
  const onSelect = (id) => {
    if (id === 'kinetic') addLayer('kinetic')
    else if (id === 'node') window.dispatchEvent(new CustomEvent('kol:node-edit'))
    else setTool(id)
  }
  const openPaint = (paint) => {
    target.setActivePaint(paint)
    window.dispatchEvent(new CustomEvent('kol:open-color-pane', { detail: { tab: paint === 'stroke' ? 'Stroke' : 'Colour' } }))
  }
  return (
    <>
      <div className="flex flex-col items-center gap-1 py-2">
        {folds.map((v) => <ButtonFold key={v[0].id} variants={v} activeId={tool} onSelect={onSelect} />)}
        <Rule vertical />
        <ButtonFold variants={[variant('zoom'), variant('hand'), variant('orbit')]} activeId={tool} onSelect={onSelect} />
      </div>
      <div className="mt-auto flex justify-center pb-3">
        <SwatchStack size={18} fillColor={target.fillHex ?? '#FFFFFF'} strokeColor={target.strokeHex ?? '#000000'} activePaint={target.activePaint}
          onPick={openPaint} onSwap={target.swap} onClear={() => target.onChange(null)} />
      </div>
    </>
  )
}

/* THE ACTIONS: Rotate and Boolean folds, a rule, Insert image, Crop, Duplicate. The same for every tool. */
export function ActionBar() {
  const { layers, selectedId, selectedIds, flipSelected, duplicateLayer, updateLayer, addLayer, booleanSelected } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const canXform = !!layer && !COVER_TYPES.includes(layer.type) && !layer.locked
  const canBool = layers.filter((l) => selectedIds.includes(l.id) && isBooleanable(l)).length >= 2
  const rotateBy = (d) => updateLayer(layer.id, { rotation: ((Math.round((layer.rotation ?? 0) + d) % 360) + 360) % 360 })

  const fileRef = useRef(null)
  useEffect(() => {
    const on = () => fileRef.current?.click()
    window.addEventListener('kol:insert-image', on)
    return () => window.removeEventListener('kol:insert-image', on)
  }, [])
  const onPickImage = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        if (!img.naturalWidth || !img.naturalHeight) return
        const k = Math.min(1, 720 / img.naturalWidth, 720 / img.naturalHeight)
        const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k)
        addLayer('photo', { src: reader.result, x: Math.round((CANVAS_W - w) / 2), y: Math.round((CANVAS_H - h) / 2), w, h, fit: 'cover' })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }
  const run = (id) => {
    if (id === 'flip-horizontal') flipSelected('h')
    else if (id === 'flip-vertical') flipSelected('v')
    else if (id === 'rotate-left') rotateBy(-90)
    else if (id === 'rotate-right') rotateBy(90)
    else booleanSelected(id)
  }
  const act = (icon, label, onClick, disabled) => (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className="flex size-7 items-center justify-center rounded-full text-muted outline-none hover:bg-field hover:text-fg focus-visible:outline-1 focus-visible:outline-fg disabled:pointer-events-none disabled:opacity-40">
      <Icon name={icon} />
    </button>
  )
  return (
    <div className="flex items-center gap-1">
      <ButtonFold place="below" disabled={!canXform} onSelect={run} variants={[
        { id: 'rotate-left', icon: 'rotate-left', label: 'Rotate 90° left', disabled: !canXform },
        { id: 'rotate-right', icon: 'rotate-right', label: 'Rotate 90° right', disabled: !canXform },
        { id: 'flip-horizontal', icon: 'flip-horizontal', label: 'Flip horizontal', shortcut: key('flip-h'), disabled: !canXform },
        { id: 'flip-vertical', icon: 'flip-vertical', label: 'Flip vertical', shortcut: key('flip-v'), disabled: !canXform },
      ]} />
      <ButtonFold place="below" disabled={!canBool} onSelect={run} variants={BOOLEANS.map(([id, icon]) => ({ id, icon, label: BOOL_OP_LABELS[id] ?? id, disabled: !canBool }))} />
      <Rule />
      {act('image', 'Insert image', () => fileRef.current?.click(), false)}
      {act('crop', 'Crop image', () => window.dispatchEvent(new CustomEvent('kol:enter-crop', { detail: layer.id })), layer?.type !== 'photo' || layer?.locked)}
      {act('copy', 'Duplicate', () => duplicateLayer(layer.id), !layer || layer.locked)}
      <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="hidden" />
    </div>
  )
}
