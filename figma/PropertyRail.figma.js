// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=571-20146
// source=packages/shell/src/PropertyRail.jsx
// component=PropertyRail
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
// tabs: the nested float TabsRow (xs); `tab` is which one is lit (1 · 2)
const lit = instance.getEnum('tab', { "1": "design", "2": "animate" })
const tabs = instance.getBoolean('tabs')
  ? ` tabs={[{ value: "design", label: "Design" }, { value: "animate", label: "Animate" }]} tab="${lit}" onTab={setTab}`
  : ''
const density = instance.getEnum('density', { "regular": "regular", "compact": "compact" })
const dn = density === 'compact' ? ' density="compact" onExpand={expand} footer={footer}' : ''
export default {
  // the body slot is the rail's sections (selected · heads · rows)
  example: figma.code`<PropertyRail title="Properties" onCollapse={collapse}${tabs} selected={selected} sections={sections}${sf}${dn} />`,
  imports: ["import { PropertyRail } from \"@kolkrabbi/kol-shell\""],
  id: 'PropertyRail',
}
