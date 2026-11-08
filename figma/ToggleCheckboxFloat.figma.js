// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1196-3163
// source=packages/component/src/atoms/ToggleCheckbox.jsx
// component=ToggleCheckbox (float)
import figma from 'figma'

const instance = figma.selectedInstance
const checked = instance.getEnum('checked', { "true": "true", "false": "false" })
export default {
  example: figma.code`<ToggleCheckbox variant="float" label="Accept" checked={${checked}} onChange={setChecked} />`,
  imports: ["import { ToggleCheckbox } from \"@kolkrabbi/kol-component\""],
  id: 'ToggleCheckboxFloat',
}
