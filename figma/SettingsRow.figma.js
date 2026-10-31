// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=14-2
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=SettingsRow
import figma from 'figma'

export default {
  example: figma.code`<SettingsRow label="Grid">
  <SettingsSwitch on={on} onChange={setOn} />
</SettingsRow>`,
  imports: ["import { SettingsRow, SettingsSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsRow',
}
