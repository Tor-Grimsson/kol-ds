// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=576-19991
// source=packages/component/src/atoms/LiveDot.jsx
// component=LiveDot
import figma from 'figma'

const instance = figma.selectedInstance
const count = instance.getString('count')
const label = instance.getString('label')

export default {
  example: figma.code`<LiveDot count={${count}} label="${label}" />`,
  imports: ["import { LiveDot } from \"@kolkrabbi/kol-component\""],
  id: 'LiveDot',
}
