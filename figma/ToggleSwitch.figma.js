// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-88
// source=packages/component/src/atoms/ToggleSwitch.jsx
// component=ToggleSwitch
import figma from 'figma'

const instance = figma.selectedInstance
// variant bare · outline · primary · float × size × checked. No label: a labelled switch is a LabeledControl (LAW 17).
const variant = instance.getEnum('variant', { "bare": "bare", "outline": "outline", "primary": "primary", "float": "float", "kolbox": "kolbox" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })
const checked = instance.getEnum('checked', { "true": "true", "false": "false" })
const xv = (variant === 'bare' ? '' : ` variant="${variant}"`) + (size === 'md' ? '' : ` size="${size}"`)
const dis = instance.getEnum('disabled', { "false": "", "true": " disabled" })
export default {
  example: figma.code`<ToggleSwitch${xv} checked={${checked}} onChange={setChecked} aria-label={label}${dis} />`,
  imports: ["import { ToggleSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'ToggleSwitch',
}
