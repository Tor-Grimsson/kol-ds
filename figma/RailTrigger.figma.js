// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-19923
// source=packages/shell/src/RailTrigger.jsx
// component=RailTrigger
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
export default {
  example: figma.code`<RailTrigger title="Studio" items={nav} currentPath={path} onNavigate={navigate} breadcrumb={['Dashboard', 'Tasks']}${sf} />`,
  imports: ["import { RailTrigger } from \"@kolkrabbi/kol-shell\""],
  id: 'RailTrigger',
}
