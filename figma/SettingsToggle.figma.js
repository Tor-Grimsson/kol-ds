// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1035-26162
// source=packages/component/src/molecules/SettingsControls.jsx
// component=SettingsToggle
import figma from 'figma'

export default {
  example: figma.code`<SettingsToggle label="Invert" checked={invert} onChange={setInvert} />`,
  imports: ["import { SettingsToggle } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsToggle',
}
