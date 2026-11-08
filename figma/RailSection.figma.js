// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1258-4988
// source=packages/workshop/src/shell/RailSection.jsx
// component=RailSection
import figma from 'figma'
// level 1 = .shell-sidebar-toggle (the category eyebrow), level 2 = .shell-nav-group-header (the chapter); children is the slot
const instance = figma.selectedInstance
const level = instance.getEnum('level', { "1": 1, "2": 2 })
const collapsed = instance.getEnum('collapsed', { "false": false, "true": true })
const label = instance.getString('label')
const children = instance.getSlot('children')
export default {
  example: figma.code`<RailSection level={${level}} label="${label}" count={count} collapsed={${collapsed}} onToggle={toggle}>
  ${children}
</RailSection>`,
  imports: ["import { RailSection } from \"@kolkrabbi/kol-workshop\""],
  id: 'RailSection',
}
