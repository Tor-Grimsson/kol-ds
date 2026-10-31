// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=78-250
// source=packages/component/src/atoms/Kbd.jsx
// component=Kbd
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
const icon = instance.getEnum('icon', { "true": "true", "false": "false" })

export default {
  example: icon === 'true'
    ? figma.code`<Kbd size="${size}" icon="command">K</Kbd>`
    : figma.code`<Kbd size="${size}">K</Kbd>`,
  imports: ["import { Kbd } from \"@kolkrabbi/kol-component\""],
  id: 'Kbd',
}
