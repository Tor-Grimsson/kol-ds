// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=21-174
// source=packages/component/src/atoms/SegmentedToggle.jsx
// component=SegmentedToggle
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "filled": "filled", "tonal": "tonal", "float": "float" })
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = variant === 'float' && surface !== 'solid' ? ` surface="${surface}"` : ''
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })

export default {
  example: figma.code`<SegmentedToggle variant="${variant}" size="${size}"${sf} options={options} value={value} onChange={setValue} />`,
  imports: ["import { SegmentedToggle } from \"@kolkrabbi/kol-component\""],
  id: 'SegmentedToggle',
}
