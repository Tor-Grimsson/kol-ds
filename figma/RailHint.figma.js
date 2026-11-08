// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1486-13696
// source=packages/component/src/organisms/RailKit.jsx
// component=RailHint
import figma from 'figma'
const instance = figma.selectedInstance
const text = instance.getString('text')
export default {
  example: figma.code`<RailHint>${text}</RailHint>`,
  imports: ["import { RailHint } from \"@kolkrabbi/kol-component\""],
  id: 'RailHint',
}
