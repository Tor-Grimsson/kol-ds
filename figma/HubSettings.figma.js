// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1510-27996
// source=packages/shell/src/HubSettings.jsx
// component=HubSettings
import figma from 'figma'

const instance = figma.selectedInstance
const filters = instance.getEnum('filters', { "true": true, "false": false })

export default {
  example: filters
    ? figma.code`<HubSettings app={app} sections={sections} shortcuts={shortcuts} themeToggle={themeToggle} drawer />`
    : figma.code`<HubSettings app={app} sections={sections} shortcuts={shortcuts} themeToggle={themeToggle} filters={false} drawer />`,
  imports: ["import { HubSettings } from \"@kolkrabbi/kol-shell\""],
  id: 'HubSettings',
}
