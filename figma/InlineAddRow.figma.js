// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20097
// source=packages/component/src/molecules/InlineAddRow.jsx
// component=InlineAddRow
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.getString('label')
export default {
  example: figma.code`<InlineAddRow variant="float" label="${label}" onAdd={add} />`,
  imports: ["import { InlineAddRow } from \"@kolkrabbi/kol-component\""],
  id: 'InlineAddRow',
}
