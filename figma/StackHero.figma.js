// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=52-334
// source=packages/content/src/StackHero.jsx
// component=StackHero
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { default: 'default', tall: 'tall' })

export default {
  example: figma.code`<StackHero title={title} description={description} src={src} alt="" variant="${variant}" />`,
  imports: ["import { StackHero } from \"@kolkrabbi/kol-content\""],
  id: 'StackHero',
}
