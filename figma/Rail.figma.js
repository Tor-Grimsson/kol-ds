// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=54-301
// source=packages/component/src/organisms/Rail.jsx
// component=Rail
import figma from 'figma'
/* role sets side, tier, scrim and key; phone is the code's own phone rule (useMediaQuery), never a prop */
const instance = figma.selectedInstance
const role = instance.getEnum('role', { patch: 'patch', page: 'page', settings: 'settings', bottom: 'bottom' })

export default {
  example: figma.code`<Rail role="${role}" open={open} onClose={close} header={<RailHeader title={title} />}>
  <RailSection label="Canvas">
    <RailRow label="Grid"><SettingsSwitch on={grid} onChange={setGrid} /></RailRow>
  </RailSection>
</Rail>`,
  imports: ["import { Rail, RailHeader, RailSection, RailRow, SettingsSwitch } from \"@kolkrabbi/kol-component\""],
  id: 'Rail',
}
