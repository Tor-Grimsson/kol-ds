// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-88
// source=packages/component/src/atoms/ToggleSwitch.jsx
// component=ToggleSwitch
import figma from 'figma'

const instance = figma.selectedInstance
const checked = instance.getEnum('checked', { "true": "true", "false": "false" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
const label = instance.getString('label')

export default {
  example: figma.code`<ToggleSwitch label="${label}" checked={${checked}} size="${size}" onChange={setChecked} />`,
  imports: ["import { ToggleSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'ToggleSwitch',
}
