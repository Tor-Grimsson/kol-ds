// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1486-13749
// source=packages/component/src/organisms/RailKit.jsx
// component=RailActions
import figma from 'figma'
const instance = figma.selectedInstance
const row = instance.getEnum('row', { true: ' row', false: '' })
export default {
  example: figma.code`<RailActions${row}>{buttons}</RailActions>`,
  imports: ["import { RailActions } from \"@kolkrabbi/kol-component\""],
  id: 'RailActions',
}
