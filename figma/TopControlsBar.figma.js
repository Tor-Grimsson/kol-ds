// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=571-20184
// source=packages/shell/src/TopControlsBar.jsx
// component=TopControlsBar
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<TopControlsBar document={document} tabs={tabs} tab={tab} onTab={setTab} onSearch={search} panels={{ items: panels }} action={{ label: "New task", onPress: newTask }} />`,
  imports: ["import { TopControlsBar } from \"@kolkrabbi/kol-shell\""],
  id: 'TopControlsBar',
}
