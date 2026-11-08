// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20096
// source=packages/component/src/molecules/PasswordInput.jsx
// component=PasswordInput
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const revealed = instance.getEnum('revealed', { "true": true, "false": false })
export default {
  example: figma.code`<PasswordInput${variant === 'float' ? ' variant="float"' : ''} value={value} onChange={setValue}${revealed ? ' revealed onRevealChange={setRevealed}' : ''} width="100%" />`,
  imports: ["import { PasswordInput } from \"@kolkrabbi/kol-component\""],
  id: 'PasswordInput',
}
