/* An ASCII layer's font, loaded on demand (plan 53 § 2.1): the core only draws registered fonts, so a
 * Right Grotesk cut (`rg-<width>-<weight>`) is loaded through fontLoader, registered, and the layer redrawn.
 * Returns a version that bumps when the cut lands — a memo key. */
import { useEffect, useState } from 'react'
import { loadFont } from '../modes/type/fontLoader'
import { hasFont, registerFont } from '../../generate/fonts.js'

export function useGenerateFont(layer) {
  const key = layer.genStyle === 'ascii' ? (layer.font ?? 'pixel') : null
  const [ver, setVer] = useState(0)
  useEffect(() => {
    if (!key || key === 'pixel' || hasFont(key)) return undefined
    const [, width, weight] = key.split('-')
    let live = true
    loadFont(width, Number(weight)).then((f) => { registerFont(key, f); if (live) setVer((v) => v + 1) }).catch(() => {})
    return () => { live = false }
  }, [key])
  return ver
}
