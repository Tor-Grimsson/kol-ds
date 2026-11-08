// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1035-26184
// source=packages/component/src/molecules/SettingsControls.jsx
// component=SettingsRamp
import figma from 'figma'

export default {
  example: figma.code`<SettingsRamp label="Width" value={ramp} onChange={setRamp} curves={curves} />`,
  imports: ["import { SettingsRamp } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsRamp',
}
