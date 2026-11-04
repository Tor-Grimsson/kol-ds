// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=471-14979
// source=packages/content/src/WorkViewToggle.jsx
// component=WorkViewToggle
import figma from 'figma'

const instance = figma.selectedInstance
const view = instance.getEnum('view', { shelf: 'shelf', list: 'list' })

export default {
  example: figma.code`<WorkViewToggle view="${view}" onView={setView} query={query} onQuery={setQuery} listIcon="view-list" />`,
  imports: ["import { WorkViewToggle } from \"@kolkrabbi/kol-content\""],
  id: 'WorkViewToggle',
}
