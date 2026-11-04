// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=395-20610
// source=packages/shell/src/HubSettingsRail.jsx
// component=HubSettingsRail
import figma from 'figma'

const instance = figma.selectedInstance
const tab = instance.getEnum('tab', { "settings": "settings", "shortcuts": "shortcuts" })

export default {
  example: figma.code`<HubSettingsRail open={open} onClose={close} app={app} sections={sections} shortcuts={shortcuts} tab="${tab}" onTabChange={setTab} onReset={reset} />`,
  imports: ["import { HubSettingsRail } from \"@kolkrabbi/kol-shell\""],
  id: 'HubSettingsRail',
}
