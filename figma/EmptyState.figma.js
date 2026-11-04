// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=678-25038
// source=packages/component/src/molecules/EmptyState.jsx
// component=EmptyState
import figma from 'figma'

const instance = figma.selectedInstance
const eyebrow = instance.getBoolean('showEyebrow') ? ` eyebrow="${instance.getString('eyebrow')}"` : ''
const footer = instance.getBoolean('showFooter') ? ` footer="${instance.getString('footer')}"` : ''

export default {
  example: figma.code`<EmptyState variant="float"${eyebrow} title="${instance.getString('title')}" body="${instance.getString('body')}"${footer} />`,
  imports: ["import { EmptyState } from \"@kolkrabbi/kol-component\""],
  id: 'EmptyState',
}
