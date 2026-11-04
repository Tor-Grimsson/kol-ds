// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-88
// source=packages/component/src/atoms/ToggleSwitch.jsx
// component=ToggleSwitch
import figma from 'figma'

const instance = figma.selectedInstance
// variant (float-everything W2 row 21, 2026-11-04): float is the 32 × 20 track, one size
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const xv = variant === 'float' ? ' variant="float"' : ''
const checked = instance.getEnum('checked', { "true": "true", "false": "false" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
const label = instance.getString('label')
/* labelled=false is the bare 30x12 row switch (SettingsSwitch: no label, size sm) */
const labelled = instance.getEnum('labelled', { "true": true, "false": false })

export default {
  example: labelled
    ? figma.code`<ToggleSwitch${xv} label="${label}" checked={${checked}} size="${size}" onChange={setChecked} />`
    : figma.code`<ToggleSwitch${xv} checked={${checked}} size="${size}" onChange={setChecked} aria-label="Label" />`,
  imports: ["import { ToggleSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'ToggleSwitch',
}
