// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=456-11766
// source=packages/framework/src/PageHero.jsx
// component=PageHero
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const title = instance.getString('title')
const lede = instance.getString('lede')

export default {
  example: figma.code`<PageHero label="${label}" title="${title}" lede="${lede}" />`,
  imports: ["import { PageHero } from \"@kolkrabbi/kol-framework\""],
  id: 'PageHero',
}
