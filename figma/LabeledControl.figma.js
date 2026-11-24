// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=22-34
// source=packages/component/src/molecules/LabeledControl.jsx
// component=LabeledControl
import figma from 'figma'
// two slots, nothing baked (plan-2026-11-12-float-rails-figma W7): `label` (default: the label text, any node fits) and `control`
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "panel": "panel", "float": "float", "settings": "settings" })
const horizontal = instance.getEnum('horizontal', { "true": true, "false": false })
const labelWidth = instance.getEnum('labelWidth', { "48": "48", "74": "74", "110": "110", "160": "160", "auto": "auto" })
const label = instance.getSlot('label')
const control = instance.getSlot('control')
const v = variant === 'default' ? '' : ` variant="${variant}"`
// float's column is --kol-float-label-w (110) by default; default's is 48
const defaultW = variant === 'float' ? '110' : variant === 'settings' ? 'auto' : '48'
const w = !horizontal || labelWidth === defaultW ? '' : labelWidth === 'auto' ? ' labelWidth="auto"' : ` labelWidth={${labelWidth}}`

export default {
  example: figma.code`<LabeledControl${v}${horizontal ? ' horizontal' : ''} label={${label}}${w}>
  ${control}
</LabeledControl>`,
  imports: ["import { LabeledControl } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControl',
}
