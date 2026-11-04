// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=456-11783
// source=packages/component/src/molecules/PageHeader.jsx
// component=PageHeader
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const subtitle = instance.getString('subtitle')

export default {
  example: figma.code`<PageHeader title="${title}" subtitle="${subtitle}" size="sm" voice="mono" />`,
  imports: ["import { PageHeader } from \"@kolkrabbi/kol-component\""],
  id: 'PageHeader',
}
