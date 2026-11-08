// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1035-26148
// source=packages/component/src/molecules/SettingsControls.jsx
// component=SettingsSelect
import figma from 'figma'

export default {
  example: figma.code`<SettingsSelect value={spacing} onChange={setSpacing} options={options} ariaLabel="Spacing" />`,
  imports: ["import { SettingsSelect } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsSelect',
}
