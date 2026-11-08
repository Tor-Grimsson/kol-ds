/* IMAGE AS FIELD (plan 53 § 4.1): the photo a generate layer reads, as a brightness sampler in its ART-BOX
 * units. The photo is read AS PLACED on the canvas — document point → the photo's frame → its crop window
 * (or its cover fit) → the image — so a generate layer over a photo screens exactly what shows, and a new
 * crop re-renders. Pixels load once per src (≤ 512 px, luminance), off-screen. */
import { useEffect, useMemo, useState } from 'react'
import { useComposeState } from '../compose/state'
import { findLayerDeep } from '../compose/helpers'
import { artBox } from '../../generate/index.js'

const lum = new Map() /* src → { w, h, data: Float32Array } */
function loadLum(src) {
  if (lum.has(src)) return Promise.resolve(lum.get(src))
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const k = Math.min(1, 512 / Math.max(img.naturalWidth, img.naturalHeight))
      const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k))
      const c = document.createElement('canvas'); c.width = w; c.height = h
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, w, h)
      const px = g.getImageData(0, 0, w, h).data, data = new Float32Array(w * h)
      for (let i = 0; i < w * h; i++) data[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255
      const out = { w, h, data, nw: img.naturalWidth, nh: img.naturalHeight }
      lum.set(src, out); res(out)
    }
    img.onerror = rej
    img.src = src
  })
}

/* the sampler: (u, v) in the generate layer's art box → brightness 0–1 of the photo under that point */
export function photoSampler(gen, photo, L) {
  const b = artBox(gen, gen.w ?? 0, gen.h ?? 0)
  const gx = (gen.x ?? 0) + b.x, gy = (gen.y ?? 0) + b.y
  let ox, oy, dw, dh
  if (photo.imgW != null) { ox = photo.imgX ?? 0; oy = photo.imgY ?? 0; dw = photo.imgW; dh = photo.imgH }
  else {
    const s = Math.max(photo.w / L.nw, photo.h / L.nh)
    dw = L.nw * s; dh = L.nh * s; ox = (photo.w - dw) / 2; oy = (photo.h - dh) / 2
  }
  return (u, v) => {
    const ix = (gx + u * b.w - (photo.x ?? 0) - ox) / dw, iy = (gy + v * b.h - (photo.y ?? 0) - oy) / dh
    if (ix < 0 || ix >= 1 || iy < 0 || iy >= 1) return 0
    return L.data[Math.floor(iy * L.h) * L.w + Math.floor(ix * L.w)]
  }
}

export function useGenerateImage(layer) {
  const { layers } = useComposeState()
  const wants = layer.fKind === 'image' || layer.gKind === 'image'
  const photo = wants && layer.fImgLayer ? findLayerDeep(layers, layer.fImgLayer) : null
  const src = photo?.type === 'photo' ? photo.src : null
  const [L, setL] = useState(null)
  useEffect(() => {
    if (!src) { setL(null); return undefined }
    let live = true
    loadLum(src).then((d) => { if (live) setL(d) }).catch(() => { if (live) setL(null) })
    return () => { live = false }
  }, [src])
  const box = [layer.x, layer.y, layer.w, layer.h, layer.inset]
  /* eslint-disable-next-line react-hooks/exhaustive-deps -- the photo object (its box + crop) and our box are the keys */
  return useMemo(() => (photo && L ? photoSampler(layer, photo, L) : null), [photo, L, ...box])
}
