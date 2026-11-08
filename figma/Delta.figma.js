// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=576-19981
// source=packages/component/src/atoms/Delta.jsx
// component=Delta
import figma from 'figma'

const instance = figma.selectedInstance
const direction = instance.getEnum('direction', { "up": "up", "down": "down" })
const value = instance.getString('value')
const from = instance.getString('from').replace(/^(from|was) /, '')
const xd = direction === 'up' ? '' : ' direction="down"'

export default {
  example: figma.code`<Delta value="${value}"${xd} from="${from}" />`,
  imports: ["import { Delta } from \"@kolkrabbi/kol-component\""],
  id: 'Delta',
}
