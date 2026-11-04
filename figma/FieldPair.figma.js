// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20076
// source=packages/component/src/molecules/FieldPair.jsx
// component=FieldPair
import figma from 'figma'
export default {
  example: figma.code`<FieldPair variant="float" fields={[{ prefix: 'X', value: x, onChange: setX }, { prefix: 'Y', value: y, onChange: setY }]} />`,
  imports: ["import { FieldPair } from \"@kolkrabbi/kol-component\""],
  id: 'FieldPair',
}
