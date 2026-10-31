// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=14-9
// source=packages/component/src/molecules/Rail.jsx
// component=Rail
import figma from 'figma'

export default {
  example: figma.code`<Rail open={open} onClose={close} side="right" width={380} header={<RailHeader title="Settings" subtitle="Canvas" />}>
  <SettingsRow label="Grid"><SettingsSwitch on={grid} onChange={setGrid} /></SettingsRow>
  <SettingsRow label="Units"><SettingsChoice options={['px', 'rem', 'pt']} value={units} onChange={setUnits} /></SettingsRow>
</Rail>`,
  imports: ["import { Rail, RailHeader, SettingsRow, SettingsSwitch, SettingsChoice } from \"@kolkrabbi/kol-component\""],
  id: 'Rail',
}
