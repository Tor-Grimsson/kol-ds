// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1417-14004
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=LabeledControlSection
import figma from 'figma'
// head (label slot · end slot) over the items slot; variant default · float · settings (plan-2026-11-12-float-rails-figma W10.2, W13.1).
// gap / rowGap are spacing overrides on the instance, not properties.
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "", "float": ' variant="float"', "settings": ' variant="settings"' })
const divided = instance.getEnum('divided', { "false": false, "true": true })
const label = instance.getSlot('label')
const end = instance.getSlot('end')
const items = instance.getSlot('items')
// collapsible: the 12 chevron at the head's right end (W10.2); open=false hides the items
const collapsible = instance.getBoolean('collapsible')
const open = instance.getEnum('open', { "true": true, "false": false })
const col = collapsible ? (open ? ' collapsible' : ' collapsible defaultOpen={false}') : ''

export default {
  example: figma.code`<LabeledControlSection${variant} label={${label}} end={${end}}${divided ? ' divided' : ''}${col}>
  ${items}
</LabeledControlSection>`,
  imports: ["import { LabeledControlSection } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControlSection',
}
