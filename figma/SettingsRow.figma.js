// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1693-8733
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=SettingsRow
import figma from 'figma'

const instance = figma.selectedInstance
// type=custom — a control at the row's end; type=text — a row whose value is text (`text`)
const type = instance.getEnum('type', { "custom": "custom", "text": "text" })

export default {
  example: type === 'text'
    ? figma.code`<SettingsRow label="Version" text>0.357.0</SettingsRow>`
    : figma.code`<SettingsRow label="Columns" hint="Finder-style columns instead of folder rows">
  <SettingsSwitch label="Columns" on={on} onChange={setOn} />
</SettingsRow>`,
  imports: ["import { SettingsRow, SettingsSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsRow',
}
