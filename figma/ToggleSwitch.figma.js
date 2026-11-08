// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-88
// source=packages/component/src/atoms/ToggleSwitch.jsx
// component=ToggleSwitch
import figma from 'figma'

const instance = figma.selectedInstance
// variant bare · outline · primary × size sm · md × checked (2026-11-07); `labelled` hides the label.
const variant = instance.getEnum('variant', { "bare": "bare", "outline": "outline", "primary": "primary" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
const checked = instance.getEnum('checked', { "true": "true", "false": "false" })
const labelled = instance.getBoolean('labelled')
const label = instance.getString('label')
const xv = (variant === 'bare' ? '' : ` variant="${variant}"`) + (size === 'md' ? '' : ` size="${size}"`)
const dis = instance.getEnum('state', { "rest": "", "disabled": " disabled" })
export default {
  example: labelled
    ? figma.code`<ToggleSwitch${xv} label="${label}" checked={${checked}} onChange={setChecked}${dis} />`
    : figma.code`<ToggleSwitch${xv} checked={${checked}} onChange={setChecked} aria-label="${label}"${dis} />`,
  imports: ["import { ToggleSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'ToggleSwitch',
}
