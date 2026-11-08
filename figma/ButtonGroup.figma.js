// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=21-174
// source=packages/component/src/molecules/ButtonGroup.jsx
// component=ButtonGroup
// layout row · stack hold Buttons (the `buttons` slot); joined is the segmented control (SegmentedToggle is its alias).
import figma from 'figma'

const instance = figma.selectedInstance
const layout = instance.getEnum('layout', { "row": "row", "stack": "stack", "joined": "joined" })
const variant = instance.getEnum('variant', { "default": "default", "filled": "filled", "tonal": "tonal", "float": "float" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const iconOnly = instance.getEnum('iconOnly', { "true": true, "false": false })
const count = layout === 'joined' && variant === 'float' && instance.getBoolean('count')

const v = variant !== 'default' ? ` variant="${variant}"` : ''
const sz = size !== 'md' ? ` size="${size}"` : ''
const sf = variant === 'float' && surface !== 'solid' ? ` surface="${surface}"` : ''
const opts = iconOnly
  ? `options={[{ value: 'play', ariaLabel: 'Play', label: <IconLoader name="play" size={16} /> }, { value: 'pause', ariaLabel: 'Pause', label: <IconLoader name="pause" size={16} /> }]}`
  : count
    ? `options={[{ value: 'open', label: 'Open', count: 5 }, { value: 'done', label: 'Completed' }]}`
    : 'options={options}'

export default {
  example: layout === 'joined'
    ? figma.code`<ButtonGroup layout="joined"${v}${sz}${sf} ${opts} value={value} onChange={setValue} />`
    : figma.code`<ButtonGroup layout="${layout}">
  <Button>Cancel</Button>
  <Button tone="inverted">Save</Button>
</ButtonGroup>`,
  imports: ["import { ButtonGroup, Button } from \"@kolkrabbi/kol-component\""],
  id: 'ButtonGroup',
}
