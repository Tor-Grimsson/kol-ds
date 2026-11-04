// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19847
// source=packages/shell/src/CanvasReadouts.jsx
// component=CanvasHint
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<CanvasHint hint={['Drag to move', 'Shift to constrain', 'Double-click to edit']} />`,
  imports: ["import { CanvasHint } from \"@kolkrabbi/kol-shell\""],
  id: 'CanvasHint',
}
