// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1035-26139
// source=packages/component/src/molecules/SettingsControls.jsx
// component=SettingsRange
import figma from 'figma'

export default {
  example: figma.code`<SettingsRange value={range} onChange={setRange} min={0} max={1} format={(n) => n.toFixed(2)} aria-label="From / To" />`,
  imports: ["import { SettingsRange } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsRange',
}
