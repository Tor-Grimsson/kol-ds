/**
 * InspectorRail — the selection-routing shell of an inspector panel.
 *
 * Lifted from kol-fxr's editor (`compose/InspectorRail.jsx`,
 * `editor-panels-the-held-specs` A7, 2026-09-03) with ALL of its coupling
 * dropped: it read the compose store and imported three concrete panels. What
 * is left is the one piece of logic the filer said everyone gets wrong — the
 * precedence — and it is the thing that makes an inspector rail a component
 * rather than a `<div>`:
 *
 *   nothing selected       → renders NOTHING (user ruling 2026-08-12: no dummy
 *                            empty-state copy; selection must visibly spawn
 *                            its controls)
 *   the canvas is selected → `renderers.canvas`, and it WINS over multi-select.
 *                            Selecting the canvas selects every layer with it,
 *                            so without this precedence "inspect the canvas"
 *                            with two layers in frame fell into the multi
 *                            branch and hid the fill / opacity controls
 *   exactly one id         → `renderers.single(id)`
 *   two or more ids        → `renderers.multi(ids)` — the canvas id excluded
 *                            from the count; it is selectable but not a layer
 *
 * The panels themselves are the consumer's — a layer inspector delegating by
 * type, a canvas inspector, a multi-select summary with a Group action — and
 * they arrive as render functions so this file imports none of them.
 *
 *   <InspectorRail
 *     selectedIds={selectedIds}
 *     canvasId="canvas"
 *     renderers={{
 *       canvas: () => <CanvasInspector />,
 *       single: (id) => <LayerInspector layer={find(id)} />,
 *       multi:  (ids) => <MultiSummary ids={ids} onGroup={group} />,
 *     }}
 *   />
 *
 * @param {string[]} selectedIds - The current selection, in selection order; may include `canvasId`
 * @param {string} [canvasId='canvas'] - The id that means "the canvas itself" — precedence, and excluded from the multi count
 * @param {{canvas?: Function, single?: Function, multi?: Function}} renderers - `canvas()`, `single(id)`, `multi(ids)` — each returns the node for that state; a missing renderer renders nothing for it
 * @param {string} [className] - Extra classes on the rail
 */
export default function InspectorRail({ selectedIds = [], canvasId = 'canvas', renderers = {}, className = '' }) {
  const isCanvas = selectedIds.includes(canvasId)
  const layerIds = selectedIds.filter((id) => id !== canvasId)

  const body = isCanvas
    ? renderers.canvas?.()
    : layerIds.length >= 2
      ? renderers.multi?.(layerIds)
      : layerIds.length === 1
        ? renderers.single?.(layerIds[0])
        : null

  return (
    <div className={`kol-inspector-rail ${className}`.trim()}>
      {body && <div className="kol-inspector-rail-body">{body}</div>}
    </div>
  )
}
