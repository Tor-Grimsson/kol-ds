// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=659-20591
// source=packages/component/src/molecules/QuantityInput.jsx
// component=QuantityInput
import figma from 'figma'

const instance = figma.selectedInstance
// variant float (2026-11-04): the float stepper, − value + on the float well; `unit` is the word after the value
const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })
const value = instance.getString('value')
const hasUnit = instance.getBoolean('unit')
const unit = instance.getString('unitText')
const sz = size !== 'md' ? ` size="${size}"` : ''
const un = hasUnit ? ` unit="${unit}"` : ''

export default {
  example: figma.code`<QuantityInput variant="float" value={${value}} onChange={setValue}${un}${sz} />`,
  imports: ["import { QuantityInput } from \"@kolkrabbi/kol-component\""],
  id: 'QuantityInput',
}
