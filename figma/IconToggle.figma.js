// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=78-235
// source=packages/component/src/atoms/IconToggle.jsx
// component=IconToggle
import figma from 'figma'

const instance = figma.selectedInstance
const pressed = instance.getEnum('pressed', { "true": "true", "false": "false" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })

export default {
  example: figma.code`<IconToggle pressed={${pressed}} size="${size}" icon="unlock" iconOn="lock" label="Lock" onChange={setLocked} />`,
  imports: ["import { IconToggle } from \"@kolkrabbi/kol-component\""],
  id: 'IconToggle',
}
