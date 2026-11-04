// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19857
// source=packages/shell/src/CanvasReadouts.jsx
// component=SelectionMeasure
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<SelectionMeasure width={754} height={771} label="Orbit field">{selected}</SelectionMeasure>`,
  imports: ["import { SelectionMeasure } from \"@kolkrabbi/kol-shell\""],
  id: 'SelectionMeasure',
}
