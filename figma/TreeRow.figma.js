// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=583-20231
// source=packages/component/src/molecules/TreeRow.jsx
// component=TreeRow
import figma from 'figma'
const instance = figma.selectedInstance
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })
const state = instance.getEnum('state', { "rest": "rest", "active": "active", "open": "open" })

export default {
  example: figma.code`<TreeRow size="${size}" icon="checklist" label="Tasks" count={5}${state === 'active' ? ' active' : ''}${state === 'open' ? ' open expanded onToggle={toggle}' : ''} onClick={go} />`,
  imports: ["import { TreeRow } from \"@kolkrabbi/kol-component\""],
  id: 'TreeRow',
}
