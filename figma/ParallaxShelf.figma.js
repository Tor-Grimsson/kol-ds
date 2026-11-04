// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=472-15186
// source=packages/content/src/ParallaxShelf.jsx
// component=ParallaxShelf
import figma from 'figma'

/* the items slot holds the cards; in code they are the items array. breakpoint is the viewport, not a prop */
const instance = figma.selectedInstance
const label = instance.getString('label')
const fromLeft = instance.getEnum('fromLeft', { true: ' fromLeft', false: '' })

export default {
  example: figma.code`<ParallaxShelf type={{ label: "${label}" }} items={items}${fromLeft} />`,
  imports: ["import { ParallaxShelf } from \"@kolkrabbi/kol-content\""],
  id: 'ParallaxShelf',
}
