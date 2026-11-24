// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2099-9392
// source=packages/component/src/molecules/TabsRow.jsx
// component=Tab
import figma from 'figma'
// One tab of a TabsRow, the ones the row draws itself (underline · text · float xs) — an entry of TabsRow's `tabs`; the
// lit one is the row's `value`. Chip and float sm–lg tabs are Button / Button float (plan-2026-11-12-one-header W10.2).
const instance = figma.selectedInstance
const label = instance.getString('label')
const active = instance.getEnum('active', { "true": true, "false": false })
const icon = instance.getBoolean('icon')
// kolbox (F4, 2026-11-19): the variant=kolbox member folded into this set.
const kolbox = instance.getPropertyValue('variant') === 'kolbox'

export default {
  example: kolbox ? figma.code`'${label}'${active ? ' // value' : ''}` : figma.code`{ id: '${label.toLowerCase()}', label: '${label}'${icon ? ", icon: 'layers'" : ''} }${active ? ' // value' : ''}`,
  imports: ["import { TabsRow } from \"@kolkrabbi/kol-component\""],
  id: 'Tab',
}
