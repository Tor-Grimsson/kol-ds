// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12370
// source=packages/component/src/molecules/SwatchGrid.jsx
// component=SwatchGrid
import figma from 'figma'

// SwatchGrid (new with kolbox). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<SwatchGrid colors={colors} />`

export default {
  example,
  imports: ["import { SwatchGrid } from \"@kolkrabbi/kol-component\""],
  id: 'SwatchGrid',
  metadata: { nestable: true },
}
