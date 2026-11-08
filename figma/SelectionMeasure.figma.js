// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=706-52572
// source=packages/shell/src/CanvasReadouts.jsx
// component=SelectionMeasure
import figma from 'figma'

const instance = figma.selectedInstance
const measure = instance.getEnum('measure', { true: true, false: false })

export default {
  example: measure
    ? figma.code`<SelectionMeasure width={754} height={771} label="Orbit field">{selected}</SelectionMeasure>`
    : figma.code`<SelectionMeasure>{selected}</SelectionMeasure>`,
  imports: ["import { SelectionMeasure } from \"@kolkrabbi/kol-shell\""],
  id: 'SelectionMeasure',
}
