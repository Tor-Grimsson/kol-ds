/* GenerateLayer — the canvas render of a `generate` layer (plan 52 § 1.1): one SVG, the ground rect and
 * one path, recomputed only when a param that draws changes (moving the layer reuses the marks). */
import { useMemo } from 'react'
import { marksD } from '../../generate/geom.js'
import { resolveColor } from '../compose/state'
import { generateKey, generateMarks, ringCache, imageSamplers } from './generateCore'
import { useGenerateRings } from './rings'
import { useGenerateFont } from './useGenerateFont'
import { useGenerateImage } from './useGenerateImage'

export default function GenerateLayer({ layer, palette, layerStyle }) {
  const rings = useGenerateRings(layer)
  const fontVer = useGenerateFont(layer)
  const image = useGenerateImage(layer)
  const key = generateKey(layer)
  /* eslint-disable-next-line react-hooks/exhaustive-deps -- `key` (+ the mask's rings) is the whole dependency */
  const d = useMemo(() => { ringCache.set(layer.id, rings); imageSamplers.set(layer.id, image); return marksD(generateMarks(layer, rings, image)) }, [key, rings, fontVer, image])
  const ink = resolveColor(layer.color, palette) ?? '#FFFFFF'
  const bg = layer.bg == null ? null : resolveColor(layer.bg, palette)
  const w = Math.max(1, layer.w ?? 1), h = Math.max(1, layer.h ?? 1)
  return (
    <svg
      data-layer-id={layer.id}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: 'absolute', left: layer.x, top: layer.y, overflow: 'hidden', cursor: 'move', ...layerStyle }}
    >
      {bg && <rect width={w} height={h} fill={bg} />}
      {d && <path d={d} fill={ink} />}
    </svg>
  )
}
