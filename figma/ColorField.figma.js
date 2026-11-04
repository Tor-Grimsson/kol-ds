// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20122
// source=packages/component/src/molecules/ColorField.jsx
// component=ColorField
import figma from 'figma'
const instance = figma.selectedInstance
const label = instance.getString('label')
const hex = instance.getString('hex')
export default {
  example: figma.code`<ColorField label="${label}" value="${hex.toLowerCase()}" onClick={openPicker} />`,
  imports: ["import { ColorField } from \"@kolkrabbi/kol-component\""],
  id: 'ColorField',
}
