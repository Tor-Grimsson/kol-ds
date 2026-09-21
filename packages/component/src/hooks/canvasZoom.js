import { createContext } from 'react'

/**
 * CanvasZoomContext — the canvas viewport's live zoom factor.
 *
 * Lives in `src/hooks` rather than beside `Canvas` because BOTH tiers need it:
 * the organism publishes it (`PanZoomViewport`) and the atoms consume it
 * (`SelectionOverlay` divides every screen-constant dimension by it). An atom
 * importing `../organisms/Canvas.jsx` is an upward import and the taxonomy
 * gate is right to refuse it — so the shared value moves down to the tier
 * neither side owns, the same reason `glyphLadders.js` sits here.
 *
 * Defaults to 1, so a consumer reads it unconditionally and a canvas without a
 * pan-zoom viewport turns every `/ zoom` into a no-op.
 *
 * `@kolkrabbi/kol-component` exports it from the barrel as `CanvasZoomContext`,
 * and `Canvas.jsx` re-exports it under the same name it always had.
 */
export const CanvasZoomContext = createContext(1)
