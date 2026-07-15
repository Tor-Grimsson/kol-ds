---
component: useEyedropper
source: kol-ds-fxr/src/editor/color/canvasEyedropper.js#L1-L112
date: 2026-07-10
status: shipped
deps: [colorMath]
shipped_to: packages/component/src/hooks/useEyedropper.js
---

# useEyedropper

Bucket C port — the color ENGINE the DS lacked. Shipped into `@kolkrabbi/kol-component` (hooks tier), barrel-exported (`useEyedropper`, `pickFromCanvasElement`).

## Purpose
Cross-browser color sampling. Primary path = native `window.EyeDropper` (Chromium): one call, samples any pixel on screen, returns an sRGB hex. Where it is absent (Firefox, Safari) the hook falls back to an **injected** sampler — the DS never reaches into an app's canvas/scene; the consumer supplies the fallback.

## API
```js
const { supported, nativeSupported, pick } = useEyedropper({ fallback })
// supported → render the eyedropper button (native OR a fallback exists)
const hex = await pick()          // '#RRGGBB' or null (cancelled / unavailable)
const hex = await pick({ signal }) // AbortSignal cancels the native/fallback pick
```
- `supported` resolves after mount (SSR-safe: starts false).
- `pick()` tries native first; on cancel (Escape rejects the native promise) → null; else the fallback; else null.

### `pickFromCanvasElement(canvas, { signal })`
The reusable fallback sampler — the distilled core of the source's canvas eyedropper. Sets a crosshair on `canvas`, awaits one pointer press, reads the pixel via `getImageData`, resolves the hex. Escape / press outside bounds / aborted signal → null. Backing-store aware (scales client coords by `canvas.width/height ÷ CSS box`), so HiDPI or CSS-scaled canvases sample the right pixel. Capture-phase listener so it beats the consumer's own canvas handlers; swallows tainted-canvas `getImageData` throws → null.

## What changed vs source (the DIFF)
The source `canvasEyedropper.js` is NOT a generic cross-browser eyedropper — it is the editor's canvas-internal fallback, hard-wired to editor internals (`buildLayersSvg`, `ASPECTS`, `CANVAS_VIRTUAL_W`, the compose layer model). None of that belongs in the DS.
- **Native EyeDropper path is new** — the source had no native path; "cross-browser" there meant "works everywhere because we rasterize our own canvas". The DS inverts it: native-first, canvas fallback.
- **Editor internals dropped.** `buildLayersSvg` / aspects / layer-SVG rasterization are consumer concerns. `pickFromCanvasElement` samples a plain `<canvas>` the consumer already rendered — the generic, reusable half.
- **Pairs with the existing seam.** SwatchControls' `EyedropPick` already exposes the eyedropper button, a `supported` feature-gate (`useEyeDropperSupported`), an `onPick` seam and a sample chip. This hook is exactly what a consumer plugs into `onPick` — nothing in SwatchControls needed rewiring.

## Wiring (call site, not inside the molecule)
```jsx
const { supported, pick } = useEyedropper({ fallback: () => pickFromCanvasElement(canvasEl) })
<SwatchControls onPick={async () => { const hex = await pick(); if (hex) setFill(hex) }} sampleColor={fillColor} />
```

## Dependencies
- React `useState/useEffect/useRef/useCallback/useMemo`.
- `./colorMath.js` — `rgbToHex` (single source of the hex formatter).
