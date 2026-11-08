// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1196-3106
// source=packages/component/src/atoms/ToggleSwitch.jsx
// component=ToggleSwitch (float)
import figma from 'figma'

const instance = figma.selectedInstance
const checked = instance.getEnum('checked', { "true": "true", "false": "false" })
const dis = instance.getEnum('state', { "rest": "", "disabled": " disabled" })
export default {
  example: figma.code`<ToggleSwitch variant="float" label="${instance.getString('label')}" checked={${checked}} onChange={setChecked}${dis} />`,
  imports: ["import { ToggleSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'ToggleSwitchFloat',
}
