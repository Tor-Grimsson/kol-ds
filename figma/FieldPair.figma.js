// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1256-4770
// source=packages/component/src/molecules/FieldPair.jsx
// component=FieldPair
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "float": "float", "default": "default" })
export default {
  example: variant === 'float'
    ? figma.code`<FieldPair variant="float" size="sm" fields={[{ prefix: 'X', value: x, onChange: setX }, { prefix: 'Y', value: y, onChange: setY }]} />`
    : figma.code`<FieldPair fields={[{ prefix: 'X', value: x, onChange: setX }, { prefix: 'Y', value: y, onChange: setY }]} />`,
  imports: ["import { FieldPair } from \"@kolkrabbi/kol-component\""],
  id: 'FieldPair',
}
