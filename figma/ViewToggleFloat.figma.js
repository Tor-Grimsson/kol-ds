// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=577-20005
// source=packages/component/src/atoms/ViewToggle.jsx
// component=ViewToggle (float)
import figma from 'figma'

const instance = figma.selectedInstance
export default {
  example: figma.code`<ViewToggle variant="float" viewMode={view} onViewChange={setView} />`,
  imports: ["import { ViewToggle } from \"@kolkrabbi/kol-component\""],
  id: 'ViewToggleFloat',
}
