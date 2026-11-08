// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=22-34
// source=packages/component/src/molecules/LabeledControl.jsx
// component=LabeledControl
import figma from 'figma'
// label (+ hint) and a `control` slot — nothing baked (W4R 4.8, 2026-11-07); the slot holds the real control instance
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "panel": "panel", "float": "float" })
const inline = instance.getEnum('inline', { "true": true, "false": false })
const labelWidth = instance.getEnum('labelWidth', { "48": "48", "74": "74", "160": "160", "auto": "auto" })
const label = instance.getString('label')
const hint = instance.getBoolean('hint') ? ` hint="${instance.getString('hintText')}"` : ''
const control = instance.getSlot('control')
const v = variant === 'default' ? '' : ` variant="${variant}"`
const w = !inline || labelWidth === '48' ? '' : labelWidth === 'auto' ? ' labelWidth="auto"' : ` labelWidth={${labelWidth}}`

export default {
  example: figma.code`<LabeledControl${v}${inline ? ' inline' : ''} label="${label}"${hint}${w}>
  ${control}
</LabeledControl>`,
  imports: ["import { LabeledControl } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControl',
}
