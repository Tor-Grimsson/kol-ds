// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=283-1047
// source=packages/component/src/atoms/OriginPicker.jsx
// component=OriginPicker
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md" })
const value = instance.getEnum('value', {
  "left-top": "[0, 0]", "center-top": "[0.5, 0]", "right-top": "[1, 0]",
  "left-center": "[0, 0.5]", "center": "[0.5, 0.5]", "right-center": "[1, 0.5]",
  "left-bottom": "[0, 1]", "center-bottom": "[0.5, 1]", "right-bottom": "[1, 1]",
})

export default {
  example: figma.code`<OriginPicker size="${size}" value={${value}} onChange={setValue} ariaLabel="Transform origin" />`,
  imports: ["import { OriginPicker } from \"@kolkrabbi/kol-component\""],
  id: 'OriginPicker',
}
