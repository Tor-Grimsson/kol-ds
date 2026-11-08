// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1035-26170
// source=packages/component/src/molecules/SettingsControls.jsx
// component=SettingsPoint
import figma from 'figma'

export default {
  example: figma.code`<SettingsPoint value={point} onChange={setPoint} min={-0.5} max={1.5} aria-label="Centre" />`,
  imports: ["import { SettingsPoint } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsPoint',
}
