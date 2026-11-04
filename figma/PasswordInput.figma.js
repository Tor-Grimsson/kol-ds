// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20096
// source=packages/component/src/molecules/PasswordInput.jsx
// component=PasswordInput
import figma from 'figma'
const instance = figma.selectedInstance
const revealed = instance.getEnum('revealed', { "true": "true", "false": "false" })
export default {
  example: revealed === 'true'
    ? figma.code`<PasswordInput variant="float" value={value} onChange={setValue} revealed onRevealChange={setRevealed} width="100%" />`
    : figma.code`<PasswordInput variant="float" value={value} onChange={setValue} width="100%" />`,
  imports: ["import { PasswordInput } from \"@kolkrabbi/kol-component\""],
  id: 'PasswordInput',
}
