// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1489-13263
// source=packages/component/src/molecules/InspectorRail.jsx
// component=InspectorRail
import figma from 'figma'
export default {
  example: figma.code`<InspectorRail selectedIds={selectedIds} canvasId="canvas" renderers={{ canvas: () => <CanvasInspector />, single: (id) => <LayerInspector id={id} />, multi: (ids) => <MultiSummary ids={ids} /> }} />`,
  imports: ["import { InspectorRail } from \"@kolkrabbi/kol-component\""],
  id: 'InspectorRail',
}
