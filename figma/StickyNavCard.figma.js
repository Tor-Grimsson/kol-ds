// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=146-605
// source=packages/content/src/prose/StickyNavCard.jsx
// component=StickyNavCard
import figma from 'figma'

// state: passed = collapsed (above the active section), active = isActive, upcoming = rest.
const instance = figma.selectedInstance
const heading = instance.getString('heading')
const body = instance.getString('body')
const b1 = instance.getString('bullet1')
const b2 = instance.getString('bullet2')
const state = instance.getEnum('state', { passed: ' collapsed', active: ' isActive', upcoming: '' })

export default {
  example: figma.code`<StickyNavCard heading="${heading}" body="${body}" bullets={["${b1}", "${b2}"]} index={index}${state} onClick={onClick} />`,
  imports: ["import { StickyNavCard } from \"@kolkrabbi/kol-content\""],
  id: 'StickyNavCard',
}
