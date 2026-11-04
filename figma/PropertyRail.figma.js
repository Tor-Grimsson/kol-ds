// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=571-20146
// source=packages/shell/src/PropertyRail.jsx
// component=PropertyRail
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
// tabs: the two chips' labels; `tab` is which one is lit (1 · 2), the code's `tab` value
const t1 = instance.getString('tab1')
const t2 = instance.getString('tab2')
const lit = instance.getEnum('tab', { "1": t1, "2": t2 })
const tabs = instance.getBoolean('tabs')
  ? ` tabs={[{ value: "${t1}", label: "${t1}" }, { value: "${t2}", label: "${t2}" }]} tab="${lit}" onTab={setTab}`
  : ''
export default {
  // the body slot is the rail's sections (selected · heads · rows)
  example: figma.code`<PropertyRail title="Properties" onCollapse={collapse}${tabs} selected={selected} sections={sections}${sf} />`,
  imports: ["import { PropertyRail } from \"@kolkrabbi/kol-shell\""],
  id: 'PropertyRail',
}
