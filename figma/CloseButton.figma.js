// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=78-198
// source=packages/component/src/atoms/CloseButton.jsx
// component=CloseButton
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })

export default {
  example: figma.code`<CloseButton size="${size}" onClick={close} />`,
  imports: ["import { CloseButton } from \"@kolkrabbi/kol-component\""],
  id: 'CloseButton',
}
