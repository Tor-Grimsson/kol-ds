// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=716-56469
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=SettingsMulti
import figma from 'figma'

export default {
  example: figma.code`<SettingsMulti noun="sites" options={options} selected={selected} onToggle={onToggle} />`,
  imports: ["import { SettingsMulti } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsMulti',
}
