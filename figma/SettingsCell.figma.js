// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1035-26123
// source=packages/component/src/molecules/SettingsControls.jsx
// component=SettingsCell
import figma from 'figma'

export default {
  example: figma.code`<SettingsCell label="Count"><SettingsSlider value={count} onChange={setCount} min={1} max={120} step={1} aria-label="Count" /></SettingsCell>`,
  imports: ["import { SettingsCell } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsCell',
}
