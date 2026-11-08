/* RepeatLayer — a `repeat` layer's canvas render (plan 53 § 3.1): live copies of its source layer, each in a
 * wrapper carrying the copy's matrix (document px, origin 0 0). The source is read from the compose store
 * on every render — move or rotate it and every copy follows in the same commit. A copy is drawn as the
 * source with the REPEAT layer's id, so clicking a copy selects the repeat. The source itself stays where
 * it is, as copy 0. */
import { useComposeState } from '../compose/state'
import { findLayerDeep } from '../compose/helpers'
import LayerRenderer from '../compose/LayerRenderer'
import { copyMatrices } from '../../generate/repeat.js'

export default function RepeatLayer({ layer, palette, layerStyle }) {
  const { layers } = useComposeState()
  const src = layer.sourceId ? findLayerDeep(layers, layer.sourceId) : null
  if (!src || src.w == null) return null
  const mats = copyMatrices(layer, { x: src.x ?? 0, y: src.y ?? 0, w: src.w, h: src.h })
  const copy = { ...src, id: layer.id, visible: true }
  return (
    <div data-repeat-id={layer.id} style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, overflow: 'visible', pointerEvents: 'none', ...layerStyle }}>
      {mats.map((m, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `matrix(${m.map((v) => v.toFixed(4)).join(',')})`, pointerEvents: 'auto' }}>
          <LayerRenderer layer={copy} palette={palette} />
        </div>
      ))}
    </div>
  )
}
