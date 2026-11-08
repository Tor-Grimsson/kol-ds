// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=78-166
// source=packages/component/src/atoms/IconFrame.jsx
// component=IconFrame
import figma from 'figma'

const instance = figma.selectedInstance
const role = instance.getEnum('role', { "default": "default", "nav": "nav" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
const shape = instance.getEnum('shape', { "square": "square", "round": "round" })
const xv = role === 'nav' ? ' variant="nav"' : ''
const xs = size === 'md' ? '' : ` size="${size}"`
const xr = shape === 'round' ? ' radius="full"' : ''

export default {
  example: figma.code`<IconFrame name="search"${xv}${xs}${xr} />`,
  imports: ["import { IconFrame } from \"@kolkrabbi/kol-component\""],
  id: 'IconFrame',
}
