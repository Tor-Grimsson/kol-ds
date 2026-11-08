// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=659-20591
// source=packages/component/src/molecules/QuantityInput.jsx
// component=QuantityInput
import figma from 'figma'
// variant float (the capsule, hugs its value) · default with controls chevron | split
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "float": "float", "default": "default" })
const controls = instance.getEnum('controls', { "chevron": "chevron", "split": "split" })
const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })
const value = instance.getString('value')
const un = instance.getBoolean('unit') ? ` unit="${instance.getString('unitText')}"` : ''
const sz = size !== 'md' ? ` size="${size}"` : ''
export default {
  example: variant === 'float'
    ? figma.code`<QuantityInput variant="float" value={${value}} onChange={setValue}${un}${sz} />`
    : figma.code`<QuantityInput value={${value}} onChange={setValue}${controls === 'split' ? ' controls="split"' : ''} />`,
  imports: ["import { QuantityInput } from \"@kolkrabbi/kol-component\""],
  id: 'QuantityInput',
}
