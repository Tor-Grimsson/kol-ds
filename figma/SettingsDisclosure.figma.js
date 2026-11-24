// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1035-26232
// source=packages/component/src/organisms/SettingsPanel.jsx
// component=SettingsDisclosure
import figma from 'figma'

export default {
  example: figma.code`<SettingsDisclosure label="More geometry" note="Waves, dash & offsets" open={open} onToggle={setOpen}>{cells}</SettingsDisclosure>`,
  imports: ["import { SettingsDisclosure } from \"@kolkrabbi/kol-component\""],
  id: 'SettingsDisclosure',
}
