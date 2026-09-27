import { LayerStack as DsLayerStack, AddLayerButton as DsAddLayerButton, BLEND_MODES } from '@kolkrabbi/kol-component'
import EditorIcon from '../icons/EditorIcon'
import { useComposeState, layerTypes } from './state'
import { rowLabelForLayer } from './labels'

/**
 * The layer stack — kol-component's `LayerStack` and `AddLayerButton` (lifted from this file,
 * editor-panels-the-held-specs; editor DS sync phase 3c, 2026-09-27 — this file was a 583-line
 * second copy with its own rows, drag and add menu). What is the editor's: the compose store, its
 * layer labels, the add menu's types and shape kinds, and the icon names.
 *
 * `BLEND_MODES` is re-exported for the inspector's Blend dropdown — it is KOL's list now.
 */
export { BLEND_MODES }

const TYPE_ICONS = {
  background: 'layer-background',
  pattern:    'layer-pattern',
  photo:      'layer-photo',
  shape:      'layer-shape',
  text:       'layer-text',
  group:      'layer-group',
  bool:       'layer-group',
  loop:       'layer-loop',
  misc:       'layer-loop',
  kinetic:    'layer-kinetic',
}
const iconFor = (type) => TYPE_ICONS[type] ?? 'layer-shape'

/* Line is not here on purpose — a line is drawn with the pen (its endpoints carry direction a
 * default box can't). */
const SHAPE_KINDS = [
  { id: 'logo',     label: 'Logo',      icon: 'layer-shape',   extras: {} },
  { id: 'rect',     label: 'Rectangle', icon: 'tool-rect',     extras: { kind: 'rect' } },
  { id: 'ellipse',  label: 'Ellipse',   icon: 'tool-ellipse',  extras: { kind: 'ellipse' } },
  { id: 'triangle', label: 'Triangle',  icon: 'tool-triangle', extras: { kind: 'triangle' } },
  { id: 'polygon',  label: 'Polygon',   icon: 'tool-polygon',  extras: { kind: 'polygon', sides: 5 } },
  { id: 'star',     label: 'Star',      icon: 'tool-star',     extras: { kind: 'star', points: 5, innerRatio: 0.5 } },
]

/** The add menu — lives in the Layers / Assets tab row (LayersAssetsPanel). */
export function AddLayerButton() {
  const { addLayer } = useComposeState()
  return (
    <DsAddLayerButton
      types={layerTypes()}
      nested={{ typeId: 'shape', kinds: SHAPE_KINDS }}
      onAdd={(typeId, extras) => addLayer(typeId, extras)}
      iconFor={iconFor}
      iconComponent={EditorIcon}
    />
  )
}

export function LayerStackBody() {
  const {
    selectedIds, select, selectCanvas, toggleSelection, groupLayers,
    layers, toggleLayer, toggleLayerLock, updateLayer, reparentLayer,
  } = useComposeState()
  return (
    <DsLayerStack
      layers={layers}
      selectedIds={selectedIds}
      canvasId="canvas"
      onSelect={select}
      onToggleSelect={toggleSelection}
      onSelectCanvas={selectCanvas}
      onToggleVisible={toggleLayer}
      onToggleLocked={toggleLayerLock}
      onRename={(id, name) => updateLayer(id, { name })}
      onReorder={reparentLayer}
      onGroup={groupLayers}
      labelFor={rowLabelForLayer}
      iconFor={iconFor}
      iconComponent={EditorIcon}
    />
  )
}

export default function LayerStack() { return <LayerStackBody /> }
