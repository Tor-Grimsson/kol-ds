/**
 * useEyedropper — cross-browser color sampling.
 *
 * Primary path is the native `window.EyeDropper` API (Chromium): one call,
 * samples any pixel on screen, returns an sRGB hex. Where it is unavailable
 * (Firefox, Safari) the hook falls back to an injected `fallback` sampler —
 * e.g. `pickFromCanvasElement`, which samples a pixel from a <canvas> the
 * consumer renders. The DS stays decoupled: it never reaches into an app's
 * canvas/scene — the consumer supplies the fallback.
 *
 * Pairs with the EyedropPick affordance in SwatchControls: gate the button on
 * `supported`, wire the button's `onPick` to `pick`.
 *
 *   const { supported, pick } = useEyedropper({ fallback })
 *   // supported → render the eyedropper button
 *   const hex = await pick()   // '#RRGGBB' or null (cancelled / unavailable)
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { rgbToHex } from './colorMath.js'

/* Native support probe — read at call time so it is correct even before the
 * post-mount state (below) has settled. */
function hasNativeEyeDropper() {
  return typeof window !== 'undefined' && 'EyeDropper' in window
}

/**
 * Generic canvas-region sampler — the reusable core of a canvas eyedropper.
 * Sets a crosshair cursor on `canvas`, awaits one pointer press on it, reads
 * the pixel under the cursor via getImageData, and resolves the hex. Escape,
 * a press outside the canvas bounds, or an aborted `signal` resolve to null.
 *
 * Backing-store aware: scales client coords by canvas.width/height ÷ CSS box,
 * so a HiDPI or CSS-scaled canvas still samples the right pixel.
 *
 * @param {HTMLCanvasElement} canvas  the canvas to sample from
 * @param {{signal?: AbortSignal}} [opts]
 * @returns {Promise<string|null>} uppercase '#RRGGBB' or null
 */
export async function pickFromCanvasElement(canvas, { signal } = {}) {
  if (!canvas || typeof canvas.getContext !== 'function') return null
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  if (signal?.aborted) return null

  const prevCursor = canvas.style.cursor
  canvas.style.cursor = 'crosshair'

  return new Promise((resolve) => {
    const cleanup = () => {
      canvas.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey, true)
      signal?.removeEventListener('abort', onAbort)
      canvas.style.cursor = prevCursor
    }

    const onDown = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const rect = canvas.getBoundingClientRect()
      const sx = rect.width  ? canvas.width  / rect.width  : 1
      const sy = rect.height ? canvas.height / rect.height : 1
      const vx = Math.floor((e.clientX - rect.left) * sx)
      const vy = Math.floor((e.clientY - rect.top)  * sy)
      if (vx < 0 || vy < 0 || vx >= canvas.width || vy >= canvas.height) {
        cleanup(); resolve(null); return
      }
      let data
      try { data = ctx.getImageData(vx, vy, 1, 1).data }
      catch { cleanup(); resolve(null); return }   /* tainted canvas */
      cleanup()
      resolve(rgbToHex(data[0], data[1], data[2]))
    }

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); cleanup(); resolve(null) }
    }

    const onAbort = () => { cleanup(); resolve(null) }

    /* Capture phase so we beat the consumer's own canvas handlers. */
    canvas.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey, true)
    signal?.addEventListener('abort', onAbort)
  })
}

/**
 * @param {{fallback?: (opts?: {signal?: AbortSignal}) => Promise<string|null>}} [options]
 *   fallback — sampler used when the native EyeDropper API is absent. Return
 *   a hex or null. Without a fallback, unsupported browsers report
 *   `supported: false` and `pick` resolves null.
 * @returns {{supported: boolean, nativeSupported: boolean,
 *            pick: (opts?: {signal?: AbortSignal}) => Promise<string|null>}}
 */
export function useEyedropper({ fallback } = {}) {
  /* Resolved after mount so SSR / first paint stays stable (starts false,
   * flips true only where the native API exists). */
  const [nativeSupported, setNativeSupported] = useState(false)
  useEffect(() => { setNativeSupported(hasNativeEyeDropper()) }, [])

  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback

  const supported = nativeSupported || !!fallback

  const pick = useCallback(async ({ signal } = {}) => {
    if (hasNativeEyeDropper()) {
      try {
        const res = await new window.EyeDropper().open(signal ? { signal } : undefined)
        return res?.sRGBHex ? res.sRGBHex.toUpperCase() : null
      } catch {
        return null   /* user cancelled (Escape) rejects the promise */
      }
    }
    if (fallbackRef.current) return (await fallbackRef.current({ signal })) ?? null
    return null
  }, [])

  return useMemo(
    () => ({ supported, nativeSupported, pick }),
    [supported, nativeSupported, pick],
  )
}
