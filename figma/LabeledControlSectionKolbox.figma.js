// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12332
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=LabeledControlSection
import figma from 'figma'

// LabeledControlSection variant="kolbox" (kolbox's RailSection); open=false is the closed section, its rows not rendered. (F4, 2026-11-19)
const instance = figma.selectedInstance
const open = instance.getEnum('open', { true: true, false: false })
const label = instance.getBoolean('show title') ? instance.getString('label') : undefined
const end = instance.getSlot('end')
const items = open ? instance.getSlot('items') : undefined
const example = figma.code`<LabeledControlSection variant="kolbox"${label ? ` label="${label}"` : ''}${end ? figma.code` end={${end}}` : ''}>${items}</LabeledControlSection>`

export default {
  example,
  imports: ["import { LabeledControlSection } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControlSectionKolbox',
  metadata: { nestable: true },
}
