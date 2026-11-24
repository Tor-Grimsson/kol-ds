import { useEffect, useRef } from 'react'
import { pickFromCanvas, resolveColor, useColorTarget, useComposeState } from '../engine.js'

/* The eyedropper (round 3, 4.1), as the real colour pane's (ColourPanel's TopRow): the engine's own canvas pick
   (`pickFromCanvas` rasterises the frame and samples the pixel under the next press on the stage; Escape or a press off
   the stage cancels), into the focused paint of the engine's colour target, so the selected layer's fill by default.
   The real pane listens for `kol:eyedrop`, which the canvas fires for the `I` key and for Edit › Eyedropper's
   `kol:command`; kolbox has no pane mounted, so this host listens in its place, mounted with the screen's windows.
   A themed `var(...)` canvas fill is skipped, as the real one skips it. */
export const eyedrop = () => window.dispatchEvent(new CustomEvent('kol:eyedrop'))

export function EyedropHost() {
  const target = useColorTarget()
  const { layers, palette, aspect, customRatio, canvasFill } = useComposeState()
  const pick = useRef(null)
  pick.current = async () => {
    const canvasFillHex = typeof canvasFill === 'string' && canvasFill.startsWith('var(') ? null : (resolveColor(canvasFill, palette) ?? null)
    try {
      const hex = await pickFromCanvas({ layers, palette, aspect, customRatio, canvasFillHex })
      if (hex) target.onChange(hex)
    } catch { /* the frame would not rasterise: nothing picked */ }
  }
  useEffect(() => {
    const on = () => pick.current()
    window.addEventListener('kol:eyedrop', on)
    return () => window.removeEventListener('kol:eyedrop', on)
  }, [])
  return null
}
