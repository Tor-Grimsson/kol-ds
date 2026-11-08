// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1417-14004
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=LabeledControlSection
import figma from 'figma'
// the eyebrow over a slot of LabeledControl / SettingsRow rows; also exported as RailSection (index.js)
const instance = figma.selectedInstance
const divided = instance.getEnum('divided', { "false": false, "true": true })
const rowGap = instance.getEnum('rowGap', { "2": 2, "1": 1 })
const label = instance.getString('label')
const rows = instance.getSlot('rows')

export default {
  example: figma.code`<LabeledControlSection label="${label}"${divided ? ' divided' : ''}${rowGap === 1 ? ' rowGap={1}' : ''}>
  ${rows}
</LabeledControlSection>`,
  imports: ["import { LabeledControlSection } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControlSection',
}
