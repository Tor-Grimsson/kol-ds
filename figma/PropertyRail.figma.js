// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=571-20146
// source=packages/shell/src/PropertyRail.jsx
// component=PropertyRail
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
export default {
  example: figma.code`<PropertyRail title="Properties" onCollapse={collapse} tabs={tabs} tab={tab} onTab={setTab} selected={selected} sections={sections}${sf} />`,
  imports: ["import { PropertyRail } from \"@kolkrabbi/kol-shell\""],
  id: 'PropertyRail',
}
