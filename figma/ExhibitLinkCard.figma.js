// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1807-9220
// source=packages/workshop/src/exhibit/ExhibitLinkCard.jsx
// component=ExhibitLinkCard
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const subtitle = instance.getString('subtitle')
const description = instance.getString('description')

export default {
  example: figma.code`<ExhibitLinkCard label="${label}" subtitle="${subtitle}" description="${description}" icon="…" href="…" />`,
  imports: ["import ExhibitLinkCard from \"@kolkrabbi/kol-workshop/src/exhibit/ExhibitLinkCard.jsx\""],
  id: 'ExhibitLinkCard',
}
