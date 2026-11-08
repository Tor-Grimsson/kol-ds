// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=20-20
// source=packages/component/src/atoms/ToggleCheckbox.jsx
// component=ToggleCheckbox
import figma from 'figma'

const instance = figma.selectedInstance
// variant default · media × checked (2026-11-07)
const variant = instance.getEnum('variant', { "default": "default", "media": "media" })
const checked = instance.getEnum('checked', { "true": "true", "false": "false" })
const xv = variant === 'media' ? ' variant="media"' : ''
export default {
  example: figma.code`<ToggleCheckbox${xv} label="Accept" checked={${checked}} onChange={setChecked} />`,
  imports: ["import { ToggleCheckbox } from \"@kolkrabbi/kol-component\""],
  id: 'ToggleCheckbox',
}
