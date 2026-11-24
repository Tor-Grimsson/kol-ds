/* An ASCII layer's font, loaded on demand (plan 53 § 2.1): the core only draws registered fonts, so an
 * outline family at a weight (`<family>-<weight>`, asciiFontKey) is loaded through fontLoader, registered, and the layer
 * redrawn. Returns a version that bumps when the font lands — a memo key. */
import { useEffect, useState } from 'react'
import { loadFont } from '../modes/type/fontLoader'
import { hasFont, registerFont } from '../../generate/fonts.js'
import { asciiFontKey } from '../../generate/styles/ascii.js'

export function useGenerateFont(layer) {
  const key = layer.genStyle === 'ascii' ? asciiFontKey(layer) : null
  const [ver, setVer] = useState(0)
  useEffect(() => {
    if (!key || key === 'pixel' || hasFont(key)) return undefined
    const [family, weight] = key.split('-')
    let live = true
    loadFont(family, Number(weight)).then((f) => { registerFont(key, f); if (live) setVer((v) => v + 1) }).catch(() => {})
    return () => { live = false }
  }, [key])
  return ver
}
