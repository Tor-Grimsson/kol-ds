// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=21-174
// source=packages/component/src/atoms/SegmentedToggle.jsx
// component=SegmentedToggle
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "filled": "filled", "tonal": "tonal", "float": "float" })
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = variant === 'float' && surface !== 'solid' ? ` surface="${surface}"` : ''
// count (float-everything W2 row 26, 2026-11-04): a mono count after a float cell's label — `{ value, label, count }`
const count = variant === 'float' && instance.getBoolean('count')
const opts = count ? 'options={[{ value: \'open\', label: \'Open\', count: 5 }, { value: \'done\', label: \'Completed\' }]}' : 'options={options}'
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })

export default {
  example: figma.code`<SegmentedToggle variant="${variant}" size="${size}"${sf} ${opts} value={value} onChange={setValue} />`,
  imports: ["import { SegmentedToggle } from \"@kolkrabbi/kol-component\""],
  id: 'SegmentedToggle',
}
